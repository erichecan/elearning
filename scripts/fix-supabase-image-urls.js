#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase 配置
const supabaseUrl = 'https://ljtwkkzshbrvqrxgnuin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixImageUrls() {
  console.log('🔧 开始修复Supabase中的图片URL...');
  
  try {
    // 获取所有单词数据
    const { data: words, error: fetchError } = await supabase
      .from('words')
      .select('id, text, image_url');
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`📊 找到 ${words.length} 个单词记录`);
    
    let fixedCount = 0;
    let errorCount = 0;
    
    for (const word of words) {
      const { id, text, image_url } = word;
      
      // 检查是否需要修复
      if (image_url && image_url.includes('via.placeholder.com')) {
        // 生成正确的图片URL
        const newImageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(text)}`;
        
        // 更新数据库
        const { error: updateError } = await supabase
          .from('words')
          .update({ image_url: newImageUrl })
          .eq('id', id);
        
        if (updateError) {
          console.error(`❌ 更新失败: ${text} -`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ 修复: ${text} -> ${newImageUrl}`);
          fixedCount++;
        }
      } else if (image_url && image_url.includes('https://images.unsplash.com/400x300/')) {
        // 修复错误的Unsplash URL格式
        const newImageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(text)}`;
        
        // 更新数据库
        const { error: updateError } = await supabase
          .from('words')
          .update({ image_url: newImageUrl })
          .eq('id', id);
        
        if (updateError) {
          console.error(`❌ 更新失败: ${text} -`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ 修复URL格式: ${text} -> ${newImageUrl}`);
          fixedCount++;
        }
      } else if (!image_url || image_url.trim() === '') {
        // 为没有图片URL的单词生成URL
        const newImageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(text)}`;
        
        // 更新数据库
        const { error: updateError } = await supabase
          .from('words')
          .update({ image_url: newImageUrl })
          .eq('id', id);
        
        if (updateError) {
          console.error(`❌ 更新失败: ${text} -`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ 添加图片URL: ${text} -> ${newImageUrl}`);
          fixedCount++;
        }
      }
    }
    
    console.log(`\n🎉 修复完成！`);
    console.log(`  ✅ 成功修复: ${fixedCount} 个`);
    console.log(`  ❌ 修复失败: ${errorCount} 个`);
    
  } catch (error) {
    console.error('❌ 修复过程中出错:', error.message);
  }
}

async function validateImageUrls() {
  console.log('\n🔍 验证图片URL格式...');
  
  try {
    // 获取所有单词数据
    const { data: words, error: fetchError } = await supabase
      .from('words')
      .select('text, image_url');
    
    if (fetchError) {
      throw fetchError;
    }
    
    let correctCount = 0;
    let wrongCount = 0;
    
    for (const word of words) {
      const { text, image_url } = word;
      
      if (image_url && image_url.startsWith('https://source.unsplash.com/400x300/?')) {
        correctCount++;
      } else {
        wrongCount++;
        console.log(`⚠️  错误格式: ${text} -> ${image_url}`);
      }
    }
    
    console.log(`\n📊 验证结果:`);
    console.log(`  ✅ 正确格式: ${correctCount} 个`);
    console.log(`  ❌ 错误格式: ${wrongCount} 个`);
    
  } catch (error) {
    console.error('❌ 验证过程中出错:', error.message);
  }
}

async function main() {
  console.log('🚀 Supabase图片URL修复工具');
  console.log('=' * 40);
  
  // 修复图片URL
  await fixImageUrls();
  
  // 验证修复结果
  await validateImageUrls();
  
  console.log('\n✨ 完成！现在图片应该可以正常加载了。');
}

if (require.main === module) {
  main().catch(console.error);
} 