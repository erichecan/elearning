const { chromium } = require('playwright');
const fs = require('fs');

async function detailedWordAnalysis() {
  console.log('🔍 详细单词分析：验证图片与单词匹配度');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 2000 
  });
  
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log('🌐 访问网站...');
    await page.goto('https://elearningflashcard.netlify.app/');
    await page.waitForTimeout(5000);
    
    // 查找所有分类卡片
    console.log('📋 查找分类卡片...');
    const cards = await page.locator('[class*="card"]').all();
    console.log(`找到 ${cards.length} 个分类卡片`);
    
    // 点击第一个分类（通常是Food）
    if (cards.length > 0) {
      console.log('🖱️  点击第一个分类...');
      await cards[0].click();
      await page.waitForTimeout(5000);
      
      // 创建分析目录
      if (!fs.existsSync('detailed-analysis')) {
        fs.mkdirSync('detailed-analysis');
      }
      
      console.log('🔍 分析学习界面...');
      
      // 尝试多种方式找到单词元素
      const possibleWordSelectors = [
        'h1', 'h2', 'h3', 
        '[class*="word"]',
        '[class*="text"]',
        '.learning-word',
        '.current-word',
        '.word-display'
      ];
      
      const possibleImageSelectors = [
        'img[alt]',
        'img[src]',
        '.word-image',
        '.learning-image',
        'img:not([src*="icon"]):not([src*="logo"])'
      ];
      
      // 截图整页
      await page.screenshot({ path: 'detailed-analysis/full-page.png', fullPage: true });
      console.log('📷 全页截图: detailed-analysis/full-page.png');
      
      // 分析当前页面内容
      console.log('\n📝 页面内容分析:');
      
      let foundWord = false;
      let foundImage = false;
      
      // 查找单词
      for (const selector of possibleWordSelectors) {
        try {
          const elements = await page.locator(selector).all();
          for (let i = 0; i < elements.length; i++) {
            const text = await elements[i].textContent();
            if (text && text.trim() && text.trim().length < 20) {
              console.log(`📝 找到文本 (${selector}): "${text.trim()}"`);
              foundWord = true;
            }
          }
        } catch (e) {
          // 继续
        }
      }
      
      // 查找图片
      for (const selector of possibleImageSelectors) {
        try {
          const images = await page.locator(selector).all();
          for (let i = 0; i < images.length; i++) {
            const src = await images[i].getAttribute('src');
            const alt = await images[i].getAttribute('alt');
            if (src) {
              console.log(`🖼️  找到图片 (${selector}):`);
              console.log(`    src: ${src.substring(0, 80)}...`);
              console.log(`    alt: ${alt || '无'}`);
              foundImage = true;
              
              // 分析图片类型
              if (src.includes('picsum.photos')) {
                console.log(`    类型: ❌ Picsum随机图片`);
              } else if (src.includes('images.unsplash.com')) {
                console.log(`    类型: ✅ 精选Unsplash图片`);
              } else if (src.includes('data:image/svg')) {
                console.log(`    类型: 🎨 SVG图片`);
              } else {
                console.log(`    类型: ❓ 其他类型`);
              }
            }
          }
        } catch (e) {
          // 继续
        }
      }
      
      if (!foundWord) {
        console.log('⚠️  未找到明确的单词文本');
      }
      
      if (!foundImage) {
        console.log('⚠️  未找到图片元素');
      }
      
      // 尝试点击下一个按钮多次
      console.log('\n🔄 尝试浏览多个单词...');
      
      for (let i = 0; i < 5; i++) {
        console.log(`\n--- 第 ${i + 1} 次尝试 ---`);
        
        // 截图当前状态
        const screenshotPath = `detailed-analysis/state-${i + 1}.png`;
        await page.screenshot({ path: screenshotPath });
        console.log(`📷 当前状态截图: ${screenshotPath}`);
        
        // 查找并打印当前页面所有文本
        const allText = await page.textContent('body');
        const lines = allText.split('\n').filter(line => line.trim().length > 0 && line.trim().length < 50);
        console.log('📄 页面重要文本:');
        lines.slice(0, 10).forEach(line => {
          console.log(`    "${line.trim()}"`);
        });
        
        // 尝试多种下一个按钮
        const nextSelectors = [
          'button:has-text("下一个")',
          'button:has-text("Next")',
          'button:has-text("→")',
          '[class*="next"]',
          '[class*="arrow"]',
          'button',
        ];
        
        let clicked = false;
        for (const selector of nextSelectors) {
          try {
            const button = page.locator(selector).first();
            if (await button.isVisible({ timeout: 2000 })) {
              console.log(`🖱️  点击按钮: ${selector}`);
              await button.click();
              clicked = true;
              break;
            }
          } catch (e) {
            // 继续尝试
          }
        }
        
        if (!clicked) {
          console.log('⌨️  尝试键盘导航...');
          await page.keyboard.press('ArrowRight');
          await page.waitForTimeout(1000);
          await page.keyboard.press('Space');
        }
        
        await page.waitForTimeout(3000);
      }
      
    } else {
      console.log('❌ 未找到任何分类卡片');
    }
    
  } catch (error) {
    console.error('❌ 分析失败:', error.message);
  } finally {
    await browser.close();
  }
  
  console.log('\n✅ 分析完成！请查看 detailed-analysis/ 目录中的截图');
}

detailedWordAnalysis().catch(console.error); 