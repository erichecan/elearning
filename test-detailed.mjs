import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // 设置iPad尺寸
  await page.setViewportSize({ width: 1024, height: 768 });
  
  try {
    console.log('=== FlashCard Kids 详细测试 ===');
    
    console.log('1. 访问首页...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 检查首页元素
    const title = await page.textContent('h1');
    console.log('首页标题:', title);
    
    const categories = await page.$$('.grid > div');
    console.log(`首页分类卡片数量: ${categories.length}`);
    
    console.log('2. 点击第一个分类...');
    await page.click('.grid > div:first-child');
    await page.waitForTimeout(1000);
    
    // 检查分类页面
    const categoryTitle = await page.textContent('h1');
    console.log('分类页面标题:', categoryTitle);
    
    const wordCards = await page.$$('.grid > div');
    console.log(`单词卡片数量: ${wordCards.length}`);
    
    if (wordCards.length > 0) {
      const firstCard = wordCards[0];
      
      // 检查卡片样式
      const cardStyles = await firstCard.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          width: computed.width,
          height: computed.height,
          aspectRatio: computed.aspectRatio,
          backgroundColor: computed.backgroundColor,
          borderRadius: computed.borderRadius,
          boxShadow: computed.boxShadow
        };
      });
      console.log('第一个单词卡片样式:', cardStyles);
      
      // 检查卡片内部结构
      const cardStructure = await firstCard.evaluate(el => {
        const img = el.querySelector('img');
        const textDiv = el.querySelector('.p-1');
        return {
          hasImage: !!img,
          imageSrc: img ? img.src : null,
          hasTextArea: !!textDiv,
          textContent: textDiv ? textDiv.textContent : null
        };
      });
      console.log('卡片内部结构:', cardStructure);
    }
    
    console.log('=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    await browser.close();
  }
})(); 