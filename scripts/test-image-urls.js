const { chromium } = require('playwright');

async function testImageUrls() {
  console.log('🧪 测试不同的图片URL格式...');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 要测试的图片URL格式
  const urlsToTest = [
    // 当前使用的格式
    'https://source.unsplash.com/400x300/?cat',
    'https://source.unsplash.com/400x300/cat',
    
    // 新的Unsplash API格式
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1574870111867-089730e5a72c?w=400&h=300&fit=crop',
    
    // Picsum (Lorem Picsum)
    'https://picsum.photos/400/300',
    'https://picsum.photos/400/300?random=1',
    
    // Placeholder服务
    'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Cat',
    'https://placehold.co/400x300/4CAF50/ffffff/png?text=Cat',
    
    // Pexels API (需要API key但有免费图片)
    'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?w=400&h=300&fit=crop&auto=compress',
  ];
  
  console.log(`📊 测试 ${urlsToTest.length} 个不同的图片URL...\n`);
  
  for (let i = 0; i < urlsToTest.length; i++) {
    const url = urlsToTest[i];
    console.log(`🔍 测试 ${i + 1}: ${url}`);
    
    try {
      const response = await page.goto(url, { 
        waitUntil: 'load', 
        timeout: 10000 
      });
      
      const status = response.status();
      const contentType = response.headers()['content-type'];
      
      if (status === 200 && contentType && contentType.includes('image')) {
        console.log(`   ✅ 成功 - 状态: ${status}, 类型: ${contentType}`);
      } else {
        console.log(`   ❌ 失败 - 状态: ${status}, 类型: ${contentType}`);
      }
      
    } catch (error) {
      console.log(`   ❌ 错误: ${error.message}`);
    }
    
    console.log('');
  }
  
  await browser.close();
  
  console.log('💡 推荐解决方案:');
  console.log('1. 使用 Picsum Photos (免费, 稳定): https://picsum.photos/400/300');
  console.log('2. 使用新的 Unsplash API 格式');
  console.log('3. 使用我们的 SVG 生成器 (最稳定)');
  console.log('4. 混合使用多种图片源');
}

testImageUrls().catch(console.error); 