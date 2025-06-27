const { chromium } = require('playwright');

async function checkLearningPage() {
  console.log('🚀 专门检查学习界面的单词图片...');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // 减慢操作速度便于观察
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1024, height: 768 },
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    // 监听所有网络请求
    page.on('request', request => {
      if (request.url().includes('placeholder') || 
          request.url().includes('unsplash') || 
          request.url().includes('image')) {
        console.log(`🌐 请求: ${request.url()}`);
      }
    });
    
    // 监听网络响应
    page.on('response', response => {
      if (response.url().includes('placeholder') || 
          response.url().includes('unsplash') ||
          response.url().includes('image')) {
        console.log(`📥 响应: ${response.url()} - ${response.status()}`);
      }
    });
    
    // 监听控制台
    page.on('console', msg => {
      if (msg.text().includes('图片') || msg.text().includes('image') || msg.text().includes('URL')) {
        console.log(`💬 控制台: ${msg.text()}`);
      }
    });
    
    console.log('🌐 访问网站...');
    await page.goto('https://685f1239680068000871f59f--elearningflashcard.netlify.app/');
    
    // 等待页面完全加载
    await page.waitForTimeout(3000);
    
    console.log('🎯 寻找并点击第一个分类...');
    
    // 尝试多种选择器来找到分类卡片
    const possibleSelectors = [
      '.category-card',
      '.bg-white',
      '[class*="card"]',
      '[class*="category"]',
      'div[class*="p-6"]',
      'div[class*="rounded"]'
    ];
    
    let clicked = false;
    for (const selector of possibleSelectors) {
      try {
        const elements = await page.locator(selector).all();
        if (elements.length > 0) {
          console.log(`✅ 找到 ${elements.length} 个元素 (${selector})`);
          
          // 点击第一个可点击的元素
          for (let i = 0; i < elements.length; i++) {
            try {
              await elements[i].click();
              console.log(`🖱️  点击了第 ${i + 1} 个元素`);
              clicked = true;
              break;
            } catch (e) {
              console.log(`⚠️  第 ${i + 1} 个元素不可点击`);
            }
          }
          
          if (clicked) break;
        }
      } catch (e) {
        // 忽略选择器错误，继续尝试下一个
      }
    }
    
    if (!clicked) {
      console.log('❌ 无法找到可点击的分类卡片');
      return;
    }
    
    // 等待进入学习界面
    console.log('⏳ 等待进入学习界面...');
    await page.waitForTimeout(3000);
    
    // 查找学习界面的图片
    console.log('🔍 检查学习界面的图片...');
    
    const allImages = await page.locator('img').all();
    console.log(`📸 学习界面找到 ${allImages.length} 个图片`);
    
    for (let i = 0; i < allImages.length; i++) {
      try {
        const img = allImages[i];
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        const classes = await img.getAttribute('class');
        
        console.log(`\n🖼️  图片 ${i + 1}:`);
        console.log(`   Alt: ${alt}`);
        console.log(`   Class: ${classes}`);
        console.log(`   URL: ${src?.substring(0, 100)}...`);
        
        if (src) {
          if (src.includes('via.placeholder.com')) {
            console.log(`   ❌ 这是占位符图片！`);
          } else if (src.includes('source.unsplash.com')) {
            console.log(`   ✅ 这是Unsplash图片`);
          } else if (src.includes('images.unsplash.com')) {
            console.log(`   🔧 这是老格式的Unsplash图片`);
          } else if (src.includes('data:image/svg')) {
            console.log(`   🎨 这是SVG图片`);
          } else {
            console.log(`   ❓ 未知图片类型`);
          }
        }
        
      } catch (error) {
        console.log(`   ⚠️  检查图片时出错: ${error.message}`);
      }
    }
    
    // 尝试查找单词相关的元素
    console.log('\n🔤 查找单词相关元素...');
    const wordElements = await page.locator('[class*="word"], [class*="item"], [class*="card"]').all();
    console.log(`📝 找到 ${wordElements.length} 个可能的单词元素`);
    
    // 检查是否有当前单词显示
    try {
      const textElements = await page.locator('text=/^[a-zA-Z]+$/').all();
      for (let i = 0; i < Math.min(5, textElements.length); i++) {
        const text = await textElements[i].textContent();
        if (text && text.length > 1 && text.length < 20) {
          console.log(`📖 可能的单词: "${text}"`);
        }
      }
    } catch (e) {
      console.log('⚠️  查找单词文本时出错');
    }
    
    // 保存学习界面截图
    console.log('\n📷 保存学习界面截图...');
    await page.screenshot({ 
      path: 'learning-page-screenshot.png', 
      fullPage: true 
    });
    
    console.log('✅ 学习界面检查完成！');
    
  } catch (error) {
    console.error('❌ 检查过程出错:', error);
  } finally {
    await browser.close();
  }
}

checkLearningPage().catch(console.error); 