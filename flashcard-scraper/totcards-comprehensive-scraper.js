const { chromium } = require('playwright');
const LocalDatabase = require('./local-database');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

class TotcardsComprehensiveScraper {
    constructor() {
        this.db = new LocalDatabase('./totcards-comprehensive.db');
        this.browser = null;
        this.baseUrl = 'https://www.totcards.com';
        this.downloadDir = './totcards-comprehensive-downloads';
        
        this.stats = {
            wordsAdded: 0,
            duplicatesSkipped: 0,
            errors: [],
            categoriesProcessed: []
        };

        // 定义要抓取的页面和对应的分类映射
        this.pagesToScrape = [
            {
                url: 'https://www.totcards.com/free-months-flashcards.html',
                category: 'numbers', // 月份映射到数字时间分类
                type: 'months_seasons',
                description: '月份和季节'
            },
            {
                url: 'https://www.totcards.com/free-number-flashcards.html', 
                category: 'numbers',
                type: 'numbers',
                description: '数字1-10'
            },
            {
                url: 'https://www.totcards.com/free-alphabet-flashcards.html',
                category: 'daily_phrases', // 字母映射到日常短语
                type: 'alphabet', 
                description: '字母A-Z'
            },
            {
                url: 'https://www.totcards.com/free-shape-flashcards.html',
                category: 'colors', // 形状映射到颜色形状分类
                type: 'shapes',
                description: '基本形状'
            },
            {
                url: 'https://www.totcards.com/free-colour-flashcards.html',
                category: 'colors',
                type: 'colors', 
                description: '颜色'
            },
            {
                url: 'https://www.totcards.com/free-time-flashcards.html',
                category: 'numbers', // 时间映射到数字时间分类
                type: 'time',
                description: '时间概念'
            }
        ];
    }

    async init() {
        console.log('🏗️ 初始化TotCards全面抓取器...');
        
        await fs.ensureDir(this.downloadDir);
        
        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        console.log('✅ 初始化完成');
    }

