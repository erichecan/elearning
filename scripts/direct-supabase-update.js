// 直接更新Supabase数据库中的图片URL
const { createClient } = require('@supabase/supabase-js');

// Supabase配置
const supabaseUrl = 'https://zrgbqwbrsyjbkcrmbgrs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZ2Jxd2Jyc3lqYmtjcm1iZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODcwMzQsImV4cCI6MjA0NzA2MzAzNH0.a4Xp98X97t3S1vl8iV4AUO_lUhVY3VG-K8gnXGZSP7o';

const supabase = createClient(supabaseUrl, supabaseKey);

// 精选图片映射
const imageMap = {
  // 食物类
  'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&auto=format',
  'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format',
  'hamburger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format',
  'apple': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format',
  'banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format',
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format',
  'milk': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&auto=format',
  
  // 动物类
  'cat': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&auto=format',
  'dog': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&auto=format',
  'bird': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&auto=format',
  'elephant': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop&auto=format',
  'giraffe': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&auto=format',
  'tiger': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=300&fit=crop&auto=format',
  
  // 颜色类
  'red': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format',
  'blue': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop&auto=format',
  'green': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
  'yellow': 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=400&h=300&fit=crop&auto=format',
};

// 生成SVG图片
function generateWordSVG(word, category = null) {
  const categoryIcons = {
    'Animals': '🐾',
    'Food': '🍎',
    'Colors': '🎨',
    'Numbers': '🔢',
    'Family': '👨‍👩‍👧‍👦',
    'Toys': '🧸',
    'Body Parts': '👋',
    'Transportation': '🚗',
    'Home': '🏠',
    'School': '🏫'
  };
  
  const icon = category ? categoryIcons[category] || '📚' : '📚';
  const uniqueId = `word-${Math.random().toString(36).substr(2, 9)}`;
  
  const colorSchemes = [
    { bg: '#667eea', accent: '#764ba2', text: '#ffffff' },
    { bg: '#f093fb', accent: '#f5576c', text: '#ffffff' },
    { bg: '#4facfe', accent: '#00f2fe', text: '#ffffff' },
    { bg: '#43e97b', accent: '#38f9d7', text: '#ffffff' },
    { bg: '#fa709a', accent: '#fee140', text: '#ffffff' },
    { bg: '#a8edea', accent: '#fed6e3', text: '#333333' },
  ];
  
  const colorScheme = colorSchemes[word.length % colorSchemes.length];
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
      <defs>
        <linearGradient id="${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colorScheme.bg};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colorScheme.accent};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow-${uniqueId}">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.1"/>
        </filter>
      </defs>
      
      <!-- 背景 -->
      <rect width="400" height="300" fill="url(#${uniqueId})" rx="20"/>
      
      <!-- 装饰圆圈 -->
      <circle cx="350" cy="50" r="30" fill="white" opacity="0.1"/>
      <circle cx="50" cy="250" r="25" fill="white" opacity="0.15"/>
      <circle cx="320" cy="250" r="20" fill="white" opacity="0.1"/>
      
      <!-- 分类图标 -->
      <text x="50" y="70" font-size="40" font-family="system-ui" fill="white" opacity="0.8">${icon}</text>
      
      <!-- 单词文本 -->
      <text x="200" y="160" text-anchor="middle" 
            font-size="32" font-family="system-ui, -apple-system, sans-serif" 
            font-weight="bold" fill="${colorScheme.text}"
            filter="url(#shadow-${uniqueId})">${word.toUpperCase()}</text>
      
      <!-- 装饰线条 -->
      <rect x="120" y="180" width="160" height="3" fill="white" opacity="0.4" rx="2"/>
      
      <!-- 装饰图案 -->
      <polygon points="200,220 210,240 190,240" fill="white" opacity="0.3"/>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// 获取智能图片URL
function getSmartImageUrl(word, category = null) {
  const cleanWord = word.toLowerCase().trim();
  
  // 1. 首先检查精选图片映射
  if (imageMap[cleanWord]) {
    console.log(`✅ 使用精选图片: ${cleanWord}`);
    return imageMap[cleanWord];
  }
  
  // 2. 生成高质量的SVG图片
  console.log(`🎨 生成SVG图片: ${cleanWord}`);
  return generateWordSVG(cleanWord, category);
}

async function directSupabaseUpdate() {
  console.log('🔄 直接更新Supabase数据库图片URL...');
  console.log('=' * 60);
  
  try {
    console.log('📊 获取所有单词数据...');
    
    const { data: words, error } = await supabase
      .from('words')
      .select(`
        id,
        text,
        image_url,
        categories(name)
      `);
    
    if (error) {
      console.error('❌ 获取数据失败:', error);
      return;
    }
    
    console.log(`📝 找到 ${words.length} 个单词`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const categoryName = word.categories?.name;
      
      console.log(`\n[${i + 1}/${words.length}] 📸 处理: ${word.text} (${categoryName})`);
      console.log(`   当前: ${word.image_url?.substring(0, 60)}...`);
      
      // 生成新的智能图片URL
      const newImageUrl = getSmartImageUrl(word.text, categoryName);
      
      // 检查是否需要更新
      if (word.image_url === newImageUrl) {
        console.log(`   ⏭️  相同，跳过`);
        skippedCount++;
        continue;
      }
      
      try {
        const { error: updateError } = await supabase
          .from('words')
          .update({ image_url: newImageUrl })
          .eq('id', word.id);
        
        if (updateError) {
          console.error(`   ❌ 更新失败:`, updateError.message);
          errorCount++;
        } else {
          console.log(`   ✅ 更新成功`);
          console.log(`   新URL: ${newImageUrl.substring(0, 60)}...`);
          updatedCount++;
        }
        
      } catch (error) {
        console.error(`   ❌ 异常:`, error.message);
        errorCount++;
      }
      
      // 每10个暂停一下
      if ((i + 1) % 10 === 0) {
        console.log(`\n⏸️  暂停1秒...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n' + '=' * 60);
    console.log('🎉 数据库更新完成！');
    console.log(`✅ 成功: ${updatedCount} 个`);
    console.log(`⏭️  跳过: ${skippedCount} 个`);
    console.log(`❌ 失败: ${errorCount} 个`);
    
  } catch (error) {
    console.error('❌ 更新过程出错:', error);
  }
}

// 运行更新
directSupabaseUpdate().catch(console.error); 