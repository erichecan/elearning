const { chromium } = require('playwright');
const LocalDatabase = require('./local-database');

class LocalFlashcardScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.db = new LocalDatabase();
        this.categoryMapping = {
            'easter': 'daily_phrases',
            'gadgets': 'daily_phrases',
            'jungle animals': 'animals',
            'domestic animals': 'animals',
            'farm animals': 'animals',
            'sea animals': 'animals',
            'fruits': 'fruits',
            'vegetables': 'fruits',
            'colors': 'colors',
            'numbers': 'numbers',
            'family': 'family',
            'body parts': 'body',
            'clothes': 'clothes',
            'clothing': 'clothes',
            'food': 'food',
            'kitchen': 'food',
            'transport': 'transport',
            'vehicles': 'transport',
            'weather': 'nature',
            'nature': 'nature'
        };
        this.stats = {
            totalWords: 0,
            totalCategories: 0,
            successfulCategories: 0,
            failedCategories: 0,
            duplicateWords: 0,
            newWords: 0
        };
    }

    async init() {
        console.log('🚀 启动本地爬虫...');
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
        
        console.log('✅ 浏览器启动完成');
    }

    // 获取分类映射
    getCategoryMapping(categoryName) {
        const normalizedName = categoryName.toLowerCase().replace(/[^a-z\s]/g, '').trim();
        
        // 直接匹配
        if (this.categoryMapping[normalizedName]) {
            return this.categoryMapping[normalizedName];
        }
        
        // 模糊匹配
        for (const [key, value] of Object.entries(this.categoryMapping)) {
            if (normalizedName.includes(key) || key.includes(normalizedName)) {
                return value;
            }
        }
        
        // 默认分类逻辑
        if (normalizedName.includes('animal')) return 'animals';
        if (normalizedName.includes('fruit') || normalizedName.includes('vegetable')) return 'fruits';
        if (normalizedName.includes('color')) return 'colors';
        if (normalizedName.includes('number')) return 'numbers';
        if (normalizedName.includes('food') || normalizedName.includes('kitchen')) return 'food';
        if (normalizedName.includes('cloth') || normalizedName.includes('dress')) return 'clothes';
        if (normalizedName.includes('transport') || normalizedName.includes('vehicle')) return 'transport';
        if (normalizedName.includes('family') || normalizedName.includes('relative')) return 'family';
        if (normalizedName.includes('body') || normalizedName.includes('part')) return 'body';
        if (normalizedName.includes('weather') || normalizedName.includes('nature')) return 'nature';
        
        return 'daily_phrases'; // 默认分类
    }

    // 清理单词名称
    cleanWordName(rawName) {
        return rawName
            .replace(/picture flashcards?/gi, '')
            .replace(/flashcards?/gi, '')
            .replace(/pictures?/gi, '')
            .replace(/cards?/gi, '')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    // 从单个分类页面抓取数据
    async scrapeCategory(categoryName, categoryUrl) {
        console.log(`\n📂 处理分类: ${categoryName}`);
        console.log(`🔗 URL: ${categoryUrl}`);

        try {
            await this.page.goto(categoryUrl, { waitUntil: 'networkidle', timeout: 30000 });
            await this.page.waitForTimeout(2000);

            // 查找所有图片元素
            const images = await this.page.$$eval('img[src*="kids-flashcards.com"]', imgs => 
                imgs
                    .filter(img => img.src && img.alt)
                    .map(img => ({
                        src: img.src,
                        alt: img.alt.trim()
                    }))
                    .filter(img => 
                        img.src.includes('/images/') && 
                        img.src.includes('/thumbs/') && // 只要缩略图，过滤掉pin和pdf图片
                        !img.src.includes('logo') &&
                        !img.src.includes('banner') &&
                        !img.alt.toLowerCase().includes('for translate') && // 过滤掉翻译版本
                        !img.alt.toLowerCase().includes('for kindergarden') && // 过滤掉宣传文字
                        !img.alt.toLowerCase().includes('free printable') && // 过滤掉宣传文字
                        !/^\d+\s/.test(img.alt) && // 过滤掉以数字开头的描述
                        img.alt.length > 0 && img.alt.length < 25 // 只要短单词，过滤长描述
                    )
            );

            if (images.length === 0) {
                console.log(`⚠️  ${categoryName}: 未找到有效图片`);
                this.stats.failedCategories++;
                return;
            }

            console.log(`🖼️  找到 ${images.length} 张图片`);

            // 获取数据库中的分类
            const mappedCategoryName = this.getCategoryMapping(categoryName);
            const dbCategory = this.db.getCategory(mappedCategoryName);
            
            if (!dbCategory) {
                console.log(`❌ 未找到映射分类: ${mappedCategoryName}`);
                this.stats.failedCategories++;
                return;
            }

            console.log(`📊 映射到分类: ${dbCategory.display_name} (${dbCategory.name})`);

            let newWords = 0;
            let duplicates = 0;

            // 插入单词数据
            for (const image of images) {
                const cleanWord = this.cleanWordName(image.alt);
                
                if (cleanWord.length < 2) continue; // 过滤太短的单词

                // 检查是否已存在
                if (this.db.wordExists(cleanWord, dbCategory.id)) {
                    duplicates++;
                    continue;
                }

                // 插入新单词
                const wordData = {
                    word: cleanWord,
                    chinese: '', // 暂时为空，后续可以添加翻译
                    image_url: image.src,
                    category_id: dbCategory.id,
                    difficulty_level: 1,
                    is_active: true
                };

                const result = this.db.insertWord(wordData);
                if (result.success) {
                    newWords++;
                    console.log(`  ✅ ${cleanWord} -> ${image.src}`);
                } else {
                    console.log(`  ❌ 插入失败: ${cleanWord} - ${result.error}`);
                }
            }

            console.log(`📊 ${categoryName} 完成: 新增 ${newWords} 个单词, 跳过 ${duplicates} 个重复`);
            this.stats.newWords += newWords;
            this.stats.duplicateWords += duplicates;
            this.stats.successfulCategories++;

        } catch (error) {
            console.error(`❌ 处理分类 ${categoryName} 时出错:`, error.message);
            this.stats.failedCategories++;
        }
    }

    // 探索和爬取所有分类
    async scrapeAll() {
        console.log('🔍 开始探索网站分类...');
        
        try {
            await this.page.goto('https://kids-flashcards.com/en', { 
                waitUntil: 'networkidle', 
                timeout: 30000 
            });
            await this.page.waitForTimeout(3000);

            // 查找所有分类链接
            const categories = await this.page.$$eval('a[href*="/en/free-printable/"]', links => 
                links
                    .map(link => ({
                        name: link.textContent.trim(),
                        url: link.href
                    }))
                    .filter(item => 
                        item.name && 
                        item.url && 
                        item.url.includes('flashcards-in-english')
                    )
                    .map(item => ({
                        name: item.name
                            .replace(/^\d+\s+/, '') // 移除开头的数字
                            .replace(/\s+flashcards.*$/i, '') // 移除结尾的 "flashcards"
                            .trim(),
                        url: item.url
                    }))
                    .filter(item => item.name.length > 2)
            );

            // 去重
            const uniqueCategories = categories.reduce((acc, current) => {
                const existing = acc.find(item => item.url === current.url);
                if (!existing) {
                    acc.push(current);
                }
                return acc;
            }, []);

            console.log(`📋 发现 ${uniqueCategories.length} 个分类:`);
            uniqueCategories.forEach((cat, index) => {
                console.log(`  ${index + 1}. ${cat.name} -> ${cat.url}`);
            });

            this.stats.totalCategories = uniqueCategories.length;

            // 逐个处理分类
            for (let i = 0; i < uniqueCategories.length; i++) {
                const category = uniqueCategories[i];
                console.log(`\n🎯 进度: ${i + 1}/${uniqueCategories.length}`);
                
                await this.scrapeCategory(category.name, category.url);
                
                // 添加延迟避免被封
                if (i < uniqueCategories.length - 1) {
                    console.log('⏱️  等待 3 秒...');
                    await this.page.waitForTimeout(3000);
                }
            }

        } catch (error) {
            console.error('❌ 探索分类时出错:', error.message);
        }
    }

    // 显示最终统计
    printFinalStats() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 爬取完成 - 最终统计');
        console.log('='.repeat(60));
        
        const dbStats = this.db.getStats();
        
        console.log(`📂 处理的分类数: ${this.stats.totalCategories}`);
        console.log(`✅ 成功的分类数: ${this.stats.successfulCategories}`);
        console.log(`❌ 失败的分类数: ${this.stats.failedCategories}`);
        console.log(`📝 新增单词数: ${this.stats.newWords}`);
        console.log(`🔄 跳过重复数: ${this.stats.duplicateWords}`);
        console.log(`📚 数据库总词汇: ${dbStats.totalWords}`);
        console.log(`📋 数据库总分类: ${dbStats.totalCategories}`);
        
        console.log('\n📊 各分类词汇统计:');
        dbStats.categoryStats.forEach(stat => {
            console.log(`  ${stat.display_name}: ${stat.word_count} 个单词`);
        });
        
        console.log('\n💾 数据库文件: flashcards.db');
        console.log('✨ 可以使用 npm run view-data 查看数据');
        console.log('📤 可以使用 npm run export-data 导出数据');
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        if (this.db) {
            this.db.close();
        }
        console.log('🏁 爬虫已关闭');
    }

    // 运行爬虫
    async run() {
        try {
            await this.init();
            await this.scrapeAll();
            this.printFinalStats();
        } catch (error) {
            console.error('❌ 爬虫运行出错:', error);
        } finally {
            await this.close();
        }
    }
}

// 如果直接运行此文件
if (require.main === module) {
    const scraper = new LocalFlashcardScraper();
    scraper.run().catch(console.error);
}

module.exports = LocalFlashcardScraper; 