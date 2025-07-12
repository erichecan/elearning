import Database from 'better-sqlite3';
import fs from 'fs';

class LocalDatabaseSetup {
    constructor(dbPath = './local-elearning.db') {
        this.dbPath = dbPath;
        this.db = null;
    }

    init() {
        console.log('🏗️  初始化本地数据库...');
        
        // 如果数据库已存在，先删除
        if (fs.existsSync(this.dbPath)) {
            fs.unlinkSync(this.dbPath);
            console.log('🗑️  删除旧数据库文件');
        }

        this.db = new Database(this.dbPath);
        
        // 启用外键约束
        this.db.pragma('foreign_keys = ON');
        
        this.createTables();
        this.insertInitialData();
        
        console.log('✅ 本地数据库设置完成！');
        console.log(`📁 数据库位置: ${this.dbPath}`);
    }

    createTables() {
        console.log('📋 创建数据库表...');
        
        // 分类表
        this.db.exec(`
            CREATE TABLE categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(50) NOT NULL UNIQUE,
                display_name VARCHAR(100) NOT NULL,
                description TEXT,
                icon VARCHAR(50),
                color VARCHAR(7),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 单词表
        this.db.exec(`
            CREATE TABLE words (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                word VARCHAR(100) NOT NULL,
                chinese VARCHAR(100) NOT NULL,
                phonetic VARCHAR(200),
                image_url TEXT,
                audio_url TEXT,
                category_id INTEGER,
                difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
                is_active BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
            )
        `);

        // 用户收藏表
        this.db.exec(`
            CREATE TABLE favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(100) NOT NULL,
                word_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
                UNIQUE(user_id, word_id)
            )
        `);

        // 学习进度表
        this.db.exec(`
            CREATE TABLE learning_progress (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id VARCHAR(100) NOT NULL,
                word_id INTEGER,
                correct_count INTEGER DEFAULT 0,
                wrong_count INTEGER DEFAULT 0,
                last_learned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
                FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
                UNIQUE(user_id, word_id)
            )
        `);

        // 创建索引
        this.db.exec(`
            CREATE INDEX idx_words_category ON words(category_id);
            CREATE INDEX idx_words_active ON words(is_active);
            CREATE INDEX idx_favorites_user ON favorites(user_id);
            CREATE INDEX idx_progress_user ON learning_progress(user_id);
        `);

        console.log('✅ 数据库表创建完成');
    }

    insertInitialData() {
        console.log('📝 插入初始分类数据...');
        
        const insertCategory = this.db.prepare(`
            INSERT INTO categories (name, display_name, description, icon, color) 
            VALUES (?, ?, ?, ?, ?)
        `);

        const categories = [
            ['fruits', '水果蔬菜', '各种水果和蔬菜的英语单词', '🍎', '#FF6B6B'],
            ['animals', '动物世界', '可爱的动物朋友们', '🦁', '#4ECDC4'],
            ['colors', '颜色形状', '基本颜色和形状认知', '🌈', '#45B7D1'],
            ['numbers', '数字时间', '数字和时间概念', '🔢', '#96CEB4'],
            ['family', '家庭成员', '家庭成员称谓', '👨‍👩‍👧‍👦', '#FFEAA7'],
            ['body', '身体部位', '认识身体各部位', '🙋‍♀️', '#DDA0DD'],
            ['clothes', '服装配饰', '日常服装用品', '👕', '#98D8C8'],
            ['food', '美食餐具', '食物和餐具名称', '🍽️', '#F7DC6F'],
            ['transport', '交通工具', '各种交通工具', '🚗', '#AED6F1'],
            ['nature', '自然天气', '自然现象和天气', '🌤️', '#A9DFBF'],
            ['daily_phrases', '日常短语', '生活中常用的英语短语', '💬', '#FF9FF3'],
            ['greeting_phrases', '问候短语', '礼貌问候和寒暄用语', '👋', '#54A0FF'],
            ['action_phrases', '动作短语', '描述动作和行为的短语', '🏃‍♀️', '#5F27CD'],
            ['simple_sentences', '简单句子', '基础英语句子结构', '📝', '#00D2D3'],
            ['conversation_sentences', '对话句子', '日常对话常用句子', '🗣️', '#FF6B6B']
        ];

        categories.forEach(category => {
            insertCategory.run(...category);
        });

        console.log(`✅ 插入了 ${categories.length} 个分类`);
    }

    importScrapedData() {
        console.log('📥 导入抓取的数据...');
        
        const scrapedDbPath = './flashcard-scraper/flashcards.db';
        if (!fs.existsSync(scrapedDbPath)) {
            console.log('⚠️  未找到抓取的数据库文件，请先运行抓取程序');
            return;
        }

        const scrapedDb = new Database(scrapedDbPath);
        
        // 获取抓取的单词数据
        const scrapedWords = scrapedDb.prepare(`
            SELECT w.*, c.name as category_name 
            FROM words w 
            JOIN categories c ON w.category_id = c.id
            WHERE w.is_active = 1
        `).all();

        // 准备插入语句
        const insertWord = this.db.prepare(`
            INSERT OR IGNORE INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        // 获取本地分类映射
        const categories = this.db.prepare('SELECT id, name FROM categories').all();
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat.name] = cat.id;
        });

        let imported = 0;
        let skipped = 0;

        scrapedWords.forEach(word => {
            const categoryId = categoryMap[word.category_name];
            if (categoryId) {
                try {
                    const result = insertWord.run(
                        word.word,
                        word.chinese || '',
                        word.image_url,
                        categoryId,
                        word.difficulty_level || 1,
                        word.is_active ? 1 : 0
                    );
                    if (result.changes > 0) {
                        imported++;
                    } else {
                        skipped++;
                    }
                } catch (error) {
                    console.log(`⚠️  跳过重复单词: ${word.word}`);
                    skipped++;
                }
            } else {
                console.log(`⚠️  未找到分类映射: ${word.category_name}`);
                skipped++;
            }
        });

        scrapedDb.close();
        
        console.log(`✅ 导入完成: ${imported} 个单词，跳过: ${skipped} 个`);
    }

    getStats() {
        console.log('\n📊 数据库统计:');
        
        // 总体统计
        const totalCategories = this.db.prepare('SELECT COUNT(*) as count FROM categories').get().count;
        const totalWords = this.db.prepare('SELECT COUNT(*) as count FROM words WHERE is_active = 1').get().count;
        
        console.log(`  📂 分类数: ${totalCategories}`);
        console.log(`  📝 单词数: ${totalWords}`);
        
        // 各分类统计
        const categoryStats = this.db.prepare(`
            SELECT c.display_name, COUNT(w.id) as word_count 
            FROM categories c 
            LEFT JOIN words w ON c.id = w.category_id AND w.is_active = 1
            GROUP BY c.id, c.display_name
            ORDER BY word_count DESC
        `).all();
        
        console.log('\n📋 各分类单词数:');
        categoryStats.forEach(stat => {
            if (stat.word_count > 0) {
                console.log(`  ${stat.display_name}: ${stat.word_count} 个单词`);
            }
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

// 如果直接运行此文件
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
    const setup = new LocalDatabaseSetup();
    
    setup.init();
    setup.importScrapedData();
    setup.getStats();
    setup.close();
    
    console.log('\n🎉 本地数据库设置完成！');
    console.log('💡 下一步：修改网站配置连接到本地数据库');
}

export default LocalDatabaseSetup; 