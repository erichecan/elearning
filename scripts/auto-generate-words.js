#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase 配置
const supabaseUrl = 'https://ljtwkkzshbrvqrxgnuin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// AI 生成的单词库（示例）
const wordDatabase = {
  Animals: [
    { text: 'giraffe', pronunciation: 'dʒɪˈræf', definition: 'A tall African mammal with a long neck' },
    { text: 'penguin', pronunciation: 'ˈpeŋɡwɪn', definition: 'A black and white bird that cannot fly' },
    { text: 'kangaroo', pronunciation: 'ˌkæŋɡəˈruː', definition: 'An Australian animal that hops' },
    { text: 'butterfly', pronunciation: 'ˈbʌtərflaɪ', definition: 'A colorful insect with wings' },
    { text: 'dolphin', pronunciation: 'ˈdɑːlfɪn', definition: 'An intelligent sea mammal' }
  ],
  Food: [
    { text: 'strawberry', pronunciation: 'ˈstrɔːberi', definition: 'A red sweet fruit' },
    { text: 'hamburger', pronunciation: 'ˈhæmbɜːrɡər', definition: 'A sandwich with meat patty' },
    { text: 'chocolate', pronunciation: 'ˈtʃɑːklət', definition: 'A sweet brown confection' },
    { text: 'noodles', pronunciation: 'ˈnuːdəlz', definition: 'Long thin strips of pasta' },
    { text: 'cookies', pronunciation: 'ˈkʊkiz', definition: 'Sweet baked treats' }
  ],
  Colors: [
    { text: 'silver', pronunciation: 'ˈsɪlvər', definition: 'A shiny grayish color' },
    { text: 'gold', pronunciation: 'ɡoʊld', definition: 'A bright yellow metallic color' },
    { text: 'turquoise', pronunciation: 'ˈtɜːrkwɔɪz', definition: 'A blue-green color' },
    { text: 'maroon', pronunciation: 'məˈruːn', definition: 'A dark red color' },
    { text: 'beige', pronunciation: 'beɪʒ', definition: 'A light brown color' }
  ]
};

// 获取 Unsplash 图片
function getImageUrl(word, category) {
  const baseUrl = 'https://images.unsplash.com/';
  const imageMap = {
    // Animals
    'giraffe': 'photo-1564760055775-d63b17a55c44',
    'penguin': 'photo-1551986782-d0169b3f8fa7',
    'kangaroo': 'photo-1544552866-d3ed42536cfd',
    'butterfly': 'photo-1444464666168-49d633b86797',
    'dolphin': 'photo-1544551763-46a013bb70d5',
    
    // Food
    'strawberry': 'photo-1543528176-61b239494933',
    'hamburger': 'photo-1568901346375-23c9450c58cd',
    'chocolate': 'photo-1511381939415-e44015466834',
    'noodles': 'photo-1555126634-323283e090fa',
    'cookies': 'photo-1558961363-fa8fdf82db35',
    
    // Colors
    'silver': 'photo-1518709268805-4e9042af2176',
    'gold': 'photo-1506905925346-21bda4d32df4',
    'turquoise': 'photo-1419242902214-272b3f66ee7a',
    'maroon': 'photo-1518709268805-4e9042af2176',
    'beige': 'photo-1506905925346-21bda4d32df4'
  };
  
  const imageId = imageMap[word] || 'photo-1481627834876-b7833e8f5570';
  return `${baseUrl}${imageId}?w=400&h=300&fit=crop`;
}

// 主函数
async function generateDailyWords() {
  console.log('🤖 开始AI自动生成每日单词...');
  
  try {
    // 获取现有分类
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');
    
    if (categoriesError) {
      throw categoriesError;
    }
    
    console.log(`📋 找到 ${categories.length} 个分类`);
    
    let totalAdded = 0;
    const targetWordsPerDay = 15; // 每天15个新单词
    
    for (const category of categories) {
      if (totalAdded >= targetWordsPerDay) break;
      
      const categoryWords = wordDatabase[category.name] || [];
      if (categoryWords.length === 0) continue;
      
      // 检查该分类已有多少单词
      const { count: existingCount } = await supabase
        .from('words')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id);
      
      console.log(`📚 ${category.name} 分类现有 ${existingCount} 个单词`);
      
      // 为每个分类添加新单词
      const wordsToAdd = Math.min(3, targetWordsPerDay - totalAdded);
      
      for (let i = 0; i < wordsToAdd && i < categoryWords.length; i++) {
        const word = categoryWords[i];
        const imageUrl = getImageUrl(word.text, category.name);
        
        const { error: insertError } = await supabase
          .from('words')
          .upsert({
            text: word.text,
            pronunciation: word.pronunciation,
            definition: word.definition,
            category_id: category.id,
            difficulty_level: 1,
            image_url: imageUrl
          }, { onConflict: 'text' });
        
        if (!insertError) {
          console.log(`✅ 添加单词: ${word.text} (${category.name})`);
          totalAdded++;
        } else {
          console.log(`⚠️  单词已存在: ${word.text}`);
        }
      }
    }
    
    console.log(`🎉 今日AI生成完成！共添加 ${totalAdded} 个新单词`);
    
  } catch (error) {
    console.error('❌ AI生成失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  generateDailyWords();
}

module.exports = { generateDailyWords }; 