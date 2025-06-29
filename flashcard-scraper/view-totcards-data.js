const LocalDatabase = require('./local-database');

console.log('📁 查看TotCards数据库...\n');

const db = new LocalDatabase('./totcards-flashcards.db');

try {
    // 获取统计信息
    const stats = db.getStats();
    const categoryStats = db.getCategoryStats();
    
    console.log('📊 TotCards数据库统计:');
    console.log(`   总词汇数: ${stats.words}`);
    console.log(`   分类数: ${stats.categories}\n`);
    
    console.log('📋 各分类详情:');
    categoryStats.forEach((stat, index) => {
        console.log(`   ${index + 1}. ${stat.display_name}: ${stat.word_count} 个单词`);
    });
    
    // 显示所有单词
    const words = db.getAllWords();
    
    console.log('\n📝 所有单词列表:');
    console.log('-'.repeat(60));
    
    let currentCategory = '';
    words.forEach((word) => {
        if (word.category_display_name !== currentCategory) {
            currentCategory = word.category_display_name;
            console.log(`\n📂 ${currentCategory}:`);
        }
        console.log(`  • ${word.word} (${word.chinese || 'No Chinese'})`);
        console.log(`    图片: ${word.image_url}`);
    });
    
} catch (error) {
    console.error('❌ 错误:', error.message);
} finally {
    db.close();
} 