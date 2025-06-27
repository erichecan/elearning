const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function visualVerification() {
  console.log('🔍 开始视觉验证：检查图片与单词匹配度');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🌐 访问网站...');
    await page.goto('https://elearningflashcard.netlify.app/');
    await page.waitForTimeout(3000);
    
    // 点击Food分类
    console.log('🍎 寻找Food分类...');
    const foodCard = page.locator('text=/Food/i').first();
    if (await foodCard.isVisible({ timeout: 5000 })) {
      await foodCard.click();
    } else {
      // 点击第一个分类
      await page.locator('[class*="card"]').first().click();
    }
    
    await page.waitForTimeout(5000);
    
    // 创建截图目录
    if (!fs.existsSync('word-analysis')) {
      fs.mkdirSync('word-analysis');
    }
    
    // 分析多个单词
    for (let i = 0; i < 3; i++) {
      console.log(`\n[${i + 1}] 分析单词...`);
      
      // 获取当前单词
      const wordElement = page.locator('h2, h3, [class*="word"]').first();
      const imageElement = page.locator('img[alt]').first();
      
      let word = 'unknown';
      let imageUrl = '';
      
      if (await wordElement.isVisible()) {
        word = await wordElement.textContent() || 'unknown';
      }
      
      if (await imageElement.isVisible()) {
        imageUrl = await imageElement.getAttribute('src') || '';
      }
      
      console.log(`单词: ${word.trim()}`);
      console.log(`图片: ${imageUrl.substring(0, 80)}...`);
      
      // 截图
      const screenshotPath = `word-analysis/word-${i + 1}-${word.trim()}.png`;
      await page.screenshot({ path: screenshotPath });
      console.log(`截图: ${screenshotPath}`);
      
      // 分析图片类型
      if (imageUrl.includes('picsum.photos')) {
        console.log('❌ 使用随机图片 - 内容不匹配');
      } else if (imageUrl.includes('images.unsplash.com')) {
        console.log('✅ 使用精选图片 - 内容应该匹配');
      } else if (imageUrl.includes('data:image/svg')) {
        console.log('🎨 使用SVG图片 - 显示单词文本');
      }
      
      // 下一个单词
      const nextBtn = page.locator('button').filter({ hasText: /下一个|next/i }).first();
      if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
        await page.waitForTimeout(3000);
      } else {
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(3000);
      }
    }
    
    // 完整截图
    await page.screenshot({ path: 'complete-verification.png', fullPage: true });
    console.log('\n📷 完整截图: complete-verification.png');
    
  } catch (error) {
    console.error('验证失败:', error.message);
  } finally {
    await browser.close();
  }
}

visualVerification().catch(console.error); 