#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Supabase 配置
const supabaseUrl = 'https://ljtwkkzshbrvqrxgnuin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ';

// Google Gemini 配置  
const geminiApiKey = 'AIzaSyBuDTCY-fWr0q960jnSRoj9_RF9WwuwKQg';

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

// 使用AI验证和修复单词信息
async function validateWordWithAI(word, categoryName) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
请检查这个英语单词的信息是否准确，并为它提供最佳的图片搜索关键词：

单词: ${word.text}
分类: ${categoryName}
现有发音: ${word.pronunciation || '无'}
现有定义: ${word.definition || '无'}
难度等级: ${word.difficulty_level || 1}

请返回JSON格式的结果：
{
  "isCorrect": true/false,
  "text": "正确的单词拼写",
  "pronunciation": "正确的IPA发音（如：/kæt/）",
  "definition": "适合6-12岁儿童的简单英文定义",
  "difficulty_level": 1或2（1=简单，2=中等），
  "imageKeywords": "最佳的图片搜索关键词（英文，用于获取清晰准确的图片）",
  "corrections": "如有错误，说明修正了什么"
}

要求：
1. 确保单词属于指定分类
2. 发音使用标准IPA格式
3. 定义要简单易懂，适合儿童
4. 图片关键词要准确，能找到清晰的相关图片
5. 如果单词不合适，建议替换`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // 清理响应文本，移除可能的markdown代码块标记
    const cleanedResponse = responseText
      .replace(/```json\s*\n?/g, '')
      .replace(/```\s*\n?/g, '')
      .replace(/^\s*\n/gm, '')
      .trim();
    
    try {
      const validation = JSON.parse(cleanedResponse);
      return validation;
    } catch (parseError) {
      console.log('AI响应:', cleanedResponse);
      throw new Error(`JSON解析失败: ${parseError.message}`);
    }
    
  } catch (error) {
    console.error(`AI验证失败 - ${word.text}:`, error);
    return null;
  }
}

// 生成优化的图片URL
function generateOptimizedImageUrl(word, imageKeywords) {
  // 使用AI提供的关键词或单词本身
  const searchTerm = imageKeywords || word;
  
  // 使用多个图片源以确保可用性
  const imageSources = [
    `https://source.unsplash.com/400x300/?${encodeURIComponent(searchTerm)}`,
    `https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&q=80&auto=format&bg=${encodeURIComponent(searchTerm)}`
  ];
  
  return imageSources[0]; // 优先使用第一个源
}

// 检查图片URL是否有效
async function checkImageValidity(imageUrl) {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch (error) {
    return false;
  }
}

// 主要的校对函数
async function validateAndFixDatabase() {
  console.log('🤖 开始AI智能校对数据库...');
  
  try {
    // 获取所有分类和对应的单词
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        words (
          id,
          text,
          pronunciation,
          definition,
          difficulty_level,
          image_url
        )
      `);
    
    if (categoriesError) throw categoriesError;
    
    console.log(`📚 找到 ${categories.length} 个分类`);
    
    let totalChecked = 0;
    let totalFixed = 0;
    let imageIssues = 0;
    
    for (const category of categories) {
      console.log(`\n🎯 检查分类: ${category.name}`);
      
      if (!category.words || category.words.length === 0) {
        console.log(`⚠️  分类 ${category.name} 没有单词，跳过`);
        continue;
      }
      
      for (const word of category.words) {
        totalChecked++;
        console.log(`\n📝 检查单词: ${word.text}`);
        
        // 使用AI验证单词
        const validation = await validateWordWithAI(word, category.name);
        
        if (!validation) {
          console.log(`❌ AI验证失败: ${word.text}`);
          continue;
        }
        
        let needsUpdate = false;
        const updates = {};
        
        // 检查是否需要更新
        if (validation.text !== word.text) {
          updates.text = validation.text;
          needsUpdate = true;
          console.log(`🔧 修正单词拼写: ${word.text} → ${validation.text}`);
        }
        
        if (validation.pronunciation !== word.pronunciation) {
          updates.pronunciation = validation.pronunciation;
          needsUpdate = true;
          console.log(`🔧 修正发音: ${word.pronunciation || '无'} → ${validation.pronunciation}`);
        }
        
        if (validation.definition !== word.definition) {
          updates.definition = validation.definition;
          needsUpdate = true;
          console.log(`🔧 修正定义: ${word.definition || '无'} → ${validation.definition}`);
        }
        
        if (validation.difficulty_level !== word.difficulty_level) {
          updates.difficulty_level = validation.difficulty_level;
          needsUpdate = true;
          console.log(`🔧 修正难度: ${word.difficulty_level} → ${validation.difficulty_level}`);
        }
        
        // 检查并修复图片URL
        const currentImageValid = await checkImageValidity(word.image_url);
        if (!currentImageValid || !word.image_url) {
          const newImageUrl = generateOptimizedImageUrl(validation.text, validation.imageKeywords);
          updates.image_url = newImageUrl;
          needsUpdate = true;
          imageIssues++;
          console.log(`🖼️  修复图片URL: ${word.image_url} → ${newImageUrl}`);
          console.log(`🎨 使用关键词: ${validation.imageKeywords}`);
        }
        
        // 执行更新
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('words')
            .update(updates)
            .eq('id', word.id);
          
          if (updateError) {
            console.error(`❌ 更新失败: ${word.text}`, updateError);
          } else {
            totalFixed++;
            console.log(`✅ 成功更新: ${word.text}`);
            if (validation.corrections) {
              console.log(`📋 修正说明: ${validation.corrections}`);
            }
          }
        } else {
          console.log(`✅ 单词正确: ${word.text}`);
        }
        
        // 添加延迟以避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n🎉 AI校对完成！');
    console.log(`📊 统计信息:`);
    console.log(`   - 检查单词总数: ${totalChecked}`);
    console.log(`   - 修复单词数量: ${totalFixed}`);
    console.log(`   - 图片问题修复: ${imageIssues}`);
    
  } catch (error) {
    console.error('❌ 校对过程中出错:', error);
  }
}

// 运行校对器
if (require.main === module) {
  validateAndFixDatabase()
    .then(() => {
      console.log('\n🚀 AI校对器运行完成！');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 校对器运行失败:', error);
      process.exit(1);
    });
}

module.exports = { validateAndFixDatabase, validateWordWithAI }; 