const LocalDatabase = require('./local-database');
const fs = require('fs-extra');
const path = require('path');

async function generateEmojiFlashcardsMigration() {
    console.log('🏗️ 生成EmojiFlashcards迁移文件...\n');

    const db = new LocalDatabase('./emojiflashcards.db');

    try {
        const words = db.getAllWords();
        
        console.log(`📊 找到 ${words.length} 个单词，开始生成迁移文件...`);
        
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '').slice(0, 12);
        const filename = `20250629_${timestamp}_import_emojiflashcards.sql`;
        const supabaseMigrationPath = path.join('..', 'supabase', 'migrations', filename);
        
        let sql = '';
        sql += '-- EmojiFlashcards数据导入\n';
        sql += `-- 导入时间: ${new Date().toISOString()}\n`;
        sql += '-- 来源: emojiflashcards.com\n';
        sql += '-- 包含: 384个单词 (动物、食物、颜色、数字、字母、服装、交通、家庭、天气)\n\n';
        
        console.log('📋 开始处理单词数据...');
        
        // 按分类组织单词
        const wordsByCategory = {};
        words.forEach(word => {
            const categoryKey = word.category_name;
            if (!wordsByCategory[categoryKey]) {
                wordsByCategory[categoryKey] = [];
            }
            wordsByCategory[categoryKey].push(word);
        });
        
        // 为每个分类生成SQL
        Object.keys(wordsByCategory).forEach(categoryKey => {
            const categoryWords = wordsByCategory[categoryKey];
            
            if (categoryWords.length === 0) return;
            
            sql += `-- ${categoryWords[0].category_display_name} (${categoryWords.length} 个单词)\n`;
            
            categoryWords.forEach(word => {
                const wordName = word.word.replace(/'/g, "''");
                const chineseName = (word.chinese || '').replace(/'/g, "''");
                const imageUrl = (word.image_url || '').replace(/'/g, "''");
                
                sql += `INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)\n`;
                sql += `SELECT '${wordName}', '${chineseName}', '${imageUrl}', c.id, ${word.difficulty_level || 1}, true\n`;
                sql += `FROM categories c WHERE c.name = '${categoryKey}'\n`;
                sql += `AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = '${wordName}' AND w.category_id = c.id);\n\n`;
                
                console.log(`  ✅ ${word.word} (${word.chinese || ''}) -> ${categoryKey}`);
            });
            
            sql += '\n';
        });
        
        // 写入迁移文件
        await fs.ensureDir(path.dirname(supabaseMigrationPath));
        await fs.writeFile(supabaseMigrationPath, sql);
        
        console.log('\n' + '='.repeat(70));
        console.log('🎉 EmojiFlashcards迁移文件生成完成！');
        console.log('='.repeat(70));
        console.log(`📁 文件路径: ${supabaseMigrationPath}`);
        console.log(`📊 包含单词: ${words.length} 个`);
        console.log(`📝 文件大小: ${(await fs.stat(supabaseMigrationPath)).size} 字节`);
        
        console.log('\n📋 分类统计:');
        Object.keys(wordsByCategory).forEach(categoryKey => {
            const categoryWords = wordsByCategory[categoryKey];
            if (categoryWords.length > 0) {
                console.log(`  • ${categoryWords[0].category_display_name}: ${categoryWords.length} 个单词`);
            }
        });
        
        console.log('\n🚀 下一步操作:');
        console.log('1. 运行 npm run db:deploy 查看迁移文件');
        console.log('2. 在Supabase Dashboard中执行迁移文件');
        console.log('3. 访问 localhost:3003 查看网站更新');
        
    } catch (error) {
        console.error('❌ 生成迁移文件失败:', error.message);
    } finally {
        db.close();
    }
}

// 运行生成器
generateEmojiFlashcardsMigration().catch(console.error); 