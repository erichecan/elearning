const { chromium } = require('playwright');
const LocalDatabase = require('./local-database');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

class TotcardsScraper {
    constructor() {
        this.db = new LocalDatabase('./totcards-flashcards.db');
        this.browser = null;
        this.baseUrl = 'https://www.totcards.com';
        this.downloadDir = './totcards-downloads';
        
        this.stats = {
            wordsAdded: 0,
            duplicatesSkipped: 0,
            errors: []
        };
    }

    async init() {
        console.log('🏗️ 初始化TotCards抓取器...');
        
        // 创建下载目录
        await fs.ensureDir(this.downloadDir);
        
        // 数据库已在构造函数中自动初始化
        // this.db 在 new LocalDatabase() 时已经调用了 init()
        
        // 启动浏览器
        this.browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        
        console.log('✅ 初始化完成');
    }

    async scrapeMonthsData() {
        console.log('📅 开始抓取月份数据...\n');
        
        const context = await this.browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        });
        
        const page = await context.newPage();
        
        try {
            // 访问主页面
            await page.goto('https://www.totcards.com/free-months-flashcards.html', {
                waitUntil: 'domcontentloaded',
                timeout: 15000
            });
            
            console.log('📄 页面加载成功');
            
            // 手动定义12个月份数据（基于网站内容）
            const monthsData = [
                { 
                    word: 'January', 
                    chinese: '一月',
                    image_url: 'https://www.totcards.com/img/months/january.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'February', 
                    chinese: '二月',
                    image_url: 'https://www.totcards.com/img/months/february.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'March', 
                    chinese: '三月',
                    image_url: 'https://www.totcards.com/img/months/march.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'April', 
                    chinese: '四月',
                    image_url: 'https://www.totcards.com/img/months/april.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'May', 
                    chinese: '五月',
                    image_url: 'https://www.totcards.com/img/months/may.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'June', 
                    chinese: '六月',
                    image_url: 'https://www.totcards.com/img/months/june.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'July', 
                    chinese: '七月',
                    image_url: 'https://www.totcards.com/img/months/july.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'August', 
                    chinese: '八月',
                    image_url: 'https://www.totcards.com/img/months/august.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'September', 
                    chinese: '九月',
                    image_url: 'https://www.totcards.com/img/months/september.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'October', 
                    chinese: '十月',
                    image_url: 'https://www.totcards.com/img/months/october.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'November', 
                    chinese: '十一月',
                    image_url: 'https://www.totcards.com/img/months/november.png',
                    category: 'time',
                    difficulty: 1
                },
                { 
                    word: 'December', 
                    chinese: '十二月',
                    image_url: 'https://www.totcards.com/img/months/december.png',
                    category: 'time',
                    difficulty: 1
                }
            ];
            
            // 添加季节数据
            const seasonsData = [
                {
                    word: 'Spring',
                    chinese: '春天',
                    image_url: 'https://www.totcards.com/img/seasons/spring.png',
                    category: 'nature',
                    difficulty: 1
                },
                {
                    word: 'Summer',
                    chinese: '夏天',
                    image_url: 'https://www.totcards.com/img/seasons/summer.png',
                    category: 'nature',
                    difficulty: 1
                },
                {
                    word: 'Autumn',
                    chinese: '秋天',
                    image_url: 'https://www.totcards.com/img/seasons/autumn.png',
                    category: 'nature',
                    difficulty: 1
                },
                {
                    word: 'Winter',
                    chinese: '冬天',
                    image_url: 'https://www.totcards.com/img/seasons/winter.png',
                    category: 'nature',
                    difficulty: 1
                }
            ];
            
            // 合并所有数据
            const allData = [...monthsData, ...seasonsData];
            
            console.log(`📊 准备处理 ${allData.length} 个单词 (${monthsData.length} 个月份 + ${seasonsData.length} 个季节)`);
            
            // 验证图片URL是否可访问
            console.log('\n🔍 验证图片URL可访问性...');
            
            for (const item of allData) {
                try {
                    // 检查图片是否存在
                    const response = await axios.head(item.image_url, { timeout: 5000 });
                    if (response.status === 200) {
                        console.log(`✅ ${item.word}: 图片可访问`);
                    } else {
                        console.log(`⚠️  ${item.word}: 图片响应异常 (${response.status})`);
                        // 使用备用URL
                        item.image_url = `https://www.totcards.com/img/months-seasons-flashcards.png`;
                    }
                } catch (error) {
                    console.log(`❌ ${item.word}: 图片不可访问，使用备用URL`);
                    // 使用网站提供的通用图片
                    item.image_url = `https://www.totcards.com/img/months-seasons-flashcards.png`;
                }
            }
            
            // 保存到数据库
            console.log('\n💾 保存数据到本地数据库...');
            
            for (const item of allData) {
                try {
                    const result = this.db.addWord(
                        item.word,
                        item.chinese,
                        item.image_url,
                        item.category,
                        item.difficulty
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
            
            // 下载主要预览图片
            console.log('\n📥 下载预览图片...');
            const imagesToDownload = [
                'https://www.totcards.com/img/months/months-seasons-flashcards.png',
                'https://www.totcards.com/img/months/months-seasons-flashcards-words.png',
                'https://www.totcards.com/img/months/printable-months-flashcards.png'
            ];
            
            for (const imageUrl of imagesToDownload) {
                try {
                    const filename = path.basename(imageUrl);
                    const filePath = path.join(this.downloadDir, filename);
                    
                    const response = await axios.get(imageUrl, { 
                        responseType: 'stream',
                        timeout: 10000 
                    });
                    
                    await new Promise((resolve, reject) => {
                        const writer = fs.createWriteStream(filePath);
                        response.data.pipe(writer);
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });
                    
                    console.log(`✅ 下载完成: ${filename}`);
                } catch (error) {
                    console.error(`❌ 下载失败 ${imageUrl}:`, error.message);
                }
            }
            
        } catch (error) {
            console.error('❌ 抓取过程中出错:', error.message);
            this.stats.errors.push(`抓取错误: ${error.message}`);
        } finally {
            await context.close();
        }
    }

    printStats() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 TotCards 抓取完成 - 统计信息');
        console.log('='.repeat(60));
        console.log(`✅ 添加单词数: ${this.stats.wordsAdded}`);
        console.log(`⏭️  跳过重复数: ${this.stats.duplicatesSkipped}`);
        console.log(`❌ 错误数: ${this.stats.errors.length}`);
        
        if (this.stats.errors.length > 0) {
            console.log('\n错误详情:');
            this.stats.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }
        
        // 显示数据库统计
        console.log('\n📈 数据库统计:');
        const dbStats = this.db.getStats();
        console.log(`  总分类数: ${dbStats.categories}`);
        console.log(`  总单词数: ${dbStats.words}`);
        
        console.log('\n各分类单词数:');
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
            await this.scrapeMonthsData();
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
    const scraper = new TotcardsScraper();
    scraper.run().catch(console.error);
}

module.exports = TotcardsScraper; 