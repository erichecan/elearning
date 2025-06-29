const { createClient } = require('@supabase/supabase-js');
const LocalDatabase = require('./local-database');
require('dotenv').config({ path: '../.env' });

class SupabaseImporter {
    constructor() {
        // 连接到Supabase
        this.supabase = createClient(
            process.env.VITE_SUPABASE_URL,
            process.env.VITE_SUPABASE_ANON_KEY
        );
        
        // 连接到本地数据库
        this.localDb = new LocalDatabase('./flashcards.db');
        
        this.stats = {
            categoriesImported: 0,
            wordsImported: 0,
            categoriesSkipped: 0,
            wordsSkipped: 0,
            errors: []
        };
    }

    async checkSupabaseConnection() {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .select('count', { count: 'exact' })
                .limit(1);
                
            if (error) throw error;
            console.log('✅ Supabase连接成功');
            return true;
        } catch (error) {
            console.error('❌ Supabase连接失败:', error.message);
            return false;
        }
    }

    async importCategories() {
        console.log('\n📂 开始导入分类...');
        
        const localCategories = this.localDb.getAllCategories();
        
        for (const category of localCategories) {
            try {
                // 检查分类是否已存在
                const { data: existing } = await this.supabase
                    .from('categories')
                    .select('id')
                    .eq('name', category.name)
                    .single();

                if (existing) {
                    console.log(`  ⏭️  分类 "${category.display_name}" 已存在，跳过`);
                    this.stats.categoriesSkipped++;
                    continue;
                }

                // 插入新分类
                const { error } = await this.supabase
                    .from('categories')
                    .insert({
                        name: category.name,
                        display_name: category.display_name,
                        description: category.description,
                        icon: category.icon,
                        color: category.color
                    });

                if (error) throw error;
                
                console.log(`  ✅ 导入分类: ${category.display_name}`);
                this.stats.categoriesImported++;
                
            } catch (error) {
                console.error(`  ❌ 导入分类失败 ${category.display_name}:`, error.message);
                this.stats.errors.push(`分类 ${category.display_name}: ${error.message}`);
            }
        }
    }

    async importWords() {
        console.log('\n📝 开始导入单词...');
        
        const localWords = this.localDb.getAllWords();
        
        for (const word of localWords) {
            try {
                // 获取Supabase中的分类ID
                const { data: category } = await this.supabase
                    .from('categories')
                    .select('id')
                    .eq('name', word.category_name)
                    .single();

                if (!category) {
                    console.log(`  ⚠️  未找到分类 "${word.category_name}"，跳过单词: ${word.word}`);
                    this.stats.wordsSkipped++;
                    continue;
                }

                // 检查单词是否已存在
                const { data: existing } = await this.supabase
                    .from('words')
                    .select('id')
                    .eq('word', word.word)
                    .eq('category_id', category.id)
                    .single();

                if (existing) {
                    console.log(`  ⏭️  单词 "${word.word}" 已存在，跳过`);
                    this.stats.wordsSkipped++;
                    continue;
                }

                // 插入新单词
                const { error } = await this.supabase
                    .from('words')
                    .insert({
                        word: word.word,
                        chinese: word.chinese || '',
                        image_url: word.image_url,
                        category_id: category.id,
                        difficulty_level: word.difficulty_level || 1,
                        is_active: word.is_active ? true : false
                    });

                if (error) throw error;
                
                console.log(`  ✅ 导入单词: ${word.word} (${word.category_display_name})`);
                this.stats.wordsImported++;
                
            } catch (error) {
                console.error(`  ❌ 导入单词失败 ${word.word}:`, error.message);
                this.stats.errors.push(`单词 ${word.word}: ${error.message}`);
            }
        }
    }

    async verifyImport() {
        console.log('\n🔍 验证导入结果...');
        
        try {
            // 检查Supabase中的数据
            const { data: categories, error: catError } = await this.supabase
                .from('categories')
                .select('id, name, display_name');
                
            const { data: words, error: wordError } = await this.supabase
                .from('words')
                .select('id, word, categories(display_name)')
                .eq('is_active', true);

            if (catError || wordError) {
                throw new Error('验证查询失败');
            }

            console.log(`📊 Supabase数据库状态:`);
            console.log(`   分类数: ${categories?.length || 0}`);
            console.log(`   单词数: ${words?.length || 0}`);
            
            // 按分类统计
            if (words && categories) {
                console.log('\n📋 各分类单词数:');
                const categoryStats = categories.map(cat => {
                    const wordCount = words.filter(w => w.categories?.display_name === cat.display_name).length;
                    return { name: cat.display_name, count: wordCount };
                });
                
                categoryStats.forEach(stat => {
                    if (stat.count > 0) {
                        console.log(`   ${stat.name}: ${stat.count} 个单词`);
                    }
                });
            }
            
        } catch (error) {
            console.error('❌ 验证失败:', error.message);
        }
    }

    printFinalStats() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 导入完成 - 最终统计');
        console.log('='.repeat(60));
        console.log(`📂 导入分类数: ${this.stats.categoriesImported}`);
        console.log(`📝 导入单词数: ${this.stats.wordsImported}`);
        console.log(`⏭️  跳过分类数: ${this.stats.categoriesSkipped}`);
        console.log(`⏭️  跳过单词数: ${this.stats.wordsSkipped}`);
        
        if (this.stats.errors.length > 0) {
            console.log(`\n❌ 错误信息 (${this.stats.errors.length} 个):`);
            this.stats.errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎉 您现在可以在网站上看到这些数据了！');
        console.log('🔗 访问: http://localhost:3003');
    }

    async run() {
        console.log('🚀 开始将本地数据导入到Supabase...\n');
        
        try {
            // 检查连接
            const connected = await this.checkSupabaseConnection();
            if (!connected) {
                throw new Error('无法连接到Supabase');
            }
            
            // 导入数据
            await this.importCategories();
            await this.importWords();
            
            // 验证结果
            await this.verifyImport();
            
            // 显示统计
            this.printFinalStats();
            
        } catch (error) {
            console.error('❌ 导入过程中出错:', error.message);
        } finally {
            // 关闭本地数据库连接
            this.localDb.close();
        }
    }
}

// 如果直接运行此文件
if (require.main === module) {
    const importer = new SupabaseImporter();
    importer.run().catch(console.error);
}

module.exports = SupabaseImporter; 