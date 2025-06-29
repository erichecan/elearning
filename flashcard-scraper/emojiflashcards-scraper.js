const { chromium } = require('playwright');
const LocalDatabase = require('./local-database');
const fs = require('fs-extra');

class EmojiFlashcardsScraper {
    constructor() {
        this.db = new LocalDatabase('./emojiflashcards.db');
        this.browser = null;
        
        this.stats = {
            wordsAdded: 0,
            duplicatesSkipped: 0,
            errors: [],
            categoriesProcessed: []
        };

        // 定义要抓取的分类
        this.categoriesToScrape = [
            {
                name: 'Animals',
                url: 'https://emojiflashcards.com/flashcards/animals',
                dbCategory: 'animals',
                description: '动物世界'
            },
            {
                name: 'Colors',
                url: 'https://emojiflashcards.com/flashcards/colors',
                dbCategory: 'colors',
                description: '颜色形状'
            },
            {
                name: 'Numbers',
                url: 'https://emojiflashcards.com/flashcards/numbers',
                dbCategory: 'numbers',
                description: '数字时间'
            },
            {
                name: 'Food',
                url: 'https://emojiflashcards.com/flashcards/food',
                dbCategory: 'food',
                description: '美食餐具'
            },
            {
                name: 'Alphabet',
                url: 'https://emojiflashcards.com/flashcards/alphabet',
                dbCategory: 'daily_phrases',
                description: '日常短语'
            },
            {
                name: 'Body Parts',
                url: 'https://emojiflashcards.com/flashcards/body',
                dbCategory: 'body',
                description: '身体部位'
            },
            {
                name: 'Clothes',
                url: 'https://emojiflashcards.com/flashcards/clothes',
                dbCategory: 'clothes',
                description: '服装配饰'
            },
            {
                name: 'Family',
                url: 'https://emojiflashcards.com/flashcards/family',
                dbCategory: 'family',
                description: '家庭成员'
            },
            {
                name: 'Transport',
                url: 'https://emojiflashcards.com/flashcards/transport',
                dbCategory: 'transport',
                description: '交通工具'
            },
            {
                name: 'Weather',
                url: 'https://emojiflashcards.com/flashcards/weather',
                dbCategory: 'nature',
                description: '自然天气'
            }
        ];
    }

    async init() {
        console.log('🏗️ 初始化EmojiFlashcards抓取器...');
        
        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        console.log('✅ 初始化完成');
    }

