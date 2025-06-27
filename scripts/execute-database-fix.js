const { createClient } = require('@supabase/supabase-js');

// Supabase配置
const supabaseUrl = 'https://zrgbqwbrsyjbkcrmbgrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZ2Jxd2Jyc3lqYmtjcm1iZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODcwMzQsImV4cCI6MjA0NzA2MzAzNH0.a4Xp98X97t3S1vl8iV4AUO_lUhVY3VG-K8gnXGZSP7o';

const supabase = createClient(supabaseUrl, supabaseKey);

// 图片修复映射
const IMAGE_FIXES = [
  // 🐾 动物类
  { word: 'dog', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&auto=format' },
  { word: 'cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&auto=format' },
  { word: 'bird', url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&auto=format' },
  { word: 'elephant', url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop&auto=format' },
  { word: 'giraffe', url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&auto=format' },
  { word: 'tiger', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=300&fit=crop&auto=format' },
  { word: 'lion', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=300&fit=crop&auto=format' },
  { word: 'zebra', url: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop&auto=format' },
  { word: 'monkey', url: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=300&fit=crop&auto=format' },
  
  // 🍎 食物类
  { word: 'cheese', url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&auto=format' },
  { word: 'pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format' },
  { word: 'hamburger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format' },
  { word: 'apple', url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format' },
  { word: 'banana', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format' },
  { word: 'bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format' },
  { word: 'milk', url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&auto=format' },
  
  // 🎨 颜色类
  { word: 'red', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format' },
  { word: 'blue', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop&auto=format' },
  { word: 'green', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format' },
  { word: 'yellow', url: 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=400&h=300&fit=crop&auto=format' },
];

async function executeDatabaseFix() {
  console.log('🚀 开始执行数据库修复...');
  console.log('🎯 目标：将随机图片替换为真实匹配图片');
  console.log('=' * 60);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < IMAGE_FIXES.length; i++) {
    const fix = IMAGE_FIXES[i];
    
    console.log(`\n[${i + 1}/${IMAGE_FIXES.length}] 🔧 修复单词: ${fix.word}`);
    console.log(`   新图片: ${fix.url.substring(0, 60)}...`);
    
    try {
      const { data, error } = await supabase
        .from('words')
        .update({ image_url: fix.url })
        .eq('text', fix.word)
        .select();
      
      if (error) {
        console.log(`   ❌ 失败: ${error.message}`);
        errorCount++;
      } else if (data && data.length > 0) {
        console.log(`   ✅ 成功更新`);
        successCount++;
      } else {
        console.log(`   ⚠️  单词不存在于数据库`);
      }
      
    } catch (err) {
      console.log(`   ❌ 异常: ${err.message}`);
      errorCount++;
    }
    
    // 短暂延迟避免请求过快
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n' + '=' * 60);
  console.log('🎉 数据库修复完成！');
  console.log(`✅ 成功: ${successCount} 个单词`);
  console.log(`❌ 失败: ${errorCount} 个单词`);
  
  if (successCount > 0) {
    console.log('\n🔍 验证修复结果...');
    await verifyFixes();
  }
}

async function verifyFixes() {
  try {
    const wordList = IMAGE_FIXES.map(fix => fix.word);
    
    const { data, error } = await supabase
      .from('words')
      .select('text, image_url')
      .in('text', wordList)
      .order('text');
    
    if (error) {
      console.log('❌ 验证查询失败:', error.message);
      return;
    }
    
    console.log('\n📊 修复结果验证:');
    data.forEach(word => {
      const isUnsplash = word.image_url?.includes('images.unsplash.com');
      const status = isUnsplash ? '✅' : '❌';
      console.log(`   ${status} ${word.text}: ${isUnsplash ? '精选图片' : '仍是随机图片'}`);
    });
    
    const unsplashCount = data.filter(w => w.image_url?.includes('images.unsplash.com')).length;
    console.log(`\n📈 统计: ${unsplashCount}/${data.length} 个单词使用精选图片`);
    
    if (unsplashCount === data.length) {
      console.log('🎉 完美！所有单词都已修复为真实图片！');
      console.log('🔗 现在访问网站，"起司"将显示真正的起司图片！');
    }
    
  } catch (err) {
    console.log('❌ 验证过程出错:', err.message);
  }
}

// 执行修复
executeDatabaseFix().catch(console.error); 