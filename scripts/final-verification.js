const { chromium } = require('playwright');

async function finalVerification() {
  console.log('🎯 最终验证：检查图片占位符问题是否已解决');
  console.log('=' * 60);
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });
  
  const page = await context.newPage();
  
  // 监听图片请求
  const imageRequests = [];
  page.on('request', request => {
    if (request.resourceType() === 'image') {
      imageRequests.push(request.url());
    }
  });
  
  try {
    console.log('🌐 访问网站 (等待Netlify部署完成)...');
    await page.goto('https://685f1239680068000871f59f--elearningflashcard.netlify.app/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    
    console.log('\n📱 点击第一个分类进入学习界面...');
    const firstCard = page.locator('[class*="card"]').first();
    await firstCard.click();
    await page.waitForTimeout(3000);
    
    console.log('\n🔍 检查学习界面图片状态...');
    const wordImage = page.locator('.word-image').first();
    
    if (await wordImage.isVisible()) {
      const src = await wordImage.getAttribute('src');
      console.log(`📸 当前图片URL: ${src?.substring(0, 100)}...`);
      
      if (src) {
        if (src.includes('picsum.photos')) {
          console.log('🎉 ✅ 成功！现在显示的是Picsum Photos图片');
        } else if (src.includes('data:image/svg')) {
          console.log('🎨 ✅ 显示精美SVG图片（备用方案）');
        } else if (src.includes('placeholder')) {
          console.log('❌ 仍然是占位符 - 需要清除缓存');
        } else {
          console.log(`❓ 未知图片类型: ${src.substring(0, 50)}...`);
        }
      }
    }
    
    console.log('\n📊 图片请求统计:');
    const picsumRequests = imageRequests.filter(url => url.includes('picsum.photos'));
    const placeholderRequests = imageRequests.filter(url => url.includes('placeholder'));
    const svgRequests = imageRequests.filter(url => url.includes('data:image/svg'));
    
    console.log(`  🖼️  Picsum Photos: ${picsumRequests.length} 个`);
    console.log(`  🎨 SVG图片: ${svgRequests.length} 个`);
    console.log(`  ❌ 占位符: ${placeholderRequests.length} 个`);
    
    if (picsumRequests.length > 0) {
      console.log('\n🎉 验证结果: 图片占位符问题已成功解决！');
      console.log('💡 现在用户看到的是真实的高质量图片。');
    } else if (svgRequests.length > 0 && placeholderRequests.length === 0) {
      console.log('\n✅ 验证结果: 虽然使用SVG备用方案，但已消除占位符！');
      console.log('💡 SVG图片比占位符美观得多。');
    } else if (placeholderRequests.length > 0) {
      console.log('\n⚠️  仍有占位符，可能需要：');
      console.log('   1. 等待Netlify部署完成');
      console.log('   2. 清除浏览器缓存');
      console.log('   3. 检查网络连接');
    }
    
    // 保存最终验证截图
    await page.screenshot({ 
      path: 'final-verification.png', 
      fullPage: true 
    });
    console.log('\n📷 验证截图已保存: final-verification.png');
    
  } catch (error) {
    console.error('❌ 验证过程出错:', error.message);
  } finally {
    await browser.close();
  }
}

finalVerification().catch(console.error); 