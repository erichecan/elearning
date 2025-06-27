#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Supabase 配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://ljtwkkzshbrvqrxgnuin.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ';

// Google Gemini 配置
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error('❌ 请设置 GEMINI_API_KEY 环境变量');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

// 使用 Gemini AI 生成单词
async function generateWordsWithAI(category, count = 5) {
  try {
    console.log(`🧠 使用Gemini AI为分类 "${category}" 生成 ${count} 个新单词...`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
请为儿童英语学习应用生成 ${count} 个关于 "${category}" 的英语单词。
要求：
1. 适合6-12岁儿童学习
2. 单词不要过于复杂
3. 返回格式为JSON数组，每个对象包含：
   - text: 英语单词
   - pronunciation: IPA音标
   - definition: 简单的中文定义（适合儿童理解）
   - imageKeyword: 用于搜索图片的精确关键词（英文，确保能找到相关图片）

示例格式：
[
  {
    "text": "cat",
    "pronunciation": "kæt",
    "definition": "猫，一种可爱的宠物动物",
    "imageKeyword": "cute domestic cat pet"
  }
]

注意：imageKeyword应该是描述性的，包含多个相关词汇，确保图片搜索结果准确。

请确保返回的是有效的JSON格式，不要包含任何额外的文字说明。
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('🔍 Gemini AI 返回结果:', text);
    
    try {
      // 清理返回的文本，去除markdown代码块标记
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // 尝试解析JSON
      const words = JSON.parse(cleanText);
      
      if (!Array.isArray(words)) {
        throw new Error('返回的不是数组格式');
      }
      
      // 验证每个单词对象的格式
      const validWords = words.filter(word => 
        word.text && 
        word.pronunciation && 
        word.definition &&
        word.imageKeyword
      );
      
      console.log(`✅ 成功解析 ${validWords.length} 个单词`);
      return validWords;
      
    } catch (parseError) {
      console.error('❌ JSON解析失败:', parseError.message);
      console.log('原始响应:', text);
      
      // 如果JSON解析失败，返回空数组
      return [];
    }
    
  } catch (error) {
    console.error('❌ Gemini AI 调用失败:', error.message);
    
    // 如果AI调用失败，使用备用词库
    console.log('🔄 使用备用词库...');
    return generateFallbackWords(category, count);
  }
}

// 备用词库（当AI调用失败时使用）
function generateFallbackWords(category, count = 5) {
  const wordLibrary = {
    Animals: [
      { text: 'elephant', pronunciation: 'ˈelɪfənt', definition: '大象，一种大型哺乳动物' },
      { text: 'giraffe', pronunciation: 'dʒɪˈræf', definition: '长颈鹿，脖子很长的动物' },
      { text: 'zebra', pronunciation: 'ˈziːbrə', definition: '斑马，有黑白条纹的动物' },
      { text: 'monkey', pronunciation: 'ˈmʌŋki', definition: '猴子，喜欢爬树的动物' },
      { text: 'tiger', pronunciation: 'ˈtaɪɡər', definition: '老虎，强壮的大型猫科动物' },
      { text: 'lion', pronunciation: 'ˈlaɪən', definition: '狮子，森林之王' },
      { text: 'bear', pronunciation: 'ber', definition: '熊，毛茸茸的大型动物' },
      { text: 'wolf', pronunciation: 'wʊlf', definition: '狼，野生的犬科动物' }
    ],
    Food: [
      { text: 'pizza', pronunciation: 'ˈpiːtsə', definition: '披萨，意大利美食' },
      { text: 'hamburger', pronunciation: 'ˈhæmbɜːrɡər', definition: '汉堡包，夹肉的面包' },
      { text: 'hotdog', pronunciation: 'ˈhɒtdɒɡ', definition: '热狗，香肠面包' },
      { text: 'sandwich', pronunciation: 'ˈsænwɪtʃ', definition: '三明治，夹心面包' },
      { text: 'salad', pronunciation: 'ˈsæləd', definition: '沙拉，蔬菜混合食品' },
      { text: 'soup', pronunciation: 'suːp', definition: '汤，液体食物' },
      { text: 'pasta', pronunciation: 'ˈpæstə', definition: '意大利面，面条类食物' },
      { text: 'rice', pronunciation: 'raɪs', definition: '米饭，主食' }
    ],
    Colors: [
      { text: 'crimson', pronunciation: 'ˈkrɪmzən', definition: '深红色，鲜艳的红色' },
      { text: 'turquoise', pronunciation: 'ˈtɜːrkwɔɪz', definition: '青绿色，像海水的颜色' },
      { text: 'lavender', pronunciation: 'ˈlævəndər', definition: '薰衣草紫，淡紫色' },
      { text: 'emerald', pronunciation: 'ˈemərəld', definition: '翡翠绿，宝石绿色' },
      { text: 'amber', pronunciation: 'ˈæmbər', definition: '琥珀色，黄褐色' },
      { text: 'coral', pronunciation: 'ˈkɔːrəl', definition: '珊瑚色，橙粉色' },
      { text: 'navy', pronunciation: 'ˈneɪvi', definition: '海军蓝，深蓝色' },
      { text: 'ivory', pronunciation: 'ˈaɪvəri', definition: '象牙色，乳白色' }
    ],
    'Body Parts': [
      { text: 'forehead', pronunciation: 'ˈfɔːrhɛd', definition: '额头，脸的上部' },
      { text: 'eyebrow', pronunciation: 'ˈaɪbraʊ', definition: '眉毛，眼睛上方的毛发' },
      { text: 'cheek', pronunciation: 'tʃiːk', definition: '脸颊，脸的侧面' },
      { text: 'shoulder', pronunciation: 'ˈʃoʊldər', definition: '肩膀，手臂连接身体的部位' },
      { text: 'elbow', pronunciation: 'ˈelboʊ', definition: '肘部，手臂弯曲的地方' },
      { text: 'wrist', pronunciation: 'rɪst', definition: '手腕，手和前臂连接的部位' },
      { text: 'ankle', pronunciation: 'ˈæŋkəl', definition: '脚踝，脚和小腿连接的部位' },
      { text: 'thumb', pronunciation: 'θʌm', definition: '拇指，手的第一个手指' }
    ],
    Numbers: [
      { text: 'eleven', pronunciation: 'ɪˈlevən', definition: '十一，数字11' },
      { text: 'twelve', pronunciation: 'twelv', definition: '十二，数字12' },
      { text: 'thirteen', pronunciation: 'ˈθɜːrˈtiːn', definition: '十三，数字13' },
      { text: 'twenty', pronunciation: 'ˈtwenti', definition: '二十，数字20' },
      { text: 'thirty', pronunciation: 'ˈθɜːrti', definition: '三十，数字30' },
      { text: 'forty', pronunciation: 'ˈfɔːrti', definition: '四十，数字40' },
      { text: 'fifty', pronunciation: 'ˈfɪfti', definition: '五十，数字50' },
      { text: 'hundred', pronunciation: 'ˈhʌndrəd', definition: '一百，数字100' }
    ],
    Family: [
      { text: 'grandfather', pronunciation: 'ˈɡrænfɑːðər', definition: '爷爷/外公，父亲或母亲的父亲' },
      { text: 'grandmother', pronunciation: 'ˈɡrænmʌðər', definition: '奶奶/外婆，父亲或母亲的母亲' },
      { text: 'uncle', pronunciation: 'ˈʌŋkəl', definition: '叔叔/舅舅，父母的兄弟' },
      { text: 'aunt', pronunciation: 'ænt', definition: '阿姨/姨妈，父母的姐妹' },
      { text: 'cousin', pronunciation: 'ˈkʌzən', definition: '表兄弟姐妹，叔叔阿姨的孩子' },
      { text: 'nephew', pronunciation: 'ˈnefjuː', definition: '侄子/外甥，兄弟姐妹的儿子' },
      { text: 'niece', pronunciation: 'niːs', definition: '侄女/外甥女，兄弟姐妹的女儿' },
      { text: 'sibling', pronunciation: 'ˈsɪblɪŋ', definition: '兄弟姐妹，同父母的孩子' }
    ]
  };

  const words = wordLibrary[category] || [];
  return words.slice(0, count);
}

// 智能图片服务
const SmartImageService = require('./smart-image-service');

// 获取智能匹配的图片
function generateImageUrl(wordText, imageKeyword = null, category = null) {
  const imageService = new SmartImageService();
  
  // 优先使用AI生成的精确关键词，否则使用单词本身
  const searchTerm = imageKeyword || wordText;
  
  // 使用智能图片服务获取匹配的图片
  return imageService.getImageUrl(searchTerm, category);
}

// 主函数
async function runAIGenerator() {
  console.log('🤖 启动Gemini AI智能单词生成器...');
  
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
      
      // 使用 Gemini AI 生成新单词
      const newWords = await generateWordsWithAI(category.name, 5);
      
      for (const word of newWords) {
        if (totalGenerated >= dailyTarget) break;
        
        const imageUrl = generateImageUrl(word.text, word.imageKeyword, category.name);
        
        // 检查单词是否已存在
        const { data: existingWords } = await supabase
          .from('words')
          .select('text')
          .eq('text', word.text);
          
        if (existingWords && existingWords.length > 0) {
          console.log(`⚠️  单词已存在: ${word.text}`);
          continue;
        }
        
        // 插入到数据库
        const { error: insertError } = await supabase
          .from('words')
          .insert({
            text: word.text,
            pronunciation: word.pronunciation,
            definition: word.definition,
            category_id: category.id,
            difficulty_level: Math.random() > 0.7 ? 2 : 1, // 30% 概率为困难
            image_url: imageUrl
          });
          
        if (!insertError) {
          console.log(`✅ 生成新单词: ${word.text} (${category.name})`);
          totalGenerated++;
        } else {
          console.error(`❌ 插入失败: ${word.text}`, insertError);
        }
      }
    }
    
    console.log(`🎉 Gemini AI生成完成！今日共生成 ${totalGenerated} 个新单词`);
    
    // 可选：发送通知到邮箱或微信
    await sendNotification(totalGenerated);
    
  } catch (error) {
    console.error('❌ Gemini AI生成器运行失败:', error);
  }
}

// 发送通知（可选）
async function sendNotification(count) {
  console.log(`📧 通知：今日Gemini AI自动生成了 ${count} 个新单词`);
  // 这里可以集成邮件、微信机器人等通知方式
}

// 运行
if (require.main === module) {
  runAIGenerator();
}

module.exports = { runAIGenerator, generateWordsWithAI }; 