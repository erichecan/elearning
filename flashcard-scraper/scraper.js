const { chromium } = require('playwright');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

class FlashcardScraper {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.baseUrl = 'https://kids-flashcards.com';
        this.downloadDir = './downloads';
        this.categories = [];
        this.languages = ['en', 'de', 'es', 'fr', 'it', 'nl', 'pt', 'ru']; // 从搜索结果中看到的语言
        this.downloadedImages = new Set();
        this.downloadedFiles = new Set();
        this.failedDownloads = [];
        this.stats = {
            totalImages: 0,
            totalPDFs: 0,
            totalCategories: 0,
            totalLanguages: 0,
            successfulDownloads: 0,
            failedDownloads: 0
        };
    }

    async init() {
        this.browser = await chromium.launch({ headless: false });
        this.context = await this.browser.newContext();
        this.page = await this.context.newPage();
        
        // 创建下载目录
        await fs.ensureDir(this.downloadDir);
        console.log('🚀 爬虫初始化完成');
    }

    async exploreAllCategories() {
        console.log('🔍 探索所有语言的分类...');
        const allCategories = new Map();
        
        // 首先获取英文分类（这是成功的）
        console.log('🌍 探索英文分类...');
        await this.page.goto(`${this.baseUrl}/en`, { timeout: 15000 });
        await this.page.waitForLoadState('networkidle', { timeout: 10000 });

        const englishCategories = await this.page.$$eval('a', links => 
            links.map(link => ({
                href: link.href,
                text: link.textContent.trim(),
                title: link.title
            })).filter(link => 
                link.href.includes('flashcards') && 
                link.href.includes('/en/free-printable/')
            )
        );

        console.log(`  📂 发现 ${englishCategories.length} 个英文分类`);

        // 添加英文分类
        for (const cat of englishCategories) {
            const categoryKey = this.extractCategoryKey(cat.href);
            if (!allCategories.has(categoryKey)) {
                allCategories.set(categoryKey, {
                    key: categoryKey,
                    name: this.extractCategoryName(cat.href),
                    languages: []
                });
            }
            allCategories.get(categoryKey).languages.push({
                lang: 'en',
                url: cat.href,
                text: cat.text
            });
        }

        // 然后尝试其他语言
        const otherLanguages = this.languages.filter(lang => lang !== 'en');
        for (const lang of otherLanguages) {
            try {
                console.log(`🌍 探索 ${lang} 语言分类...`);
                await this.page.goto(`${this.baseUrl}/${lang}`, { timeout: 15000 });
                await this.page.waitForLoadState('networkidle', { timeout: 10000 });

                const categoryLinks = await this.page.$$eval('a', links => 
                    links.map(link => ({ 
                        href: link.href, 
                        text: link.textContent.trim() 
                    })).filter(link => 
                        link.href && 
                        link.href.includes('flashcards') && 
                        link.href.includes(`/${lang}/free-printable/`) &&
                        link.text.length > 0
                    )
                );

                console.log(`  📂 发现 ${categoryLinks.length} 个 ${lang} 分类`);

                for (const link of categoryLinks) {
                    const categoryKey = this.extractCategoryKey(link.href);
                    if (!allCategories.has(categoryKey)) {
                        allCategories.set(categoryKey, {
                            key: categoryKey,
                            name: this.extractCategoryName(link.href),
                            languages: []
                        });
                    }
                    allCategories.get(categoryKey).languages.push({
                        lang,
                        url: link.href,
                        text: link.text
                    });
                }

                // 添加延迟避免过于频繁的请求
                await this.page.waitForTimeout(1000);
            } catch (error) {
                console.log(`  ⚠️ 跳过 ${lang} 语言: ${error.message}`);
            }
        }

        this.categories = Array.from(allCategories.values());
        this.stats.totalCategories = this.categories.length;
        this.stats.totalLanguages = this.languages.length;

        console.log(`🎯 总共发现 ${this.categories.length} 个不同分类`);
        return this.categories;
    }

    extractCategoryKey(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            return pathParts[pathParts.length - 1];
        } catch (e) {
            return 'unknown';
        }
    }

    extractCategoryName(url) {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const categoryPart = pathParts[pathParts.length - 1];
            return categoryPart.replace('-flashcards-in-english', '')
                              .replace('-flashcards', '')
                              .replace(/-/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase()); // 首字母大写
        } catch (e) {
            return 'Unknown';
        }
    }

    async exploreLanguages() {
        console.log('🌍 探索语言版本...');
        
        // 获取所有语言选项
        await this.page.goto(this.baseUrl);
        await this.page.waitForLoadState('networkidle');

        try {
            // 寻找语言选择器
            const languageLinks = await this.page.$$eval('a[href*="/"]', links => 
                links.map(link => ({
                    href: link.href,
                    text: link.textContent.trim()
                })).filter(link => {
                    const url = new URL(link.href);
                    const pathParts = url.pathname.split('/');
                    return pathParts.length === 2 && pathParts[1].length === 2; // 两字母语言代码
                })
            );

            this.languages = languageLinks;
            console.log(`🗣️ 发现 ${languageLinks.length} 种语言`);
            return languageLinks;
        } catch (error) {
            console.log('⚠️ 无法获取语言列表，使用默认英语');
            this.languages = [{ href: `${this.baseUrl}/en`, text: 'English' }];
            return this.languages;
        }
    }

    async downloadFile(fileUrl, fileName, category, fileType = 'image') {
        const fileKey = `${fileUrl}:${fileName}`;
        if (this.downloadedFiles.has(fileKey)) {
            console.log(`⏭️ 跳过已下载的文件: ${fileName}`);
            return true;
        }

        try {
            const response = await axios({
                method: 'GET',
                url: fileUrl,
                responseType: 'stream',
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                }
            });

            const categoryDir = path.join(this.downloadDir, this.sanitizeFileName(category));
            await fs.ensureDir(categoryDir);
            
            const filePath = path.join(categoryDir, this.sanitizeFileName(fileName));
            const writer = fs.createWriteStream(filePath);
            
            response.data.pipe(writer);
            
            return new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    this.downloadedFiles.add(fileKey);
                    this.stats.successfulDownloads++;
                    if (fileType === 'pdf') {
                        this.stats.totalPDFs++;
                    } else {
                        this.stats.totalImages++;
                    }
                    console.log(`✅ 下载完成 [${fileType.toUpperCase()}]: ${fileName}`);
                    resolve(true);
                });
                writer.on('error', (error) => {
                    this.stats.failedDownloads++;
                    this.failedDownloads.push({ url: fileUrl, fileName, error: error.message });
                    console.error(`❌ 下载失败 ${fileName}:`, error.message);
                    reject(error);
                });
            });
        } catch (error) {
            this.stats.failedDownloads++;
            this.failedDownloads.push({ url: fileUrl, fileName, error: error.message });
            console.error(`❌ 下载失败 ${fileName}:`, error.message);
            return false;
        }
    }

    async scrapeCategory(category) {
        console.log(`📖 正在爬取分类: ${category.name} (${category.languages.length} 种语言)`);
        
        for (const langInfo of category.languages) {
            try {
                console.log(`  🌍 爬取 ${langInfo.lang}: ${langInfo.text}`);
                await this.page.goto(langInfo.url, { timeout: 15000 });
                await this.page.waitForLoadState('networkidle', { timeout: 10000 });

                // 查找所有闪卡图片
                const images = await this.page.$$eval('img', imgs => 
                    imgs.map(img => ({
                        src: img.src,
                        alt: img.alt || '',
                        title: img.title || '',
                        className: img.className
                    })).filter(img => {
                        // 过滤掉明显不是闪卡的图片
                        const src = img.src.toLowerCase();
                        const alt = img.alt.toLowerCase();
                        const title = img.title.toLowerCase();
                        
                        return img.src && 
                               !src.includes('logo') && 
                               !src.includes('icon') && 
                               !src.includes('button') &&
                               (src.includes('flashcard') || 
                                alt.length > 0 || 
                                title.length > 0 ||
                                img.className.includes('flashcard'));
                    })
                );

                console.log(`    🖼️ 发现 ${images.length} 张图片`);

                // 下载图片
                for (let i = 0; i < images.length; i++) {
                    const img = images[i];
                    const imageName = img.alt || img.title || `flashcard_${i + 1}`;
                    const fileName = `${langInfo.lang}_${this.sanitizeFileName(imageName)}.jpg`;
                    const categoryPath = `${category.name}/${langInfo.lang}`;
                    
                    await this.downloadFile(img.src, fileName, categoryPath, 'image');
                    
                    // 添加延迟避免被封
                    await this.page.waitForTimeout(300);
                }

                // 查找PDF下载链接
                const pdfLinks = await this.page.$$eval('a', links =>
                    links.map(link => ({
                        href: link.href,
                        text: link.textContent.trim(),
                        download: link.download
                    })).filter(link => 
                        link.href.includes('.pdf') || 
                        link.text.toLowerCase().includes('pdf') ||
                        link.text.toLowerCase().includes('download')
                    )
                );

                console.log(`    📄 发现 ${pdfLinks.length} 个下载链接`);

                // 下载PDF文件
                for (const pdfLink of pdfLinks) {
                    const pdfName = pdfLink.text || 'flashcard_set';
                    const fileName = `${langInfo.lang}_${category.name}_${this.sanitizeFileName(pdfName)}.pdf`;
                    const categoryPath = `${category.name}/${langInfo.lang}`;
                    
                    await this.downloadFile(pdfLink.href, fileName, categoryPath, 'pdf');
                    await this.page.waitForTimeout(800);
                }

                // 语言间添加延迟
                await this.page.waitForTimeout(1500);

            } catch (error) {
                console.error(`    ❌ 爬取 ${langInfo.lang} 失败:`, error.message);
                this.failedDownloads.push({
                    category: category.name,
                    language: langInfo.lang,
                    url: langInfo.url,
                    error: error.message
                });
            }
        }
    }

    sanitizeFileName(fileName) {
        return fileName.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
    }

    async scrapeAllCategories() {
        console.log('🎯 开始爬取所有分类...');
        
        for (let i = 0; i < this.categories.length; i++) {
            const category = this.categories[i];
            console.log(`\n📚 [${i + 1}/${this.categories.length}] 处理分类: ${category.name}`);
            
            await this.scrapeCategory(category);
            
            // 分类间添加延迟
            await this.page.waitForTimeout(3000);
            
            // 每5个分类后显示进度
            if ((i + 1) % 5 === 0) {
                console.log(`\n📊 进度报告 [${i + 1}/${this.categories.length}]:`);
                console.log(`  ✅ 成功下载: ${this.stats.successfulDownloads}`);
                console.log(`  ❌ 失败下载: ${this.stats.failedDownloads}`);
                console.log(`  🖼️ 图片: ${this.stats.totalImages}`);
                console.log(`  📄 PDF: ${this.stats.totalPDFs}`);
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
                key: cat.key,
                totalLanguages: cat.languages.length,
                languages: cat.languages.map(l => l.lang)
            })),
            languages: this.languages,
            failedDownloads: this.failedDownloads,
            downloadedFiles: Array.from(this.downloadedFiles),
            summary: {
                totalFiles: this.stats.totalImages + this.stats.totalPDFs,
                successRate: this.stats.successfulDownloads > 0 ? 
                    ((this.stats.successfulDownloads / (this.stats.successfulDownloads + this.stats.failedDownloads)) * 100).toFixed(2) + '%' : 
                    '0%',
                avgFilesPerCategory: this.categories.length > 0 ? 
                    ((this.stats.totalImages + this.stats.totalPDFs) / this.categories.length).toFixed(1) : 0
            }
        };

        await fs.writeJson('./scraping-report.json', reportData, { spaces: 2 });
        console.log('📊 生成爬取报告: scraping-report.json');
        
        // 打印最终统计
        console.log('\n🎉 爬取完成！最终统计:');
        console.log(`  📂 总分类数: ${this.stats.totalCategories}`);
        console.log(`  🌍 总语言数: ${this.stats.totalLanguages}`);
        console.log(`  📄 总文件数: ${reportData.summary.totalFiles}`);
        console.log(`  🖼️ 图片: ${this.stats.totalImages}`);
        console.log(`  📋 PDF: ${this.stats.totalPDFs}`);
        console.log(`  ✅ 成功: ${this.stats.successfulDownloads}`);
        console.log(`  ❌ 失败: ${this.stats.failedDownloads}`);
        console.log(`  📈 成功率: ${reportData.summary.successRate}`);
        console.log(`  ⏱️ 用时: ${Math.round(reportData.duration / 1000 / 60)} 分钟`);
        
        return reportData;
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('✅ 爬虫已关闭');
    }

    async run() {
        this.startTime = Date.now();
        try {
            await this.init();
            await this.exploreAllCategories();
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

// 运行爬虫
(async () => {
    const scraper = new FlashcardScraper();
    await scraper.run();
})(); 