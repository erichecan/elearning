const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs-extra');
require('dotenv').config();

class DatabaseFlashcardScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.baseUrl = 'https://kids-flashcards.com';
        this.categories = [];
        this.languages = ['en']; // 专注于英文
        this.stats = {
            totalWords: 0,
            totalCategories: 0,
            successfulInserts: 0,
            failedInserts: 0,
            skippedWords: 0
        };
        
        // 初始化Supabase客户端
        this.supabase = null;
        this.initSupabase();
        
        // 分类映射表 - 将kids-flashcards分类映射到数据库分类
        this.categoryMapping = {
            'easter': 'daily_phrases',
            'gadgets': 'daily_phrases', 
            'jungle animals': 'animals',
            'fruits': 'fruits',
            'vegetables': 'fruits', // 蔬菜也放到fruits分类
            'colors': 'colors',
            'numbers (1 20)': 'numbers',
            'domestic animals': 'animals',
            'farm animals': 'animals',
            'sea animals': 'animals',
            'furniture': 'daily_phrases',
            'kitchenware': 'food',
            'classroom objects': 'daily_phrases',
            'school building': 'daily_phrases',
            'opposites': 'daily_phrases'
        };
    }

    initSupabase() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            console.error('❌ 请设置 SUPABASE_URL 和 SUPABASE_ANON_KEY 环境变量');
            console.log('📝 复制 env.example 为 .env 并填入您的Supabase配置');
            process.exit(1);
        }
        
        this.supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase 客户端初始化成功');
    }

    async init() {
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
        console.log('🚀 数据库爬虫初始化完成');
    }

    async exploreCategories() {
        console.log('🔍 探索闪卡分类...');
        
        await this.page.goto(`${this.baseUrl}/en`, { timeout: 15000 });
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });

        const categoryLinks = await this.page.$$eval('a', links => 
            links.map(link => ({
                href: link.href,
                text: link.textContent.trim(),
                title: link.title
            })).filter(link => 
                link.href.includes('flashcards') && 
                link.href.includes('/en/free-printable/')
            )
        );

        console.log(`📂 发现 ${categoryLinks.length} 个分类`);

        // 转换为我们的数据结构
        this.categories = categoryLinks.map(link => ({
            name: this.extractCategoryName(link.href),
            url: link.href,
            text: link.text
        }));

        this.stats.totalCategories = this.categories.length;
        return this.categories;
    }

    extractCategoryName(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const categoryPart = pathParts[pathParts.length - 1];
            return categoryPart.replace('-flashcards-in-english', '')
                              .replace('-flashcards', '')
                              .replace(/-/g, ' ')
                              .toLowerCase();
        } catch (e) {
            return 'unknown';
        }
    }

    async getOrCreateCategory(categoryName) {
        // 获取映射的数据库分类名
        const dbCategoryName = this.categoryMapping[categoryName] || 'daily_phrases';
        
        // 从数据库获取分类
        const { data: category, error } = await this.supabase
            .from('categories')
            .select('id, name')
            .eq('name', dbCategoryName)
            .single();

        if (error) {
            console.error(`❌ 获取分类失败 ${dbCategoryName}:`, error.message);
            return null;
        }

        return category;
    }

    async scrapeCategory(category) {
        console.log(`📖 正在爬取分类: ${category.name}`);
        
        try {
            await this.page.goto(category.url, { timeout: 15000 });
            await this.page.waitForLoadState('networkidle', { timeout: 10000 });

            // 获取数据库分类
            const dbCategory = await this.getOrCreateCategory(category.name);
            if (!dbCategory) {
                console.log(`⚠️ 跳过分类 ${category.name}: 无法找到对应的数据库分类`);
                return;
            }

            // 提取闪卡图片和单词信息
            const flashcards = await this.page.evaluate(() => {
                const cards = [];
                const images = document.querySelectorAll('img');
                
                for (let img of images) {
                    const src = img.src;
                    const alt = img.alt || '';
                    const title = img.title || '';
                    
                    // 过滤出闪卡图片
                    if (src && alt && 
                        !src.includes('logo') && 
                        !src.includes('icon') && 
                        !src.includes('button') &&
                        !alt.includes('flashcards') && // 排除分类封面
                        !alt.includes('vocabulary cards') && // 排除其他语言版本
                        !alt.includes('Picture Cards') && // 排除宣传图
                        !alt.includes('Free Printable') &&
                        !alt.includes('for translate') && // 排除重复翻译卡片
                        (src.includes('thumbs/') || src.includes('/images/')) && // 确保是单词图片
                        alt.length < 50 && // 单词不应该太长
                        !alt.includes('flashcard') // 排除包含flashcard的标题
                    ) {
                        // 清理单词名称
                        let word = alt.replace(/\s+picture\s+flashcards?/gi, '')
                                     .replace(/\s+card\s+for\s+translate/gi, '')
                                     .replace(/^\d+\s+/, '') // 移除开头数字
                                     .trim();
                        
                        if (word && word.length > 0 && word.length < 30) {
                            cards.push({
                                word: word,
                                imageUrl: src,
                                alt: alt
                            });
                        }
                    }
                }
                
                return cards;
            });

            console.log(`🖼️ 提取到 ${flashcards.length} 个闪卡:`);
            
            // 去重 - 基于单词名称
            const uniqueCards = [];
            const seenWords = new Set();
            
            for (const card of flashcards) {
                const normalizedWord = card.word.toLowerCase().trim();
                if (!seenWords.has(normalizedWord)) {
                    seenWords.add(normalizedWord);
                    uniqueCards.push(card);
                }
            }

            console.log(`✨ 去重后: ${uniqueCards.length} 个唯一闪卡`);

            // 插入数据库
            for (const card of uniqueCards) {
                await this.insertWord(card, dbCategory);
                await new Promise(resolve => setTimeout(resolve, 100)); // 小延迟
            }

        } catch (error) {
            console.error(`❌ 爬取分类失败 ${category.name}:`, error.message);
            this.stats.failedInserts++;
        }
    }

    async insertWord(card, dbCategory) {
        try {
            // 检查单词是否已存在
            const { data: existingWord, error: selectError } = await this.supabase
                .from('words')
                .select('id')
                .eq('word', card.word)
                .eq('category_id', dbCategory.id)
                .single();

            if (existingWord) {
                console.log(`⏭️ 跳过已存在的单词: ${card.word}`);
                this.stats.skippedWords++;
                return;
            }

            // 插入新单词
            const { data, error } = await this.supabase
                .from('words')
                .insert({
                    word: card.word,
                    chinese: '', // 暂时留空，可以后续翻译
                    image_url: card.imageUrl,
                    category_id: dbCategory.id,
                    difficulty_level: 1,
                    is_active: true
                })
                .select();

            if (error) {
                console.error(`❌ 插入单词失败 ${card.word}:`, error.message);
                this.stats.failedInserts++;
            } else {
                console.log(`✅ 成功插入: ${card.word} -> ${card.imageUrl}`);
                this.stats.successfulInserts++;
                this.stats.totalWords++;
            }

        } catch (error) {
            console.error(`❌ 处理单词出错 ${card.word}:`, error.message);
            this.stats.failedInserts++;
        }
    }

    async scrapeAllCategories() {
        console.log('🎯 开始爬取所有分类...');
        
        for (let i = 0; i < this.categories.length; i++) {
            const category = this.categories[i];
            console.log(`\n📚 [${i + 1}/${this.categories.length}] 处理分类: ${category.name}`);
            
            await this.scrapeCategory(category);
            
            // 分类间添加延迟
            await this.page.waitForTimeout(2000);
            
            // 每3个分类后显示进度
            if ((i + 1) % 3 === 0) {
                console.log(`\n📊 进度报告 [${i + 1}/${this.categories.length}]:`);
                console.log(`  ✅ 成功插入: ${this.stats.successfulInserts}`);
                console.log(`  ⏭️ 跳过重复: ${this.stats.skippedWords}`);
                console.log(`  ❌ 失败插入: ${this.stats.failedInserts}`);
                console.log(`  📝 总单词数: ${this.stats.totalWords}`);
            }
        }
    }

    async generateReport() {
        const reportData = {
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            statistics: this.stats,
            categories: this.categories.map(cat => ({
                name: cat.name,
                url: cat.url,
                dbCategory: this.categoryMapping[cat.name] || 'daily_phrases'
            })),
            categoryMapping: this.categoryMapping
        };

        await fs.writeJson('./database-scraping-report.json', reportData, { spaces: 2 });
        console.log('📊 生成数据库爬取报告: database-scraping-report.json');
        
        // 打印最终统计
        console.log('\n🎉 数据库爬取完成！最终统计:');
        console.log(`  📂 总分类数: ${this.stats.totalCategories}`);
        console.log(`  📝 总单词数: ${this.stats.totalWords}`);
        console.log(`  ✅ 成功插入: ${this.stats.successfulInserts}`);
        console.log(`  ⏭️ 跳过重复: ${this.stats.skippedWords}`);
        console.log(`  ❌ 失败插入: ${this.stats.failedInserts}`);
        console.log(`  ⏱️ 用时: ${Math.round(reportData.duration / 1000 / 60)} 分钟`);
        
        return reportData;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('✅ 数据库爬虫已关闭');
    }

    async run() {
        this.startTime = Date.now();
        try {
            await this.init();
            await this.exploreCategories();
            await this.scrapeAllCategories();
            await this.generateReport();
            
        } catch (error) {
            console.error('❌ 爬取过程中出现错误:', error);
            console.error('错误详情:', error.stack);
        } finally {
            await this.close();
        }
    }
}

// 运行数据库爬虫
(async () => {
    const scraper = new DatabaseFlashcardScraper();
    await scraper.run();
})(); 