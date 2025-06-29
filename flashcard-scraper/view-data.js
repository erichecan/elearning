const LocalDatabase = require('./local-database');

class DataViewer {
    constructor() {
        this.db = new LocalDatabase();
    }

    // 显示统计信息
    showStats() {
        const stats = this.db.getStats();
        const categoryStats = this.db.getCategoryStats();
        
        console.log('\n' + '='.repeat(50));
        console.log('📊 数据库统计信息');
        console.log('='.repeat(50));
        console.log(`📚 总词汇数: ${stats.words}`);
        console.log(`📂 分类数: ${stats.categories}`);
        
        console.log('\n📋 各分类详情:');
        categoryStats.forEach((stat, index) => {
            console.log(`${index + 1}. ${stat.display_name} (${stat.name}): ${stat.word_count} 个单词`);
        });
    }

    // 显示所有分类
    showCategories() {
        const categories = this.db.getAllCategories();
        
        console.log('\n' + '='.repeat(50));
        console.log('📂 所有分类列表');
        console.log('='.repeat(50));
        
        categories.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.display_name} (${cat.name})`);
            console.log(`   图标: ${cat.icon} | 颜色: ${cat.color}`);
            console.log(`   描述: ${cat.description}`);
            console.log('');
        });
    }

    // 显示指定分类的单词
    showWordsInCategory(categoryName, limit = 20) {
        const category = this.db.getCategory(categoryName);
        if (!category) {
            console.log(`❌ 未找到分类: ${categoryName}`);
            return;
        }

        const words = this.db.db.prepare(`
            SELECT * FROM words 
            WHERE category_id = ? 
            ORDER BY word 
            LIMIT ?
        `).all(category.id, limit);

        console.log(`\n📝 ${category.display_name} 分类下的单词 (显示前${limit}个):`);
        console.log('-'.repeat(60));
        
        words.forEach((word, index) => {
            console.log(`${index + 1}. ${word.word}`);
            console.log(`   图片: ${word.image_url}`);
            if (word.chinese) console.log(`   中文: ${word.chinese}`);
            console.log('');
        });
    }

    // 显示所有单词（简要）
    showAllWords(limit = 50) {
        const words = this.db.getAllWords(limit);
        
        console.log(`\n📝 所有单词列表 (显示前${limit}个):`);
        console.log('-'.repeat(60));
        
        let currentCategory = '';
        words.forEach((word) => {
            if (word.category_display_name !== currentCategory) {
                currentCategory = word.category_display_name;
                console.log(`\n📂 ${currentCategory}:`);
            }
            console.log(`  • ${word.word}`);
        });
    }

    // 搜索单词
    searchWords(keyword, limit = 20) {
        const words = this.db.db.prepare(`
            SELECT w.*, c.display_name as category_name
            FROM words w
            JOIN categories c ON w.category_id = c.id
            WHERE w.word LIKE ?
            ORDER BY w.word
            LIMIT ?
        `).all(`%${keyword}%`, limit);

        if (words.length === 0) {
            console.log(`❌ 未找到包含 "${keyword}" 的单词`);
            return;
        }

        console.log(`\n🔍 搜索结果 "${keyword}" (${words.length} 个结果):`);
        console.log('-'.repeat(60));
        
        words.forEach((word, index) => {
            console.log(`${index + 1}. ${word.word} (${word.category_name})`);
            console.log(`   图片: ${word.image_url}`);
            if (word.chinese) console.log(`   中文: ${word.chinese}`);
            console.log('');
        });
    }

    // 显示重复单词
    showDuplicates() {
        const duplicates = this.db.db.prepare(`
            SELECT word, COUNT(*) as count, GROUP_CONCAT(category_id) as categories
            FROM words
            GROUP BY word
            HAVING count > 1
            ORDER BY count DESC, word
        `).all();

        if (duplicates.length === 0) {
            console.log('✅ 没有发现重复单词');
            return;
        }

        console.log(`\n🔄 重复单词列表 (${duplicates.length} 个):`);
        console.log('-'.repeat(60));
        
        duplicates.forEach((dup, index) => {
            console.log(`${index + 1}. "${dup.word}" - 出现 ${dup.count} 次`);
            console.log(`   分类ID: ${dup.categories}`);
        });
    }

    // 显示数据质量报告
    showQualityReport() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 数据质量报告');
        console.log('='.repeat(50));

        // 统计信息
        const stats = this.db.getStats();
        const categoryStats = this.db.getCategoryStats();
        console.log(`📚 总词汇: ${stats.words}`);
        console.log(`📂 分类数: ${stats.categories}`);

        // 检查空字段
        const emptyImageUrls = this.db.db.prepare('SELECT COUNT(*) as count FROM words WHERE image_url IS NULL OR image_url = ""').get().count;
        const emptyChinese = this.db.db.prepare('SELECT COUNT(*) as count FROM words WHERE chinese IS NULL OR chinese = ""').get().count;
        
        console.log(`\n🔍 数据完整性:`);
        console.log(`   缺少图片URL: ${emptyImageUrls} 个单词`);
        console.log(`   缺少中文翻译: ${emptyChinese} 个单词`);

        // 单词长度分析
        const shortWords = this.db.db.prepare('SELECT COUNT(*) as count FROM words WHERE LENGTH(word) <= 2').get().count;
        const longWords = this.db.db.prepare('SELECT COUNT(*) as count FROM words WHERE LENGTH(word) >= 15').get().count;
        
        console.log(`\n📏 单词长度分析:`);
        console.log(`   很短的单词 (≤2字符): ${shortWords} 个`);
        console.log(`   很长的单词 (≥15字符): ${longWords} 个`);

        // 重复分析
        const duplicates = this.db.db.prepare(`
            SELECT COUNT(*) as count 
            FROM (
                SELECT word 
                FROM words 
                GROUP BY word 
                HAVING COUNT(*) > 1
            )
        `).get().count;
        
        console.log(`\n🔄 重复单词: ${duplicates} 个`);

        // 分类分布
        console.log('\n📊 分类词汇分布:');
        categoryStats.forEach(stat => {
            const percentage = ((stat.word_count / stats.words) * 100).toFixed(1);
            console.log(`   ${stat.display_name}: ${stat.word_count} 个 (${percentage}%)`);
        });
    }

    // 主菜单
    showMenu() {
        console.log('\n' + '='.repeat(50));
        console.log('📱 本地数据库查看工具');
        console.log('='.repeat(50));
        console.log('1. 📊 显示统计信息');
        console.log('2. 📂 显示所有分类');
        console.log('3. 📝 显示所有单词 (前50个)');
        console.log('4. 🔍 搜索单词');
        console.log('5. 📋 显示指定分类的单词');
        console.log('6. 🔄 显示重复单词');
        console.log('7. 📊 数据质量报告');
        console.log('8. 📤 导出数据');
        console.log('0. 退出');
        console.log('='.repeat(50));
    }

    // 导出数据
    exportData() {
        console.log('\n📤 正在导出数据...');
        
        // 导出为JSON
        const jsonData = this.db.exportToJson();
        console.log(`✅ JSON数据已导出到: exported-data.json`);
        
        // 导出为SQL
        this.db.exportToSql();
        console.log(`✅ SQL数据已导出到: exported-data.sql`);
        
        console.log(`\n📊 导出统计:`);
        console.log(`   分类: ${jsonData.categories.length} 个`);
        console.log(`   单词: ${jsonData.words.length} 个`);
    }

    // 交互式运行
    async runInteractive() {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

        while (true) {
            this.showMenu();
            const choice = await question('\n请选择操作 (0-8): ');
            
            switch (choice.trim()) {
                case '1':
                    this.showStats();
                    break;
                case '2':
                    this.showCategories();
                    break;
                case '3':
                    this.showAllWords();
                    break;
                case '4':
                    const keyword = await question('请输入搜索关键词: ');
                    this.searchWords(keyword.trim());
                    break;
                case '5':
                    const categoryName = await question('请输入分类名 (如: animals, fruits): ');
                    this.showWordsInCategory(categoryName.trim());
                    break;
                case '6':
                    this.showDuplicates();
                    break;
                case '7':
                    this.showQualityReport();
                    break;
                case '8':
                    this.exportData();
                    break;
                case '0':
                    console.log('👋 再见!');
                    rl.close();
                    this.db.close();
                    return;
                default:
                    console.log('❌ 无效选择，请重试');
            }
            
            await question('\n按回车键继续...');
        }
    }

    // 快速查看 (命令行参数)
    quickView(args) {
        if (!args || args.length === 0) {
            this.showStats();
            this.db.close();
            return;
        }

        const command = args[0].toLowerCase();
        
        switch (command) {
            case 'stats':
                this.showStats();
                break;
            case 'categories':
                this.showCategories();
                break;
            case 'words':
                const limit = args[1] ? parseInt(args[1]) : 50;
                this.showAllWords(limit);
                break;
            case 'search':
                if (args[1]) {
                    this.searchWords(args[1]);
                } else {
                    console.log('❌ 请提供搜索关键词');
                }
                break;
            case 'category':
                if (args[1]) {
                    const limit = args[2] ? parseInt(args[2]) : 20;
                    this.showWordsInCategory(args[1], limit);
                } else {
                    console.log('❌ 请提供分类名');
                }
                break;
            case 'duplicates':
                this.showDuplicates();
                break;
            case 'quality':
                this.showQualityReport();
                break;
            case 'export':
                this.exportData();
                break;
            default:
                console.log('❌ 未知命令');
                console.log('可用命令: stats, categories, words, search, category, duplicates, quality, export');
        }
        
        this.db.close();
    }
}

// 命令行使用
if (require.main === module) {
    const viewer = new DataViewer();
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // 交互式模式
        viewer.runInteractive().catch(console.error);
    } else {
        // 快速查看模式
        viewer.quickView(args);
    }
}

module.exports = DataViewer; 