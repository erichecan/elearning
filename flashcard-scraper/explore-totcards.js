const { chromium } = require('playwright');

async function exploreTotcards() {
    console.log('🔍 开始探索 totcards.com 网站结构...\n');
    
    const browser = await chromium.launch({ 
        headless: true,  // 无头模式，避免UI问题
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
    try {
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        });
        
        const page = await context.newPage();
        
        console.log('🌐 访问主页面...');
        await page.goto('https://www.totcards.com/free-months-flashcards.html', {
            waitUntil: 'domcontentloaded',
            timeout: 15000
        });
        
        // 等待页面加载完成
        await page.waitForTimeout(3000);
        
        console.log('📄 当前页面标题:', await page.title());
        console.log('📍 当前页面URL:', page.url());
        
        // 检查是否有加载验证页面
        const bodyText = await page.textContent('body');
        if (bodyText.includes('Please wait while your request is being verified')) {
            console.log('⏳ 检测到验证页面，等待跳转...');
            await page.waitForTimeout(10000); // 等待10秒
            
            // 检查是否跳转成功
            console.log('📍 等待后页面URL:', page.url());
            console.log('📄 等待后页面标题:', await page.title());
        }
        
        // 查找flashcard相关内容
        console.log('\n🔍 分析页面结构...');
        
        // 寻找图片
        const images = await page.$$eval('img', imgs => 
            imgs.map(img => ({
                src: img.src,
                alt: img.alt,
                className: img.className
            })).filter(img => img.src && !img.src.includes('logo'))
        );
        
        console.log(`🖼️  找到 ${images.length} 张图片:`);
        images.slice(0, 10).forEach((img, index) => {
            console.log(`  ${index + 1}. ${img.alt || 'No alt'} - ${img.src}`);
        });
        
        // 寻找链接和分类
        const links = await page.$$eval('a', links => 
            links.map(link => ({
                href: link.href,
                text: link.textContent.trim(),
                className: link.className
            })).filter(link => link.text && link.href.includes('totcards.com'))
        );
        
        console.log(`\n🔗 找到 ${links.length} 个内部链接:`);
        links.slice(0, 15).forEach((link, index) => {
            console.log(`  ${index + 1}. ${link.text} - ${link.href}`);
        });
        
        // 查找可能的分类或主题
        const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', headings => 
            headings.map(h => ({
                tag: h.tagName,
                text: h.textContent.trim()
            })).filter(h => h.text)
        );
        
        console.log(`\n📝 找到 ${headings.length} 个标题:`);
        headings.forEach((heading, index) => {
            console.log(`  ${index + 1}. ${heading.tag}: ${heading.text}`);
        });
        
        // 查找月份相关内容
        const monthsContent = await page.$$eval('*', elements => {
            const monthKeywords = ['january', 'february', 'march', 'april', 'may', 'june', 
                                 'july', 'august', 'september', 'october', 'november', 'december',
                                 'month', 'months'];
            
            return elements
                .filter(el => {
                    const text = el.textContent.toLowerCase();
                    return monthKeywords.some(keyword => text.includes(keyword)) && 
                           text.length < 100; // 避免太长的文本
                })
                .map(el => ({
                    tag: el.tagName,
                    text: el.textContent.trim(),
                    className: el.className
                }))
                .slice(0, 20); // 限制结果数量
        });
        
        console.log(`\n📅 找到 ${monthsContent.length} 个月份相关元素:`);
        monthsContent.forEach((element, index) => {
            console.log(`  ${index + 1}. ${element.tag}: ${element.text}`);
        });
        
        // 截图保存
        await page.screenshot({ path: 'totcards-screenshot.png', fullPage: true });
        console.log('\n📸 页面截图已保存为 totcards-screenshot.png');
        
        // 尝试查找具体的flashcard页面
        console.log('\n🔍 寻找具体的flashcard页面...');
        
        // 查找可能包含flashcard的链接
        const flashcardLinks = links.filter(link => 
            link.text.toLowerCase().includes('month') ||
            link.text.toLowerCase().includes('flashcard') ||
            link.href.includes('month') ||
            link.href.includes('flashcard')
        );
        
        console.log(`🎯 找到 ${flashcardLinks.length} 个可能的flashcard链接:`);
        flashcardLinks.forEach((link, index) => {
            console.log(`  ${index + 1}. ${link.text} - ${link.href}`);
        });
        
        // 如果找到了flashcard链接，访问第一个
        if (flashcardLinks.length > 0) {
            console.log(`\n🚀 访问第一个flashcard页面: ${flashcardLinks[0].href}`);
            await page.goto(flashcardLinks[0].href, { waitUntil: 'networkidle' });
            await page.waitForTimeout(2000);
            
            console.log('📄 Flashcard页面标题:', await page.title());
            
            // 在flashcard页面查找图片
            const flashcardImages = await page.$$eval('img', imgs => 
                imgs.map(img => ({
                    src: img.src,
                    alt: img.alt,
                    className: img.className
                })).filter(img => img.src && !img.src.includes('logo'))
            );
            
            console.log(`🖼️  Flashcard页面找到 ${flashcardImages.length} 张图片:`);
            flashcardImages.slice(0, 10).forEach((img, index) => {
                console.log(`  ${index + 1}. ${img.alt || 'No alt'} - ${img.src}`);
            });
        }
        
        console.log('\n✅ 网站探索完成！');
        
    } catch (error) {
        console.error('❌ 探索过程中出错:', error.message);
    } finally {
        await browser.close();
    }
}

// 运行探索
if (require.main === module) {
    exploreTotcards().catch(console.error);
}

module.exports = exploreTotcards; 