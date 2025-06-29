const { chromium } = require('playwright');
const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

class TestScraper {
    constructor() {
        this.browser = null;
        this.page = null;
        this.baseUrl = 'https://kids-flashcards.com';
        this.downloadDir = './test-downloads';
    }

    async init() {
        this.browser = await chromium.launch({ headless: false });
        this.page = await this.browser.newPage();
        await fs.ensureDir(this.downloadDir);
        console.log('🧪 测试爬虫初始化完成');
    }

    async testSingleCategory() {
        console.log('🔍 测试单个分类爬取...');
        
        // 测试一个具体的分类URL（Domestic animals）
        const testUrl = 'https://kids-flashcards.com/en/free-printable/domestic-animals-flashcards-in-english';
        
        try {
            await this.page.goto(testUrl, { timeout: 15000 });
            await this.page.waitForLoadState('networkidle', { timeout: 10000 });

            console.log(`📖 页面标题: ${await this.page.title()}`);

            // 分析页面结构
            const pageInfo = await this.page.evaluate(() => {
                return {
                    totalImages: document.querySelectorAll('img').length,
                    totalLinks: document.querySelectorAll('a').length,
                    flashcardText: document.body.innerText.match(/\d+\s*flashcards?/gi) || [],
                    downloadLinks: Array.from(document.querySelectorAll('a')).filter(a => 
                        a.href.includes('.pdf') || 
                        a.textContent.toLowerCase().includes('download')
                    ).map(a => ({ href: a.href, text: a.textContent.trim() }))
                };
            });

            console.log('📊 页面分析结果:');
            console.log(`  - 总图片数: ${pageInfo.totalImages}`);
            console.log(`  - 总链接数: ${pageInfo.totalLinks}`);
            console.log(`  - 闪卡文本: ${pageInfo.flashcardText.join(', ')}`);
            console.log(`  - 下载链接数: ${pageInfo.downloadLinks.length}`);

            // 查找具体的闪卡图片
            const flashcardImages = await this.page.$$eval('img', imgs => 
                imgs.map(img => ({
                    src: img.src,
                    alt: img.alt || '',
                    title: img.title || '',
                    className: img.className,
                    width: img.width,
                    height: img.height
                })).filter(img => {
                    const src = img.src.toLowerCase();
                    const alt = img.alt.toLowerCase();
                    return img.src && 
                           !src.includes('logo') && 
                           !src.includes('icon') && 
                           (src.includes('flashcard') || alt.length > 0);
                })
            );

            console.log(`🖼️ 发现 ${flashcardImages.length} 张闪卡图片:`);
            flashcardImages.forEach((img, index) => {
                console.log(`  ${index + 1}. ${img.alt || img.title || 'unnamed'}`);
                console.log(`     ${img.src}`);
            });

            // 下载前几张图片作为测试
            const testDownloads = flashcardImages.slice(0, 3);
            console.log(`\n⬇️ 测试下载前 ${testDownloads.length} 张图片...`);

            for (let i = 0; i < testDownloads.length; i++) {
                const img = testDownloads[i];
                const fileName = `test_${i + 1}_${this.sanitizeFileName(img.alt || img.title || 'flashcard')}.jpg`;
                await this.downloadFile(img.src, fileName);
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // 测试PDF下载
            if (pageInfo.downloadLinks.length > 0) {
                console.log(`\n📄 测试PDF下载...`);
                const pdfLink = pageInfo.downloadLinks[0];
                const fileName = `test_${this.sanitizeFileName(pdfLink.text)}.pdf`;
                await this.downloadFile(pdfLink.href, fileName);
            }

            return {
                success: true,
                totalImages: flashcardImages.length,
                downloadLinks: pageInfo.downloadLinks.length,
                testDownloads: testDownloads.length
            };

        } catch (error) {
            console.error('❌ 测试失败:', error.message);
            return { success: false, error: error.message };
        }
    }

    async downloadFile(fileUrl, fileName) {
        try {
            const response = await axios({
                method: 'GET',
                url: fileUrl,
                responseType: 'stream',
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                }
            });

            const filePath = path.join(this.downloadDir, fileName);
            const writer = fs.createWriteStream(filePath);
            
            response.data.pipe(writer);
            
            return new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    console.log(`✅ 测试下载完成: ${fileName}`);
                    resolve(true);
                });
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`❌ 下载失败 ${fileName}:`, error.message);
            return false;
        }
    }

    sanitizeFileName(fileName) {
        return fileName.replace(/[<>:"/\\|?*]/g, '_')
                      .replace(/\s+/g, '_')
                      .substring(0, 50); // 限制长度
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
        console.log('✅ 测试完成');
    }

    async run() {
        try {
            await this.init();
            const result = await this.testSingleCategory();
            
            console.log('\n📊 测试结果:');
            console.log(JSON.stringify(result, null, 2));
            
        } catch (error) {
            console.error('❌ 测试过程中出现错误:', error);
        } finally {
            await this.close();
        }
    }
}

// 运行测试
(async () => {
    const tester = new TestScraper();
    await tester.run();
})(); 