const SmartImageService = require('./smart-image-service');

function testSmartImageService() {
  console.log('🧪 测试智能图片服务...');
  console.log('=' * 50);
  
  const imageService = new SmartImageService();
  
  // 测试用例
  const testCases = [
    { word: 'cheese', category: 'Food' },
    { word: 'cat', category: 'Animals' },
    { word: 'dog', category: 'Animals' },
    { word: 'pizza', category: 'Food' },
    { word: 'red', category: 'Colors' },
    { word: 'elephant', category: 'Animals' },
    { word: 'unknown', category: 'Food' }, // 测试未知单词
    { word: 'test', category: null }, // 测试无分类
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n📸 测试 ${index + 1}: ${testCase.word} (${testCase.category || '无分类'})`);
    
    const imageUrl = imageService.getImageUrl(testCase.word, testCase.category);
    
    if (imageUrl.startsWith('https://images.unsplash.com/')) {
      console.log(`   ✅ 使用精选Unsplash图片`);
      console.log(`   🔗 ${imageUrl}`);
    } else if (imageUrl.startsWith('data:image/svg+xml')) {
      console.log(`   🎨 生成SVG图片`);
      console.log(`   📝 SVG数据长度: ${imageUrl.length} 字符`);
    } else {
      console.log(`   ❓ 其他类型图片: ${imageUrl.substring(0, 100)}...`);
    }
  });
  
  console.log('\n🎯 精选图片覆盖情况:');
  const imageMap = imageService.imageMap;
  const mappedWords = Object.keys(imageMap);
  console.log(`   📊 已配置精选图片: ${mappedWords.length} 个单词`);
  console.log(`   📝 单词列表: ${mappedWords.join(', ')}`);
  
  console.log('\n🎨 分类图标配置:');
  const categoryIcons = imageService.categoryIcons;
  Object.entries(categoryIcons).forEach(([category, icon]) => {
    console.log(`   ${icon} ${category}`);
  });
  
  console.log('\n✅ 智能图片服务测试完成！');
}

// 运行测试
testSmartImageService(); 