    async scrapeCategory(categoryInfo) {
        console.log(`\n📂 开始抓取: ${categoryInfo.description} (${categoryInfo.name})`);
        console.log(`🔗 URL: ${categoryInfo.url}`);
        
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        });
        
        const page = await context.newPage();
        
        try {
            await page.goto(categoryInfo.url, {
                waitUntil: 'domcontentloaded',
                timeout: 15000
            });

            await page.waitForTimeout(3000);
            console.log(`✅ 页面加载成功`);

            // 提取flashcard数据
            const flashcardData = await page.evaluate(() => {
                const cards = [];
                
                // 查找所有有alt属性的图片，过滤出emoji图片
                const imgs = document.querySelectorAll('img[alt]');
                imgs.forEach(img => {
                    if (img.alt && img.src && !img.src.includes('logo') && !img.src.includes('main-image')) {
                        // 从alt中提取单词（格式通常是 "emoji for word"）
                        const altText = img.alt.toLowerCase();
                        let word = '';
                        
                        if (altText.startsWith('emoji for ')) {
                            word = altText.replace('emoji for ', '').trim();
                        } else if (altText.includes(' ')) {
                            // 如果alt不是标准格式，取最后一个单词
                            const words = altText.split(' ');
                            word = words[words.length - 1].trim();
                        } else {
                            word = altText.trim();
                        }
                        
                        if (word && word.length > 0 && word.length < 30) {
                            cards.push({
                                word: word,
                                image_url: img.src,
                                alt: img.alt
                            });
                        }
                    }
                });
                
                return cards;
            });

            console.log(`📊 提取到 ${flashcardData.length} 个flashcard`);

            // 数据清洗和去重
            const cleanedData = this.cleanFlashcardData(flashcardData);
            console.log(`🧹 清洗后剩余 ${cleanedData.length} 个flashcard`);

            // 保存到数据库
            let addedCount = 0;
            let skippedCount = 0;

            for (const item of cleanedData) {
                try {
                    const result = this.db.addWord(
                        item.word,
                        this.translateWord(item.word),
                        item.image_url,
                        categoryInfo.dbCategory,
                        1
                    );
                    
                    if (result.success) {
                        console.log(`  ✅ ${item.word}`);
                        addedCount++;
                        this.stats.wordsAdded++;
                    } else {
                        console.log(`  ⏭️  ${item.word} (已存在)`);
                        skippedCount++;
                        this.stats.duplicatesSkipped++;
                    }
                } catch (error) {
                    console.error(`  ❌ ${item.word}: ${error.message}`);
                    this.stats.errors.push(`${categoryInfo.name}/${item.word}: ${error.message}`);
                }
            }

            this.stats.categoriesProcessed.push({
                name: categoryInfo.name,
                description: categoryInfo.description,
                dbCategory: categoryInfo.dbCategory,
                extracted: flashcardData.length,
                cleaned: cleanedData.length,
                added: addedCount,
                skipped: skippedCount
            });

            console.log(`📈 ${categoryInfo.name} 完成: 添加${addedCount}, 跳过${skippedCount}`);

        } catch (error) {
            console.error(`❌ 抓取 ${categoryInfo.name} 失败: ${error.message}`);
            this.stats.errors.push(`${categoryInfo.name}: ${error.message}`);
        } finally {
            await context.close();
        }
    }

    cleanFlashcardData(data) {
        // 数据清洗逻辑
        const cleaned = data.filter(item => {
            // 过滤掉无效数据
            if (!item.word || item.word.length === 0) return false;
            if (item.word.includes('flashcard')) return false;
            if (item.word.includes('example')) return false;
            if (item.word.includes('main')) return false;
            if (item.word.length > 25) return false;
            
            return true;
        });

        // 去重（基于word）
        const uniqueWords = new Map();
        cleaned.forEach(item => {
            const key = item.word.toLowerCase();
            if (!uniqueWords.has(key)) {
                uniqueWords.set(key, {
                    word: this.capitalizeFirst(item.word),
                    image_url: item.image_url,
                    chinese: this.translateWord(item.word)
                });
            }
        });

        return Array.from(uniqueWords.values());
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    translateWord(word) {
        const translations = {
            'red': '红色', 'blue': '蓝色', 'green': '绿色', 'yellow': '黄色',
            'one': '一', 'two': '二', 'three': '三', 'four': '四', 'five': '五',
            'cat': '猫', 'dog': '狗', 'bird': '鸟', 'fish': '鱼', 'bear': '熊'
        };
        return translations[word.toLowerCase()] || '';
    }

    printStats() {
        console.log('\n' + '='.repeat(70));
        console.log('📊 EmojiFlashcards 抓取完成 - 统计信息');
        console.log('='.repeat(70));
        console.log(`✅ 添加单词数: ${this.stats.wordsAdded}`);
        console.log(`⏭️  跳过重复数: ${this.stats.duplicatesSkipped}`);
        console.log(`❌ 错误数: ${this.stats.errors.length}`);
        
        console.log('\n📋 各分类处理结果:');
        this.stats.categoriesProcessed.forEach((cat, index) => {
            console.log(`  ${index + 1}. ${cat.description} (${cat.name}):`);
            console.log(`     提取: ${cat.extracted} | 清洗: ${cat.cleaned} | 添加: ${cat.added} | 跳过: ${cat.skipped}`);
            console.log(`     映射到: ${cat.dbCategory}`);
        });
        
        if (this.stats.errors.length > 0) {
            console.log('\n❌ 错误详情:');
            this.stats.errors.slice(0, 10).forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }
        
        // 显示数据库统计
        const dbStats = this.db.getStats();
        const categoryStats = this.db.getCategoryStats();
        
        console.log('\n📈 数据库统计:');
        console.log(`  总分类数: ${dbStats.categories}`);
        console.log(`  总单词数: ${dbStats.words}`);
        
        console.log('\n📊 各分类单词数:');
        categoryStats.forEach(stat => {
            console.log(`  ${stat.display_name}: ${stat.word_count} 个单词`);
        });
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        if (this.db) {
            this.db.close();
        }
    }

    async run() {
        try {
            await this.init();
            
            console.log(`🚀 开始抓取 ${this.categoriesToScrape.length} 个分类...`);
            
            for (const categoryInfo of this.categoriesToScrape) {
                await this.scrapeCategory(categoryInfo);
                // 添加延迟避免被封
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            this.printStats();
            
        } catch (error) {
            console.error('❌ 抓取器运行失败:', error.message);
        } finally {
            await this.close();
        }
    }
}

// 如果直接运行此文件
if (require.main === module) {
    const scraper = new EmojiFlashcardsScraper();
    scraper.run().catch(console.error);
}

module.exports = EmojiFlashcardsScraper; 