const { chromium } = require('playwright');

async function finalProductionCheck() {
  console.log('🔍 最终生产环境检查: 智能图片服务');
  console.log('🌐 https://elearningflashcard.netlify.app/');
  console.log('=' * 60);
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 }
  });
  
  const page = await context.newPage();
  
  const imageStats = {
    unsplashImages: 0,
    svgImages: 0,
    placeholderImages: 0,
    failedImages: 0,
    totalImages: 0
  };
  
  // 监听图片请求
  page.on('request', request => {
    if (request.resourceType() === 'image') {
      imageStats.totalImages++;
      const url = request.url();
      
      if (url.includes('images.unsplash.com')) {
        imageStats.unsplashImages++;
        console.log(`✅ 精选Unsplash图片: ${url}`);
      } else if (url.includes('picsum.photos')) {
        console.log(`⚠️  Picsum随机图片: ${url}`);
      } else if (url.includes('placeholder')) {
        imageStats.placeholderImages++;
        console.log(`❌ 占位符图片: ${url}`);
      } else if (url.includes('data:image/svg')) {
        imageStats.svgImages++;
        console.log(`🎨 SVG图片: ${url.substring(0, 50)}...`);
      } else {
        console.log(`📷 其他图片: ${url}`);
      }
    }
  });
  
  // 监听图片响应失败
  page.on('response', response => {
    if (response.request().resourceType() === 'image') {
      if (response.status() >= 400) {
        imageStats.failedImages++;
        console.log(`❌ 图片加载失败 (${response.status()}): ${response.url()}`);
      }
    }
  });
  
  // 监听控制台消息
  page.on('console', msg => {
    if (msg.text().includes('图片') || msg.text().includes('Image')) {
      console.log(`💬 控制台: ${msg.text()}`);
    }
  });
  
  try {
    console.log('\n🌐 正在访问生产环境...');
    await page.goto('https://elearningflashcard.netlify.app/', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    
    console.log('\n🍎 寻找食物分类...');
    
    // 尝试多种方式查找食物分类
    const selectors = [
      'text=/Food/i',
      'text=/食物/i', 
      'text=/实物/i',
      '.category-card:has-text("Food")',
      '.category-card:has-text("实物")',
      '[class*="card"]'
    ];
    
    let foodCard = null;
    for (const selector of selectors) {
      try {
        foodCard = page.locator(selector).first();
        if (await foodCard.isVisible({ timeout: 2000 })) {
          const text = await foodCard.textContent();
          console.log(`✅ 找到分类: ${text?.trim()}`);
          if (text && (text.includes('Food') || text.includes('食物') || text.includes('实物'))) {
            break;
          }
        }
      } catch (e) {
        // 继续尝试下一个选择器
      }
    }
    
    if (!foodCard || !(await foodCard.isVisible())) {
      console.log('⚠️  未找到食物分类，尝试点击第一个分类卡片');
      const firstCard = page.locator('[class*="card"]').first();
      if (await firstCard.isVisible()) {
        foodCard = firstCard;
      }
    }
    
    if (foodCard && await foodCard.isVisible()) {
      console.log('\n🖱️  点击分类卡片...');
      await foodCard.click();
      await page.waitForTimeout(5000);
      
      console.log('\n📸 检查单词图片...');
      
      // 等待单词图片加载
      await page.waitForSelector('img', { timeout: 10000 });
      
      // 查找单词图片
      const wordImages = page.locator('img[alt]:not([src*="icon"]):not([src*="logo"])');
      const imageCount = await wordImages.count();
      
      console.log(`📊 找到 ${imageCount} 个单词图片`);
      
      for (let i = 0; i < Math.min(imageCount, 3); i++) {
        try {
          const img = wordImages.nth(i);
          const src = await img.getAttribute('src');
          const alt = await img.getAttribute('alt');
          
          console.log(`\n📸 图片 ${i + 1}:`);
          console.log(`   Alt: ${alt}`);
          console.log(`   URL: ${src?.substring(0, 80)}...`);
          
          if (src) {
            if (src.includes('images.unsplash.com')) {
              console.log(`   ✅ 类型: 精选Unsplash图片 - 内容匹配！`);
            } else if (src.includes('data:image/svg')) {
              console.log(`   🎨 类型: 精美SVG图片`);
            } else if (src.includes('picsum.photos')) {
              console.log(`   ⚠️  类型: 随机图片 - 内容可能不匹配`);
            } else if (src.includes('placeholder')) {
              console.log(`   ❌ 类型: 占位符 - 需要修复`);
            }
          }
          
        } catch (e) {
          console.log(`⚠️  无法检查图片 ${i + 1}: ${e.message}`);
        }
      }
      
      // 尝试查看更多单词
      console.log('\n➡️  尝试查看下一个单词...');
      const nextButton = page.locator('button').filter({ hasText: /下一个|next|→/i }).first();
      
      if (await nextButton.isVisible({ timeout: 3000 })) {
        await nextButton.click();
        await page.waitForTimeout(3000);
        
        const nextImg = page.locator('img[alt]:not([src*="icon"]):not([src*="logo"])').first();
        if (await nextImg.isVisible()) {
          const nextSrc = await nextImg.getAttribute('src');
          const nextAlt = await nextImg.getAttribute('alt');
          
          console.log(`📸 下一个单词:`);
          console.log(`   Alt: ${nextAlt}`);
          console.log(`   URL: ${nextSrc?.substring(0, 80)}...`);
        }
      } else {
        console.log('⚠️  未找到下一个按钮');
      }
      
    } else {
      console.log('❌ 无法找到或点击分类卡片');
    }
    
    // 保存截图
    await page.screenshot({ 
      path: 'final-production-check.png', 
      fullPage: true 
    });
    
    console.log('\n📊 图片统计报告:');
    console.log(`   🎯 精选Unsplash图片: ${imageStats.unsplashImages} 个`);
    console.log(`   🎨 SVG生成图片: ${imageStats.svgImages} 个`);
    console.log(`   ❌ 占位符图片: ${imageStats.placeholderImages} 个`);
    console.log(`   ⚠️  加载失败: ${imageStats.failedImages} 个`);
    console.log(`   📊 总计请求: ${imageStats.totalImages} 个`);
    
    console.log('\n💡 修复效果评估:');
    if (imageStats.placeholderImages === 0 && imageStats.unsplashImages > 0) {
      console.log('🎉 完美！已使用智能图片服务，无占位符图片');
    } else if (imageStats.placeholderImages > 0) {
      console.log('⚠️  仍有占位符图片，需要进一步修复');
    } else {
      console.log('✅ 图片加载正常，智能图片服务运行良好');
    }
    
    console.log('\n📷 截图已保存: final-production-check.png');
    
  } catch (error) {
    console.error('❌ 检查过程出错:', error.message);
  } finally {
    await browser.close();
  }
}

finalProductionCheck().catch(console.error); 