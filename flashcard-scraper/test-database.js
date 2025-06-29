const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testDatabaseConnection() {
    console.log('🔍 测试数据库连接...');
    
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ 环境变量未设置');
        console.log('📝 请复制 env.example 为 .env 并填入您的Supabase配置:');
        console.log('   SUPABASE_URL=your_supabase_project_url');
        console.log('   SUPABASE_ANON_KEY=your_supabase_anon_key');
        process.exit(1);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
        // 测试连接 - 获取分类列表
        console.log('📊 测试分类表查询...');
        const { data: categories, error: categoriesError } = await supabase
            .from('categories')
            .select('id, name, display_name')
            .limit(5);
            
        if (categoriesError) {
            console.error('❌ 分类表查询失败:', categoriesError.message);
            return false;
        }
        
        console.log('✅ 分类表连接成功');
        console.log('📋 前5个分类:');
        categories.forEach(cat => {
            console.log(`  - ${cat.name}: ${cat.display_name} (ID: ${cat.id})`);
        });
        
        // 测试单词表
        console.log('\n📝 测试单词表查询...');
        const { data: words, error: wordsError } = await supabase
            .from('words')
            .select('id, word, chinese, category_id')
            .limit(3);
            
        if (wordsError) {
            console.error('❌ 单词表查询失败:', wordsError.message);
            return false;
        }
        
        console.log('✅ 单词表连接成功');
        console.log(`📚 当前有 ${words.length} 个示例单词`);
        words.forEach(word => {
            console.log(`  - ${word.word} (${word.chinese}) [分类ID: ${word.category_id}]`);
        });
        
        // 测试插入权限 - 插入一个测试记录然后删除
        console.log('\n🧪 测试插入权限...');
        const testWord = {
            word: 'test_' + Date.now(),
            chinese: '测试',
            category_id: categories[0].id,
            difficulty_level: 1,
            is_active: false // 标记为测试数据
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('words')
            .insert(testWord)
            .select();
            
        if (insertError) {
            console.error('❌ 插入权限测试失败:', insertError.message);
            return false;
        }
        
        console.log('✅ 插入权限正常');
        
        // 删除测试记录
        const { error: deleteError } = await supabase
            .from('words')
            .delete()
            .eq('id', insertData[0].id);
            
        if (deleteError) {
            console.log('⚠️ 删除测试记录失败，请手动清理:', deleteError.message);
        } else {
            console.log('✅ 测试记录已清理');
        }
        
        console.log('\n🎉 数据库连接测试完成！所有功能正常');
        return true;
        
    } catch (error) {
        console.error('❌ 数据库连接测试失败:', error.message);
        return false;
    }
}

// 运行测试
(async () => {
    const success = await testDatabaseConnection();
    process.exit(success ? 0 : 1);
})(); 