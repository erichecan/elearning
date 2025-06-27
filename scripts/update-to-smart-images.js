const { createClient } = require('@supabase/supabase-js');
const SmartImageService = require('./smart-image-service');

// Supabase配置
const supabaseUrl = process.env.SUPABASE_URL || 'https://zrgbqwbrsyjbkcrmbgrs.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZ2Jxd2Jyc3lqYmtjcm1iZ3JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0ODcwMzQsImV4cCI6MjA0NzA2MzAzNH0.a4Xp98X97t3S1vl8iV4AUO_lUhVY3VG-K8gnXGZSP7o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateToSmartImages() {
  console.log('🔄 开始批量更新单词图片为智能图片服务...');
  console.log('=' * 60);
  
  const imageService = new SmartImageService();
  
  try {
    // 获取所有单词数据
    console.log('📊 获取单词数据...');
    const { data: words, error } = await supabase
      .from('words')
      .select(`
        id, 
        text, 
        category_id,
        image_url,
        categories(name)
      `);
    
    if (error) {
      console.error('❌ 获取单词失败:', error);
      return;
    }
    
    console.log(`📝 找到 ${words.length} 个单词需要更新`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const categoryName = word.categories?.name;
      
      console.log(`\n📸 [${i + 1}/${words.length}] 处理单词: ${word.text} (${categoryName})`);
      console.log(`   当前URL: ${word.image_url?.substring(0, 60)}...`);
      
      // 生成新的智能图片URL
      const newImageUrl = imageService.getImageUrl(word.text, categoryName);
      
      // 如果URL相同则跳过
      if (word.image_url === newImageUrl) {
        console.log(`   ⏭️  URL相同，跳过`);
        skippedCount++;
        continue;
      }
      
      try {
        // 更新数据库
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
        console.error(`   ❌ 更新异常:`, error.message);
        errorCount++;
      }
      
      // 每处理10个单词暂停一下，避免请求过快
      if ((i + 1) % 10 === 0) {
        console.log(`\n⏸️  已处理 ${i + 1} 个单词，暂停1秒...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('\n' + '=' * 60);
    console.log('🎉 批量更新完成！');
    console.log(`✅ 成功更新: ${updatedCount} 个`);
    console.log(`⏭️  跳过相同: ${skippedCount} 个`);
    console.log(`❌ 更新失败: ${errorCount} 个`);
    console.log(`📊 总计处理: ${words.length} 个单词`);
    
    // 验证更新结果
    console.log('\n🔍 验证更新结果...');
    const { data: updatedWords, error: verifyError } = await supabase
      .from('words')
      .select('text, image_url')
      .limit(5);
    
    if (!verifyError && updatedWords) {
      console.log('📋 前5个单词的图片URL预览:');
      updatedWords.forEach((word, index) => {
        console.log(`   ${index + 1}. ${word.text}: ${word.image_url?.substring(0, 80)}...`);
      });
    }
    
  } catch (error) {
    console.error('❌ 批量更新过程出错:', error);
  }
}

// 运行脚本
if (require.main === module) {
  updateToSmartImages().catch(console.error);
}

module.exports = { updateToSmartImages }; 