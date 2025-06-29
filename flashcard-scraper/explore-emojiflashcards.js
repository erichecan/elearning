const { chromium } = require('playwright');

async function exploreEmojiFlashcards() {
    console.log('🔍 开始探索 emojiflashcards.com 网站结构...\n');
    
    const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        });
        
        const page = await context.newPage();
        
        console.log('🌐 访问主页面...');
        await page.goto('https://emojiflashcards.com/flashcards/', {
            waitUntil: 'domcontentloaded',
            timeout: 15000
        });
        
        // 等待页面加载完成
        await page.waitForTimeout(3000);
        
        console.log(`📄 页面加载成功: ${await page.title()}`);
        
        // 查找所有分类链接
        console.log('\n🔍 开始分析分类链接...');
        
        // 查找所有包含flashcard分类的链接
        const categoryLinks = await page.$$eval('a[href*="flashcards"]', links => {
            return links.map(link => ({
                title: link.textContent.trim(),
                href: link.href,
                fullText: link.closest('div') ? link.closest('div').textContent.trim() : link.textContent.trim()
            })).filter(link => 
                link.href.includes('flashcards') && 
                link.title && 
                !link.href.includes('#') &&
                link.title !== 'Picture Flashcards'
            );
        });
        
        console.log(`📋 找到 ${categoryLinks.length} 个分类链接:`);
        
        // 分析每个分类
        const categories = [];
        for (const link of categoryLinks.slice(0, 10)) { // 限制前10个进行测试
            console.log(`\n📂 分析分类: ${link.title}`);
            console.log(`🔗 链接: ${link.href}`);
            
            // 从文本中提取数量信息
            const countMatch = link.fullText.match(/(\d+)\s*Picture\s*Flashcards/i);
            const count = countMatch ? parseInt(countMatch[1]) : 0;
            
            categories.push({
                name: link.title,
                url: link.href,
                expectedCount: count,
                description: link.fullText.slice(0, 100) + '...'
            });
            
            console.log(`📊 预期数量: ${count} 个flashcards`);
        }
        
        // 测试访问一个具体分类页面
        if (categories.length > 0) {
            console.log('\n🧪 测试访问具体分类页面...');
            const testCategory = categories[0];
            
            try {
                await page.goto(testCategory.url, {
                    waitUntil: 'domcontentloaded',
                    timeout: 10000
                });
                
                await page.waitForTimeout(2000);
                
                console.log(`✅ 成功访问: ${testCategory.name}`);
                
                // 查找flashcard元素
                const flashcardElements = await page.$$eval('img', imgs => {
                    return imgs.filter(img => 
                        img.src && 
                        (img.src.includes('flashcard') || img.alt)
                    ).map(img => ({
                        src: img.src,
                        alt: img.alt || '',
                        title: img.title || ''
                    }));
                });
                
                console.log(`🖼️  找到 ${flashcardElements.length} 个图片元素`);
                
                if (flashcardElements.length > 0) {
                    console.log('📋 前5个图片示例:');
                    flashcardElements.slice(0, 5).forEach((img, index) => {
                        console.log(`  ${index + 1}. ${img.alt || img.title || 'No title'}`);
                        console.log(`     URL: ${img.src}`);
                    });
                }
                
                // 查找文本内容
                const textElements = await page.$$eval('[class*="word"], [class*="text"], h1, h2, h3, strong', elements => {
                    return elements.map(el => el.textContent.trim()).filter(text => 
                        text.length > 0 && text.length < 50
                    );
                });
                
                console.log(`📝 找到 ${textElements.length} 个文本元素`);
                if (textElements.length > 0) {
                    console.log('📋 前10个文本示例:');
                    textElements.slice(0, 10).forEach((text, index) => {
                        console.log(`  ${index + 1}. "${text}"`);
                    });
                }
                
            } catch (error) {
                console.error(`❌ 访问分类页面失败: ${error.message}`);
            }
        }
        
        console.log('\n' + '='.repeat(70));
        console.log('📊 探索结果汇总');
        console.log('='.repeat(70));
        console.log(`🔗 总分类数: ${categories.length}`);
        console.log(`📊 总预期flashcards: ${categories.reduce((sum, cat) => sum + cat.expectedCount, 0)}`);
        
        console.log('\n📋 主要分类列表:');
        categories.forEach((cat, index) => {
            console.log(`  ${index + 1}. ${cat.name} (${cat.expectedCount} 个)`);
        });
        
        console.log('\n🚀 建议下一步:');
        console.log('1. 创建专门的emojiflashcards抓取器');
        console.log('2. 批量抓取高价值分类 (动物、食物、颜色等)');
        console.log('3. 保存到本地数据库');
        console.log('4. 生成迁移文件');
        
    } catch (error) {
        console.error('❌ 探索失败:', error.message);
    } finally {
        await browser.close();
    }
}

// 运行探索
if (require.main === module) {
    exploreEmojiFlashcards().catch(console.error);
}

module.exports = exploreEmojiFlashcards; 