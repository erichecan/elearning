#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://ljtwkkzshbrvqrxgnuin.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// AI 生成单词（模拟 OpenAI 响应）
async function generateWordsWithAI(category, count = 5) {
  // 这里可以集成真实的 AI API，比如 OpenAI GPT
  // 现在先用预定义的词库模拟
  
  const wordLibrary = {
    Animals: [
      'elephant', 'giraffe', 'zebra', 'monkey', 'tiger', 'lion', 'bear', 'wolf',
      'fox', 'deer', 'rabbit', 'squirrel', 'mouse', 'hamster', 'guinea pig',
      'parrot', 'owl', 'eagle', 'swan', 'duck', 'chicken', 'rooster', 'goose',
      'butterfly', 'bee', 'ant', 'spider', 'ladybug', 'dragonfly', 'grasshopper',
      'whale', 'dolphin', 'shark', 'octopus', 'jellyfish', 'starfish', 'crab',
      'frog', 'turtle', 'snake', 'lizard', 'crocodile', 'penguin', 'seal'
    ],
    Food: [
      'pizza', 'hamburger', 'hotdog', 'sandwich', 'salad', 'soup', 'pasta',
      'rice', 'noodles', 'bread', 'toast', 'cereal', 'yogurt', 'cheese',
      'strawberry', 'blueberry', 'raspberry', 'grape', 'watermelon', 'pineapple',
      'mango', 'kiwi', 'peach', 'plum', 'cherry', 'lemon', 'lime', 'coconut',
      'carrot', 'broccoli', 'spinach', 'tomato', 'cucumber', 'pepper', 'onion',
      'potato', 'corn', 'beans', 'peas', 'lettuce', 'mushroom', 'avocado'
    ],
    Colors: [
      'crimson', 'scarlet', 'maroon', 'burgundy', 'coral', 'salmon', 'peach',
      'navy', 'turquoise', 'cyan', 'teal', 'indigo', 'lavender', 'violet',
      'emerald', 'jade', 'lime', 'olive', 'mint', 'forest', 'sage', 'khaki',
      'amber', 'golden', 'bronze', 'copper', 'rust', 'cream', 'ivory', 'beige',
      'silver', 'platinum', 'charcoal', 'slate', 'ash', 'pearl', 'snow'
    ],
    'Body Parts': [
      'forehead', 'eyebrow', 'eyelash', 'cheek', 'chin', 'jaw', 'neck', 'shoulder',
      'elbow', 'wrist', 'finger', 'thumb', 'palm', 'knuckle', 'nail', 'chest',
      'stomach', 'back', 'waist', 'hip', 'thigh', 'knee', 'ankle', 'toe', 'heel'
    ],
    Numbers: [
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
      'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty',
      'seventy', 'eighty', 'ninety', 'hundred', 'thousand', 'million'
    ],
    Family: [
      'grandfather', 'grandmother', 'uncle', 'aunt', 'cousin', 'nephew', 'niece',
      'son', 'daughter', 'husband', 'wife', 'parent', 'sibling', 'relative',
      'family', 'stepfather', 'stepmother', 'stepson', 'stepdaughter'
    ]
  };

  const words = wordLibrary[category] || [];
  return words.slice(0, count).map(word => ({
    text: word,
    pronunciation: generatePronunciation(word),
    definition: generateDefinition(word, category)
  }));
}

// 生成音标（简化版）
function generatePronunciation(word) {
  // 这里可以集成真实的音标 API
  // 现在用简化规则
  const pronunciationMap = {
    'elephant': 'ˈelɪfənt',
    'giraffe': 'dʒɪˈræf',
    'zebra': 'ˈziːbrə',
    'monkey': 'ˈmʌŋki',
    'pizza': 'ˈpiːtsə',
    'hamburger': 'ˈhæmbɜːrɡər',
    'crimson': 'ˈkrɪmzən',
    'turquoise': 'ˈtɜːrkwɔɪz'
  };
  
  return pronunciationMap[word] || `ˈ${word}`;
}

// 生成定义
function generateDefinition(word, category) {
  const templates = {
    Animals: `A ${word} is an animal.`,
    Food: `${word.charAt(0).toUpperCase() + word.slice(1)} is a type of food.`,
    Colors: `${word.charAt(0).toUpperCase() + word.slice(1)} is a color.`,
    'Body Parts': `The ${word} is a part of the human body.`,
    Numbers: `${word.charAt(0).toUpperCase() + word.slice(1)} is a number.`,
    Family: `A ${word} is a family member.`
  };
  
  return templates[category] || `${word.charAt(0).toUpperCase() + word.slice(1)} is a word.`;
}

// 获取 Unsplash 图片
function generateImageUrl(word) {
  // 使用 Unsplash Source API 根据关键词获取图片
  return `https://source.unsplash.com/400x300/?${encodeURIComponent(word)}`;
}

// 主函数
async function runAIGenerator() {
  console.log('🤖 启动AI智能单词生成器...');
  
  try {
    // 获取所有分类
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');
      
    if (error) throw error;
    
    let totalGenerated = 0;
    const dailyTarget = 20; // 每天生成20个新单词
    
    for (const category of categories) {
      if (totalGenerated >= dailyTarget) break;
      
      console.log(`🎯 为分类 "${category.name}" 生成单词...`);
      
      // AI 生成新单词
      const newWords = await generateWordsWithAI(category.name, 5);
      
      for (const word of newWords) {
        if (totalGenerated >= dailyTarget) break;
        
        const imageUrl = generateImageUrl(word.text);
        
        // 插入到数据库
        const { error: insertError } = await supabase
          .from('words')
          .upsert({
            text: word.text,
            pronunciation: word.pronunciation,
            definition: word.definition,
            category_id: category.id,
            difficulty_level: Math.random() > 0.7 ? 2 : 1, // 30% 概率为困难
            image_url: imageUrl
          }, { onConflict: 'text' });
          
        if (!insertError) {
          console.log(`✅ 生成新单词: ${word.text} (${category.name})`);
          totalGenerated++;
        } else {
          console.log(`⚠️  单词已存在: ${word.text}`);
        }
      }
    }
    
    console.log(`🎉 AI生成完成！今日共生成 ${totalGenerated} 个新单词`);
    
    // 可选：发送通知到邮箱或微信
    await sendNotification(totalGenerated);
    
  } catch (error) {
    console.error('❌ AI生成器运行失败:', error);
  }
}

// 发送通知（可选）
async function sendNotification(count) {
  console.log(`📧 通知：今日AI自动生成了 ${count} 个新单词`);
  // 这里可以集成邮件、微信机器人等通知方式
}

// 运行
if (require.main === module) {
  runAIGenerator();
}

module.exports = { runAIGenerator, generateWordsWithAI }; 