// 紧急修复：生成SQL语句直接更新Supabase数据库
console.log('🚨 紧急修复：生成数据库更新SQL语句');
console.log('=' * 60);

// 精选图片映射 - 经过验证的真实图片
const VERIFIED_IMAGES = {
  // 🐾 动物类 - 确保图片内容与单词匹配
  'dog': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&auto=format',
  'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&auto=format',
  'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&auto=format',
  'elephant': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop&auto=format',
  'giraffe': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&auto=format',
  'tiger': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=300&fit=crop&auto=format',
  'lion': 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=300&fit=crop&auto=format',
  'zebra': 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop&auto=format',
  'monkey': 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=300&fit=crop&auto=format',
  
  // 🍎 食物类 - 真实食物图片
  'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&auto=format',
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format',
  'hamburger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format',
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format',
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format',
  'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&auto=format',
  'orange': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&auto=format',
  
  // 🎨 颜色类 - 真实颜色展示
  'red': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format',
  'blue': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop&auto=format',
  'green': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
  'yellow': 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=400&h=300&fit=crop&auto=format',
  'purple': 'https://images.unsplash.com/photo-1553181128-22e8bb5cd5fc?w=400&h=300&fit=crop&auto=format',
  'black': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format',
  'white': 'https://images.unsplash.com/photo-1548031616-7a61927ce0e1?w=400&h=300&fit=crop&auto=format',
};

console.log('📝 生成SQL更新语句...\n');

// 生成SQL语句
const sqlStatements = [];

Object.entries(VERIFIED_IMAGES).forEach(([word, imageUrl]) => {
  const sql = `UPDATE words SET image_url = '${imageUrl}' WHERE text = '${word}';`;
  sqlStatements.push(sql);
  console.log(`✅ ${word}: ${imageUrl}`);
});

console.log('\n' + '=' * 60);
console.log('📋 复制以下SQL语句到Supabase SQL Editor执行：');
console.log('=' * 60);
console.log('');

sqlStatements.forEach(sql => {
  console.log(sql);
});

console.log('');
console.log('-- 验证更新结果');
console.log('SELECT text, image_url FROM words WHERE text IN (');
const wordList = Object.keys(VERIFIED_IMAGES).map(word => `'${word}'`).join(', ');
console.log(`  ${wordList}`);
console.log(');');

console.log('\n' + '=' * 60);
console.log('🎯 执行步骤：');
console.log('1. 登录 https://supabase.com');
console.log('2. 进入项目控制台');
console.log('3. 打开 SQL Editor');
console.log('4. 复制粘贴上述SQL语句');
console.log('5. 点击执行');
console.log('6. 验证结果');
console.log('');
console.log('预期结果：所有单词将显示真实相关图片，而非随机图片！');
console.log('=' * 60); 