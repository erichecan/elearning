import { chromium } from 'playwright';

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
    
    // 截图1: 首页（单词卡片网格）
    await page.screenshot({ 
      path: 'homepage.png',
      fullPage: true 
    });
    console.log('✅ 首页截图已保存: homepage.png');
    
    // 点击第一个单词卡片
    await page.click('.grid > div:first-child');
    await page.waitForTimeout(1000);
    
    // 截图2: 卡片学习页面
    await page.screenshot({ 
      path: 'card-page.png',
      fullPage: true 
    });
    console.log('✅ 卡片页面截图已保存: card-page.png');
    
    // 点击翻转按钮
    await page.click('button:has-text("查看详情")');
    await page.waitForTimeout(500);
    
    // 截图3: 翻转后的卡片
    await page.screenshot({ 
      path: 'card-flipped.png',
      fullPage: true 
    });
    console.log('✅ 翻转卡片截图已保存: card-flipped.png');
    
    // 验证卡片布局
    const cards = await page.locator('.grid > div').count();
    console.log(`\n📊 布局验证:`);
    console.log(`总卡片数: ${cards}`);
    
    // 验证第一个卡片的样式
    const firstCard = await page.locator('.grid > div:first-child');
    const cardBox = await firstCard.boundingBox();
    
    console.log('\n📏 卡片尺寸验证:');
    console.log(`宽度: ${cardBox.width}px`);
    console.log(`高度: ${cardBox.height}px`);
    console.log(`宽高比: ${(cardBox.width / cardBox.height).toFixed(2)} (期望: 0.67)`);
    
    // 验证样式
    const cardStyle = await firstCard.evaluate(el => {
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
    
    // 验证网格布局
    const gridStyle = await page.locator('.grid').evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap
      };
    });
    
    console.log('\n🔲 网格布局验证:');
    console.log(`显示方式: ${gridStyle.display}`);
    console.log(`列模板: ${gridStyle.gridTemplateColumns}`);
    console.log(`间距: ${gridStyle.gap}`);
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  } finally {
    await browser.close();
  }
}

takeScreenshots(); 