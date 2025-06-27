#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase 配置
const supabaseUrl = 'https://ljtwkkzshbrvqrxgnuin.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqdHdra3pzaGJydnFyeGdudWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTE1NTMsImV4cCI6MjA2NjYyNzU1M30.szRhJOeWhTIh1TFnuSyeJ5sh2A8sOHKTPGpwizlZCcQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// 为单词生成固定的图片ID
function generateImageId(word) {
  const wordHash = word.split('').reduce((hash, char) => {
    return char.charCodeAt(0) + ((hash << 5) - hash);
  }, 0);
  return Math.abs(wordHash) % 1000; // 生成0-999的图片ID
}

async function updateToPicsumPhotos() {
  console.log('🔄 将所有图片URL更新为稳定的Picsum Photos...');
  
  try {
    // 获取所有单词数据
    const { data: words, error: fetchError } = await supabase
      .from('words')
      .select('id, text, image_url');
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`📊 找到 ${words.length} 个单词记录`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    for (const word of words) {
      const { id, text, image_url } = word;
      
      // 检查是否需要更新（如果是Unsplash URL或占位符）
      const needsUpdate = !image_url || 
                         image_url.includes('source.unsplash.com') ||
                         image_url.includes('via.placeholder.com') ||
                         image_url.includes('images.unsplash.com/400x300');
      
      if (needsUpdate) {
        // 生成新的Picsum Photos URL
        const imageId = generateImageId(text);
        const newImageUrl = `https://picsum.photos/400/300?random=${imageId}`;
        
        // 更新数据库
        const { error: updateError } = await supabase
          .from('words')
          .update({ image_url: newImageUrl })
          .eq('id', id);
        
        if (updateError) {
          console.error(`❌ 更新失败: ${text} -`, updateError.message);
          errorCount++;
        } else {
          console.log(`✅ 更新: ${text} -> Picsum ID ${imageId}`);
          updatedCount++;
        }
      } else {
        console.log(`⏭️  跳过: ${text} (已有有效图片)`);
      }
    }
    
    console.log(`\n🎉 更新完成！`);
    console.log(`  ✅ 成功更新: ${updatedCount} 个`);
    console.log(`  ❌ 更新失败: ${errorCount} 个`);
    console.log(`  ⏭️  无需更新: ${words.length - updatedCount - errorCount} 个`);
    
  } catch (error) {
    console.error('❌ 更新过程中出错:', error.message);
  }
}

async function testPicsumUrls() {
  console.log('\n🧪 测试Picsum URLs的可用性...');
  
  const testWords = ['cat', 'dog', 'bird', 'apple', 'red'];
  
  for (const word of testWords) {
    const imageId = generateImageId(word);
    const url = `https://picsum.photos/400/300?random=${imageId}`;
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        console.log(`✅ ${word} (ID: ${imageId}) - 图片可用`);
      } else {
        console.log(`❌ ${word} (ID: ${imageId}) - 状态: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${word} (ID: ${imageId}) - 错误: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🚀 Picsum Photos 图片源更新工具');
  console.log('=' * 50);
  
  // 测试Picsum URLs
  await testPicsumUrls();
  
  // 更新所有图片URL
  await updateToPicsumPhotos();
  
  console.log('\n✨ 完成！现在所有图片都使用稳定的Picsum Photos服务。');
  console.log('💡 Picsum Photos提供高质量的免费图片，无需API密钥。');
}

if (require.main === module) {
  main().catch(console.error);
} 