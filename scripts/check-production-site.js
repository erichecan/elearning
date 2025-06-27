const { chromium } = require('playwright');

async function checkProductionSite() {
  console.log('🔍 检查生产环境网站: https://elearningflashcard.netlify.app/');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 }
  });
  
  const page = await context.newPage();
  
  // 监听图片请求
  page.on('request', request => {
    if (request.resourceType() === 'image') {
      console.log(`📡 图片请求: ${request.url()}`);
    }
  });
  
  try {
    console.log('🌐 访问网站...');
    await page.goto('https://elearningflashcard.netlify.app/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });
    await page.waitForTimeout(5000);
    
    console.log('\n🍎 寻找并点击食物分类...');
    const foodCard = page.locator('text=/Food|食物|实物/').first();
    
    if (await foodCard.isVisible()) {
      await foodCard.click();
      await page.waitForTimeout(3000);
      
      console.log('\n📸 检查第一张图片...');
      const wordImage = page.locator('.word-image').first();
      
      if (await wordImage.isVisible()) {
        const src = await wordImage.getAttribute('src');
        const alt = await wordImage.getAttribute('alt');
        
        console.log(`图片信息:`);
        console.log(`Alt: ${alt}`);
        console.log(`URL: ${src}`);
        
        if (src && src.includes('picsum.photos')) {
          console.log('❌ 问题确认: 使用Picsum随机图片，与单词内容不匹配！');
        }
      }
    }
    
    await page.screenshot({ path: 'production-check.png', fullPage: true });
    
  } catch (error) {
    console.error('检查失败:', error.message);
  } finally {
    await browser.close();
  }
}

checkProductionSite().catch(console.error); 