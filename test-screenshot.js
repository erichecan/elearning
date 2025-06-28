const { chromium } = require('playwright');

async function takeScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 设置iPad尺寸
  await page.setViewportSize({ width: 1024, height: 768 });
  
  try {
    // 访问应用
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 等待页面完全加载
    await page.waitForTimeout(2000);
    
    // 截图1: 首页（分类卡片网格）
    await page.screenshot({ 
      path: 'homepage.png',
      fullPage: true 
    });
    console.log('✅ 首页截图已保存: homepage.png');
    
    // 点击第一个分类卡片
    await page.click('.grid > div:first-child');
    await page.waitForTimeout(1000);
    
    // 截图2: 分类页面
    await page.screenshot({ 
      path: 'category-page.png',
      fullPage: true 
    });
    console.log('✅ 分类页面截图已保存: category-page.png');
    
    // 验证分类页面卡片尺寸
    const cardElement = await page.locator('.grid > div:first-child');
    const cardBox = await cardElement.boundingBox();
    
    console.log('\n📏 卡片尺寸验证:');
    console.log(`宽度: ${cardBox.width}px (期望: 158px)`);
    console.log(`高度: ${cardBox.height}px (期望: 237px)`);
    console.log(`宽高比: ${(cardBox.width / cardBox.height).toFixed(2)} (期望: 0.67)`);
    
    // 验证样式
    const cardStyle = await cardElement.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow
      };
    });
    
    console.log('\n🎨 卡片样式验证:');
    console.log(`背景色: ${cardStyle.backgroundColor}`);
    console.log(`圆角: ${cardStyle.borderRadius}`);
    console.log(`阴影: ${cardStyle.boxShadow}`);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots(); 