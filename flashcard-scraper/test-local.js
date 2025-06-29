const LocalDatabase = require('./local-database');

async function testLocalDatabase() {
    console.log('🧪 测试本地数据库功能...\n');
    
    try {
        // 创建数据库实例
        const db = new LocalDatabase('./test-flashcards.db');
        
        // 测试1: 检查分类
        console.log('✅ 测试1: 检查分类');
        const categories = db.getAllCategories();
        console.log(`   找到 ${categories.length} 个分类:`);
        categories.forEach(cat => {
            console.log(`   - ${cat.display_name} (${cat.name}) ${cat.icon}`);
        });
        
        // 测试2: 插入测试单词
        console.log('\n✅ 测试2: 插入测试单词');
        const animalsCategory = db.getCategory('animals');
        const testWords = [
            {
                word: 'cat',
                chinese: '猫',
                image_url: 'https://example.com/cat.jpg',
                category_id: animalsCategory.id,
                difficulty_level: 1,
                is_active: true
            },
            {
                word: 'dog',
                chinese: '狗',
                image_url: 'https://example.com/dog.jpg',
                category_id: animalsCategory.id,
                difficulty_level: 1,
                is_active: true
            },
            {
                word: 'elephant',
                chinese: '大象',
                image_url: 'https://example.com/elephant.jpg',
                category_id: animalsCategory.id,
                difficulty_level: 2,
                is_active: true
            }
        ];
        
        for (const wordData of testWords) {
            const result = db.insertWord(wordData);
            if (result.success) {
                console.log(`   ✅ 插入成功: ${wordData.word} (ID: ${result.id})`);
            } else {
                console.log(`   ❌ 插入失败: ${wordData.word} - ${result.error}`);
            }
        }
        
        // 测试3: 检查重复插入
        console.log('\n✅ 测试3: 检查重复插入');
        const duplicateResult = db.insertWord(testWords[0]); // 重复插入cat
        console.log(`   重复插入结果: ${duplicateResult.success ? '成功' : '失败'} - ${duplicateResult.error || '无错误'}`);
        
        // 测试4: 查询单词
        console.log('\n✅ 测试4: 查询单词');
        const exists = db.wordExists('cat', animalsCategory.id);
        console.log(`   单词 'cat' 是否存在: ${exists}`);
        
        // 测试5: 获取统计信息
        console.log('\n✅ 测试5: 获取统计信息');
        const stats = db.getStats();
        console.log(`   总词汇数: ${stats.totalWords}`);
        console.log(`   总分类数: ${stats.totalCategories}`);
        console.log('   各分类统计:');
        stats.categoryStats.forEach(stat => {
            console.log(`     ${stat.display_name}: ${stat.word_count} 个单词`);
        });
        
        // 测试6: 获取所有单词
        console.log('\n✅ 测试6: 获取所有单词');
        const allWords = db.getAllWords(10);
        console.log(`   获取到 ${allWords.length} 个单词:`);
        allWords.forEach(word => {
            console.log(`     ${word.word} (${word.category_display_name}) - ${word.image_url}`);
        });
        
        // 测试7: 导出数据
        console.log('\n✅ 测试7: 导出数据');
        const exportData = db.exportToJson('./test-export.json');
        console.log(`   导出了 ${exportData.categories.length} 个分类，${exportData.words.length} 个单词`);
        
        // 清理
        db.close();
        console.log('\n🎉 所有测试完成！');
        
        // 删除测试文件
        const fs = require('fs-extra');
        if (fs.existsSync('./test-flashcards.db')) {
            fs.removeSync('./test-flashcards.db');
            console.log('🧹 测试数据库文件已清理');
        }
        if (fs.existsSync('./test-export.json')) {
            fs.removeSync('./test-export.json');
            console.log('🧹 测试导出文件已清理');
        }
        
    } catch (error) {
        console.error('❌ 测试失败:', error);
    }
}

// 运行测试
if (require.main === module) {
    testLocalDatabase();
}

module.exports = testLocalDatabase; 