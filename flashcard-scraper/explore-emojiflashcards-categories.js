const { chromium } = require('playwright');

async function exploreCategories() {
    console.log('🔍 开始探索 emojiflashcards.com 英语分类...\n');
    
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        });
        
        const page = await context.newPage();
        
        // 定义要测试的英语分类
        const categories = [
            { name: 'Animals', url: 'https://emojiflashcards.com/flashcards/animals', dbCategory: 'animals' },
            { name: 'Colors', url: 'https://emojiflashcards.com/flashcards/colors', dbCategory: 'colors' },
            { name: 'Numbers', url: 'https://emojiflashcards.com/flashcards/numbers', dbCategory: 'numbers' }
        ];
        
        for (const category of categories) {
            console.log(`\n📂 测试分类: ${category.name}`);
            console.log(`🔗 URL: ${category.url}`);
            
            try {
                await page.goto(category.url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 15000
                });
                
                await page.waitForTimeout(3000);
                console.log(`✅ 页面加载成功`);
                
                // 查找图片
                const images = await page.$$eval('img', imgs => {
                    return imgs.map(img => ({
                        src: img.src,
                        alt: img.alt || ''
                    })).filter(img => img.src && img.alt);
                });
                
                console.log(`🖼️  找到 ${images.length} 个图片`);
                
                if (images.length > 0) {
                    console.log('前3个示例:');
                    images.slice(0, 3).forEach((img, i) => {
                        console.log(`  ${i + 1}. ${img.alt} -> ${img.src}`);
                    });
                }
                
            } catch (error) {
                console.error(`❌ ${category.name} 失败: ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ 总体失败:', error.message);
    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    exploreCategories().catch(console.error);
}

module.exports = exploreCategories; 