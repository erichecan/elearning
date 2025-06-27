const { chromium } = require('playwright');

async function verifyFix() {
  console.log('🔍 验证修复效果：检查图片是否为真实内容');
  
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
    
    // 点击Animals分类
    console.log('🐾 点击Animals分类...');
    const animalCard = page.locator('text=/Animals/i').first();
    if (await animalCard.isVisible({ timeout: 5000 })) {
      await animalCard.click();
    } else {
      await page.locator('[class*="card"]').first().click();
    }
    
    await page.waitForTimeout(5000);
    
    // 检查图片URL类型
    console.log('\n📸 检查图片类型...');
    
    for (let i = 0; i < 3; i++) {
      const imageElement = page.locator('img[alt]').first();
      const wordElement = page.locator('h2, h3, [class*="word"]').first();
      
      if (await imageElement.isVisible() && await wordElement.isVisible()) {
        const src = await imageElement.getAttribute('src');
        const alt = await imageElement.getAttribute('alt');
        const word = await wordElement.textContent();
        
        console.log(`\n[${i + 1}] 单词: ${word?.trim() || alt}`);
        console.log(`图片URL: ${src?.substring(0, 80)}...`);
        
        if (src?.includes('images.unsplash.com')) {
          console.log('✅ 成功！使用精选Unsplash图片');
        } else if (src?.includes('picsum.photos')) {
          console.log('❌ 仍是随机图片，需要再次修复');
        } else {
          console.log('🎨 使用SVG生成图片');
        }
      }
      
      // 下一个
      const nextBtn = page.locator('button').filter({ hasText: /下一个|next/i }).first();
      if (await nextBtn.isVisible({ timeout: 3000 })) {
        await nextBtn.click();
      } else {
        await page.keyboard.press('ArrowRight');
      }
      await page.waitForTimeout(2000);
    }
    
    // 截图验证
    await page.screenshot({ path: 'fix-verification.png', fullPage: true });
    console.log('\n📷 验证截图: fix-verification.png');
    
  } catch (error) {
    console.error('验证失败:', error.message);
  } finally {
    await browser.close();
  }
}

verifyFix().catch(console.error); 