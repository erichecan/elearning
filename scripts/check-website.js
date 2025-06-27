const { chromium } = require('playwright');

async function checkWebsite() {
  console.log('🚀 开始检查网站图片显示情况...');
  
  // 启动浏览器
  const browser = await chromium.launch({ 
    headless: false, // 设置为false可以看到浏览器窗口
    devtools: false 
  });
  
  try {
    const context = await browser.newContext({
      viewport: { width: 1024, height: 768 }, // iPad尺寸
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    // 监听控制台消息
    page.on('console', msg => {
      console.log(`🔍 控制台: [${msg.type()}] ${msg.text()}`);
    });
    
    // 监听网络请求
    page.on('request', request => {
      if (request.url().includes('placeholder') || request.url().includes('unsplash')) {
        console.log(`📡 图片请求: ${request.url()}`);
      }
    });
    
    // 监听网络响应
    page.on('response', response => {
      if (response.url().includes('placeholder') || response.url().includes('unsplash')) {
        console.log(`📥 图片响应: ${response.url()} - 状态: ${response.status()}`);
      }
    });
    
    // 访问网站
    console.log('🌐 正在访问网站...');
    await page.goto('https://685f1239680068000871f59f--elearningflashcard.netlify.app/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // 等待页面加载
    await page.waitForTimeout(3000);
    
    // 检查页面标题
    const title = await page.title();
    console.log(`📄 页面标题: ${title}`);
    
    // 查找所有图片元素
    const images = await page.locator('img').all();
    console.log(`🖼️  找到 ${images.length} 个图片元素`);
    
    // 检查每个图片的状态
    for (let i = 0; i < images.length; i++) {
      try {
        const img = images[i];
        const src = await img.getAttribute('src');
        const alt = await img.getAttribute('alt');
        
        console.log(`\n📸 图片 ${i + 1}:`);
        console.log(`   - URL: ${src}`);
        console.log(`   - Alt: ${alt}`);
        
        if (src) {
          if (src.includes('placeholder')) {
            console.log(`   ❌ 状态: 占位符图片`);
          } else if (src.includes('unsplash')) {
            console.log(`   ✅ 状态: Unsplash图片`);
          } else if (src.includes('data:image/svg')) {
            console.log(`   🎨 状态: SVG图片`);
          } else {
            console.log(`   ❓ 状态: 其他类型`);
          }
        }
        
      } catch (error) {
        console.log(`   ⚠️  检查图片 ${i + 1} 时出错: ${error.message}`);
      }
    }
    
    // 尝试点击一个分类来测试学习界面
    console.log('\n🎯 尝试进入学习界面...');
    try {
      // 查找分类卡片
      const categoryCards = await page.locator('.category-card, .bg-white').all();
      if (categoryCards.length > 0) {
        console.log(`📚 找到 ${categoryCards.length} 个分类`);
        
        // 点击第一个分类
        await categoryCards[0].click();
        await page.waitForTimeout(2000);
        
        // 检查学习界面的图片
        const learningImages = await page.locator('.word-image, img').all();
        console.log(`\n📖 学习界面图片检查 (${learningImages.length} 个):`);
        
        for (let i = 0; i < Math.min(3, learningImages.length); i++) {
          const img = learningImages[i];
          const src = await img.getAttribute('src');
          const alt = await img.getAttribute('alt');
          
          console.log(`   图片 ${i + 1}: ${alt} -> ${src}`);
          
          if (src && src.includes('placeholder')) {
            console.log(`   ❌ 仍然是占位符！`);
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  测试学习界面时出错: ${error.message}`);
    }
    
    // 截图保存
    console.log('\n📷 保存截图...');
    await page.screenshot({ 
      path: 'website-screenshot.png', 
      fullPage: true 
    });
    
    console.log('\n✅ 检查完成！截图已保存为 website-screenshot.png');
    
  } catch (error) {
    console.error('❌ 检查过程中出错:', error);
  } finally {
    await browser.close();
  }
}

// 运行检查
checkWebsite().catch(console.error); 