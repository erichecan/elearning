// 智能图片服务 - 为单词提供语义匹配的图片
class SmartImageService {
  constructor() {
    // 精选图片映射表 - 手工挑选的高质量图片
    this.imageMap = {
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
      
      // 颜色类 - 使用色块
      'red': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format',
      'blue': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop&auto=format',
      'green': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format',
      'yellow': 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=400&h=300&fit=crop&auto=format',
      
      // 数字类 - 使用创意数字图片
      'one': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop&auto=format',
      'two': 'https://images.unsplash.com/photo-1635070040713-f25b0db2a5d6?w=400&h=300&fit=crop&auto=format',
      'three': 'https://images.unsplash.com/photo-1635070040847-b18c7a73d47e?w=400&h=300&fit=crop&auto=format',
      
      // 家庭类
      'family': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400&h=300&fit=crop&auto=format',
      'mother': 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=300&fit=crop&auto=format',
      'father': 'https://images.unsplash.com/photo-1490592696254-9f666ba04b1e?w=400&h=300&fit=crop&auto=format',
    };
    
    // 分类对应的备用SVG图标
    this.categoryIcons = {
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
  }
  
  // 获取单词对应的图片URL
  getImageUrl(word, category = null) {
    const cleanWord = word.toLowerCase().trim();
    
    // 1. 首先检查精选图片映射
    if (this.imageMap[cleanWord]) {
      console.log(`✅ 使用精选图片: ${cleanWord}`);
      return this.imageMap[cleanWord];
    }
    
    // 2. 尝试使用Pexels API (如果有API key)
    const pexelsUrl = this.getPexelsImageUrl(cleanWord);
    if (pexelsUrl) {
      return pexelsUrl;
    }
    
    // 3. 生成高质量的SVG图片
    console.log(`🎨 生成SVG图片: ${cleanWord}`);
    return this.generateWordSVG(cleanWord, category);
  }
  
  // Pexels API图片 (需要API key)
  getPexelsImageUrl(word) {
    // 这里可以集成Pexels API
    // 现在返回null，使用SVG备用方案
    return null;
  }
  
  // 生成单词的精美SVG图片
  generateWordSVG(word, category = null) {
    const icon = category ? this.categoryIcons[category] || '📚' : '📚';
    const uniqueId = `word-${Math.random().toString(36).substr(2, 9)}`;
    
    // 根据单词长度选择颜色方案
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
  
  // 批量更新单词图片URL
  async batchUpdateImages(supabase) {
    console.log('🔄 批量更新单词图片URL...');
    
    try {
      const { data: words, error } = await supabase
        .from('words')
        .select('id, text, category_id, categories(name)');
      
      if (error) throw error;
      
      let updatedCount = 0;
      
      for (const word of words) {
        const categoryName = word.categories?.name;
        const newImageUrl = this.getImageUrl(word.text, categoryName);
        
        const { error: updateError } = await supabase
          .from('words')
          .update({ image_url: newImageUrl })
          .eq('id', word.id);
        
        if (!updateError) {
          console.log(`✅ 更新图片: ${word.text}`);
          updatedCount++;
        }
      }
      
      console.log(`🎉 批量更新完成: ${updatedCount} 个单词`);
      return updatedCount;
      
    } catch (error) {
      console.error('❌ 批量更新失败:', error);
      return 0;
    }
  }
}

module.exports = SmartImageService; 