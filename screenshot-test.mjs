import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 设置视口大小
  await page.setViewportSize({ width: 1200, height: 800 });
  
  try {
    // 截图首页
    console.log('正在访问首页...');
    await page.goto('http://localhost:3001');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'homepage-cards.png', fullPage: false });
    console.log('首页截图已保存: homepage-cards.png');
    
    // 点击第一个分类进入分类页面
    console.log('正在进入分类页面...');
    await page.click('.bg-white:first-child');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'category-cards.png', fullPage: false });
    console.log('分类页面截图已保存: category-cards.png');
    
  } catch (error) {
    console.error('截图失败:', error);
  }
  
  await browser.close();
})(); 