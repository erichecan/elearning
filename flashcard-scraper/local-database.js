const Database = require('better-sqlite3');
const fs = require('fs-extra');
const path = require('path');

class LocalDatabase {
    constructor(dbPath = './flashcards.db') {
        this.dbPath = dbPath;
        this.db = null;
        this.init();
    }

    init() {
        console.log('📁 初始化本地数据库...');
        this.db = new Database(this.dbPath);
        this.createTables();
        this.insertDefaultCategories();
        console.log('✅ 本地数据库初始化完成');
    }

    createTables() {
        // 创建分类表
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE,
                display_name TEXT NOT NULL,
                description TEXT,
                icon TEXT,
                color TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 创建单词表
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word TEXT NOT NULL,
                chinese TEXT,
                phonetic TEXT,
                image_url TEXT,
                audio_url TEXT,
                category_id INTEGER REFERENCES categories(id),
                difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
                is_active INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(word, category_id)
            )
        `);

        // 创建索引
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_words_category ON words(category_id);
            CREATE INDEX IF NOT EXISTS idx_words_active ON words(is_active);
            CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);
        `);

        console.log('📊 数据库表结构创建完成');
    }

    insertDefaultCategories() {
        const categories = [
            { name: 'fruits', display_name: '水果蔬菜', description: '各种水果和蔬菜的英语单词', icon: '🍎', color: '#FF6B6B' },
            { name: 'animals', display_name: '动物世界', description: '可爱的动物朋友们', icon: '🦁', color: '#4ECDC4' },
            { name: 'colors', display_name: '颜色形状', description: '基本颜色和形状认知', icon: '🌈', color: '#45B7D1' },
            { name: 'numbers', display_name: '数字时间', description: '数字和时间概念', icon: '🔢', color: '#96CEB4' },
            { name: 'family', display_name: '家庭成员', description: '家庭成员称谓', icon: '👨‍👩‍👧‍👦', color: '#FFEAA7' },
            { name: 'body', display_name: '身体部位', description: '认识身体各部位', icon: '🙋‍♀️', color: '#DDA0DD' },
            { name: 'clothes', display_name: '服装配饰', description: '日常服装用品', icon: '👕', color: '#98D8C8' },
            { name: 'food', display_name: '美食餐具', description: '食物和餐具名称', icon: '🍽️', color: '#F7DC6F' },
            { name: 'transport', display_name: '交通工具', description: '各种交通工具', icon: '🚗', color: '#AED6F1' },
            { name: 'nature', display_name: '自然天气', description: '自然现象和天气', icon: '🌤️', color: '#A9DFBF' },
            { name: 'daily_phrases', display_name: '日常短语', description: '生活中常用的英语短语', icon: '💬', color: '#FF9FF3' }
        ];

        const insertCategory = this.db.prepare(`
            INSERT OR IGNORE INTO categories (name, display_name, description, icon, color)
            VALUES (?, ?, ?, ?, ?)
        `);

        let insertedCount = 0;
        for (const category of categories) {
            const result = insertCategory.run(
                category.name, 
                category.display_name, 
                category.description, 
                category.icon, 
                category.color
            );
            if (result.changes > 0) insertedCount++;
        }

        if (insertedCount > 0) {
            console.log(`📂 插入了 ${insertedCount} 个默认分类`);
        }
    }

    // 获取分类
    getCategory(name) {
        const stmt = this.db.prepare('SELECT * FROM categories WHERE name = ?');
        return stmt.get(name);
    }

    // 获取所有分类
    getAllCategories() {
        const stmt = this.db.prepare('SELECT * FROM categories ORDER BY name');
        return stmt.all();
    }

    // 检查单词是否存在
    wordExists(word, categoryId) {
        const stmt = this.db.prepare('SELECT id FROM words WHERE word = ? AND category_id = ?');
        return stmt.get(word, categoryId) !== undefined;
    }

    // 插入单词
    insertWord(wordData) {
        const stmt = this.db.prepare(`
            INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        try {
            const result = stmt.run(
                wordData.word,
                wordData.chinese || '',
                wordData.image_url,
                wordData.category_id,
                wordData.difficulty_level || 1,
                wordData.is_active ? 1 : 0
            );
            return { success: true, id: result.lastInsertRowid };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // 添加单词的简化方法
    addWord(word, chinese, imageUrl, categoryName, difficultyLevel = 1) {
        // 获取分类ID
        const category = this.getCategory(categoryName);
        if (!category) {
            return { success: false, error: `分类 '${categoryName}' 不存在` };
        }

        // 检查是否已存在
        if (this.wordExists(word, category.id)) {
            return { success: false, error: `单词 '${word}' 在分类 '${categoryName}' 中已存在` };
        }

        // 插入单词
        return this.insertWord({
            word: word,
            chinese: chinese,
            image_url: imageUrl,
            category_id: category.id,
            difficulty_level: difficultyLevel,
            is_active: true
        });
    }

    // 获取统计信息
    getStats() {
        const words = this.db.prepare('SELECT COUNT(*) as count FROM words').get().count;
        const categories = this.db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
        
        return {
            words,
            categories
        };
    }

    // 获取分类统计
    getCategoryStats() {
        const stmt = this.db.prepare(`
            SELECT c.name, c.display_name, COUNT(w.id) as word_count
            FROM categories c
            LEFT JOIN words w ON c.id = w.category_id
            GROUP BY c.id, c.name, c.display_name
            ORDER BY word_count DESC
        `);
        return stmt.all();
    }

    // 获取所有单词（用于查看和导出）
    getAllWords(limit = null) {
        let query = `
            SELECT w.*, c.name as category_name, c.display_name as category_display_name
            FROM words w
            JOIN categories c ON w.category_id = c.id
            ORDER BY c.name, w.word
        `;
        
        if (limit) {
            query += ` LIMIT ${limit}`;
        }

        const stmt = this.db.prepare(query);
        return stmt.all();
    }

    // 导出数据到JSON（用于迁移到线上）
    exportToJson(filename = './exported-data.json') {
        const data = {
            categories: this.getAllCategories(),
            words: this.getAllWords(),
            stats: this.getStats(),
            exportedAt: new Date().toISOString()
        };

        fs.writeJsonSync(filename, data, { spaces: 2 });
        console.log(`📤 数据已导出到: ${filename}`);
        return data;
    }

    // 导出为SQL格式（用于直接导入其他数据库）
    exportToSql(filename = './exported-data.sql') {
        const categories = this.getAllCategories();
        const words = this.getAllWords();
        
        let sql = '-- 闪卡数据导出\n';
        sql += `-- 导出时间: ${new Date().toISOString()}\n\n`;
        
        // 分类数据
        sql += '-- 分类数据\n';
        for (const cat of categories) {
            sql += `INSERT INTO categories (name, display_name, description, icon, color) VALUES ('${cat.name}', '${cat.display_name}', '${cat.description || ''}', '${cat.icon || ''}', '${cat.color || ''}');\n`;
        }
        
        sql += '\n-- 单词数据\n';
        for (const word of words) {
            const chinese = word.chinese ? word.chinese.replace(/'/g, "''") : '';
            const imageUrl = word.image_url ? word.image_url.replace(/'/g, "''") : '';
            sql += `INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active) VALUES ('${word.word}', '${chinese}', '${imageUrl}', ${word.category_id}, ${word.difficulty_level}, ${word.is_active});\n`;
        }

        fs.writeFileSync(filename, sql);
        console.log(`📤 SQL数据已导出到: ${filename}`);
        return sql;
    }

    // 关闭数据库
    close() {
        if (this.db) {
            this.db.close();
            console.log('✅ 本地数据库已关闭');
        }
    }
}

module.exports = LocalDatabase; 