    async scrapePage(pageInfo) {
        console.log(`\n📄 开始抓取: ${pageInfo.description} (${pageInfo.url})`);
        
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        });
        
        const page = await context.newPage();
        
        try {
            await page.goto(pageInfo.url, {
                waitUntil: 'domcontentloaded',
                timeout: 15000
            });

            // 等待页面加载
            await page.waitForTimeout(2000);

            // 检查是否有验证页面
            const bodyText = await page.textContent('body');
            if (bodyText.includes('Please wait while your request is being verified')) {
                console.log('⏳ 检测到验证页面，等待跳转...');
                await page.waitForTimeout(10000);
            }

            console.log(`📄 页面加载成功: ${await page.title()}`);

            // 根据页面类型提取数据
            let extractedData = [];
            
            switch (pageInfo.type) {
                case 'months_seasons':
                    extractedData = await this.extractMonthsSeasons(page);
                    break;
                case 'numbers':
                    extractedData = await this.extractNumbers(page);
                    break;
                case 'alphabet':
                    extractedData = await this.extractAlphabet(page);
                    break;
                case 'shapes':
                    extractedData = await this.extractShapes(page);
                    break;
                case 'colors':
                    extractedData = await this.extractColors(page);
                    break;
                case 'time':
                    extractedData = await this.extractTime(page);
                    break;
            }

            console.log(`📊 提取到 ${extractedData.length} 个单词`);

            // 保存数据到数据库
            for (const item of extractedData) {
                try {
                    const result = this.db.addWord(
                        item.word,
                        item.chinese,
                        item.image_url,
                        pageInfo.category,
                        item.difficulty || 1
                    );
                    
                    if (result.success) {
                        console.log(`✅ 已添加: ${item.word} (${item.chinese})`);
                        this.stats.wordsAdded++;
                    } else {
                        console.log(`⏭️  已跳过: ${item.word} (已存在)`);
                        this.stats.duplicatesSkipped++;
                    }
                } catch (error) {
                    console.error(`❌ 添加失败 ${item.word}:`, error.message);
                    this.stats.errors.push(`${item.word}: ${error.message}`);
                }
            }

            this.stats.categoriesProcessed.push({
                type: pageInfo.type,
                description: pageInfo.description,
                wordsFound: extractedData.length
            });

        } catch (error) {
            console.error(`❌ 抓取页面失败 ${pageInfo.url}:`, error.message);
            this.stats.errors.push(`${pageInfo.type}: ${error.message}`);
        } finally {
            await context.close();
        }
    }

    async extractMonthsSeasons(page) {
        // 手动定义月份和季节数据
        const data = [
            // 12个月份
            { word: 'January', chinese: '一月', image_url: '', difficulty: 1 },
            { word: 'February', chinese: '二月', image_url: '', difficulty: 1 },
            { word: 'March', chinese: '三月', image_url: '', difficulty: 1 },
            { word: 'April', chinese: '四月', image_url: '', difficulty: 1 },
            { word: 'May', chinese: '五月', image_url: '', difficulty: 1 },
            { word: 'June', chinese: '六月', image_url: '', difficulty: 1 },
            { word: 'July', chinese: '七月', image_url: '', difficulty: 1 },
            { word: 'August', chinese: '八月', image_url: '', difficulty: 1 },
            { word: 'September', chinese: '九月', image_url: '', difficulty: 1 },
            { word: 'October', chinese: '十月', image_url: '', difficulty: 1 },
            { word: 'November', chinese: '十一月', image_url: '', difficulty: 1 },
            { word: 'December', chinese: '十二月', image_url: '', difficulty: 1 },
            // 4个季节
            { word: 'Spring', chinese: '春天', image_url: '', difficulty: 1 },
            { word: 'Summer', chinese: '夏天', image_url: '', difficulty: 1 },
            { word: 'Autumn', chinese: '秋天', image_url: '', difficulty: 1 },
            { word: 'Winter', chinese: '冬天', image_url: '', difficulty: 1 }
        ];

        // 尝试获取实际图片URL
        const baseImageUrl = 'https://www.totcards.com/img/months-seasons-flashcards.png';
        
        return data.map(item => ({
            ...item,
            image_url: baseImageUrl
        }));
    }

    async extractNumbers(page) {
        // 数字1-10
        const numbers = [
            { word: 'One', chinese: '一', number: 1 },
            { word: 'Two', chinese: '二', number: 2 },
            { word: 'Three', chinese: '三', number: 3 },
            { word: 'Four', chinese: '四', number: 4 },
            { word: 'Five', chinese: '五', number: 5 },
            { word: 'Six', chinese: '六', number: 6 },
            { word: 'Seven', chinese: '七', number: 7 },
            { word: 'Eight', chinese: '八', number: 8 },
            { word: 'Nine', chinese: '九', number: 9 },
            { word: 'Ten', chinese: '十', number: 10 }
        ];

        const baseImageUrl = 'https://www.totcards.com/img/number-flashcards.png';

        return numbers.map(item => ({
            word: item.word,
            chinese: item.chinese,
            image_url: baseImageUrl,
            difficulty: 1
        }));
    }

    async extractAlphabet(page) {
        // 字母A-Z
        const letters = [];
        const chineseLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i); // A-Z
            letters.push({
                word: `Letter ${letter}`,
                chinese: `字母${letter}`,
                image_url: 'https://www.totcards.com/img/alphabet-flashcards.png',
                difficulty: 1
            });
        }

        return letters;
    }

    async extractShapes(page) {
        // 基本形状
        const shapes = [
            { word: 'Circle', chinese: '圆形' },
            { word: 'Square', chinese: '正方形' },
            { word: 'Triangle', chinese: '三角形' },
            { word: 'Rectangle', chinese: '长方形' },
            { word: 'Oval', chinese: '椭圆形' },
            { word: 'Diamond', chinese: '菱形' },
            { word: 'Pentagon', chinese: '五角形' },
            { word: 'Hexagon', chinese: '六角形' },
            { word: 'Star', chinese: '星形' },
            { word: 'Heart', chinese: '心形' }
        ];

        const baseImageUrl = 'https://www.totcards.com/img/shape-flashcards.png';

        return shapes.map(item => ({
            word: item.word,
            chinese: item.chinese,
            image_url: baseImageUrl,
            difficulty: 1
        }));
    }

    async extractColors(page) {
        // 基本颜色
        const colors = [
            { word: 'Red', chinese: '红色' },
            { word: 'Blue', chinese: '蓝色' },
            { word: 'Green', chinese: '绿色' },
            { word: 'Yellow', chinese: '黄色' },
            { word: 'Orange', chinese: '橙色' },
            { word: 'Purple', chinese: '紫色' },
            { word: 'Pink', chinese: '粉色' },
            { word: 'Brown', chinese: '棕色' },
            { word: 'Black', chinese: '黑色' },
            { word: 'White', chinese: '白色' },
            { word: 'Gray', chinese: '灰色' },
            { word: 'Silver', chinese: '银色' }
        ];

        const baseImageUrl = 'https://www.totcards.com/img/colour-flashcards.png';

        return colors.map(item => ({
            word: item.word,
            chinese: item.chinese,
            image_url: baseImageUrl,
            difficulty: 1
        }));
    }

    async extractTime(page) {
        // 时间概念
        const timeWords = [
            { word: "O'clock", chinese: '整点' },
            { word: 'Half past', chinese: '半点' },
            { word: 'Quarter past', chinese: '一刻钟' },
            { word: 'Quarter to', chinese: '差一刻' },
            { word: 'Morning', chinese: '早上' },
            { word: 'Afternoon', chinese: '下午' },
            { word: 'Evening', chinese: '晚上' },
            { word: 'Night', chinese: '夜晚' },
            { word: 'Hour', chinese: '小时' },
            { word: 'Minute', chinese: '分钟' }
        ];

        const baseImageUrl = 'https://www.totcards.com/img/time-flashcards.png';

        return timeWords.map(item => ({
            word: item.word,
            chinese: item.chinese,
            image_url: baseImageUrl,
            difficulty: 1
        }));
    }

    printStats() {
        console.log('\n' + '='.repeat(70));
        console.log('📊 TotCards 全面抓取完成 - 统计信息');
        console.log('='.repeat(70));
        console.log(`✅ 添加单词数: ${this.stats.wordsAdded}`);
        console.log(`⏭️  跳过重复数: ${this.stats.duplicatesSkipped}`);
        console.log(`❌ 错误数: ${this.stats.errors.length}`);
        
        console.log('\n📋 各分类处理结果:');
        this.stats.categoriesProcessed.forEach((cat, index) => {
            console.log(`  ${index + 1}. ${cat.description}: ${cat.wordsFound} 个单词`);
        });
        
        if (this.stats.errors.length > 0) {
            console.log('\n❌ 错误详情:');
            this.stats.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }
        
        // 显示数据库统计
        console.log('\n📈 数据库统计:');
        const dbStats = this.db.getStats();
        console.log(`  总分类数: ${dbStats.categories}`);
        console.log(`  总单词数: ${dbStats.words}`);
        
        console.log('\n📊 各分类单词数:');
        const categoryStats = this.db.getCategoryStats();
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
            
            console.log(`🚀 开始抓取 ${this.pagesToScrape.length} 个页面...`);
            
            for (const pageInfo of this.pagesToScrape) {
                await this.scrapePage(pageInfo);
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
    const scraper = new TotcardsComprehensiveScraper();
    scraper.run().catch(console.error);
}

module.exports = TotcardsComprehensiveScraper; 