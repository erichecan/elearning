-- 修复Supabase数据库表结构
-- 请在Supabase SQL Editor中运行此脚本

-- 1. 删除现有表（按依赖关系顺序）
DROP TABLE IF EXISTS learning_progress CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- 2. 重新创建正确的表结构

-- 分类表
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 单词表 (注意字段名要匹配代码)
CREATE TABLE words (
    id BIGSERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,           -- 英文单词
    chinese VARCHAR(100) NOT NULL,        -- 中文翻译
    phonetic VARCHAR(200),                -- 音标
    image_url TEXT,                       -- 图片URL
    audio_url TEXT,                       -- 音频URL
    category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户收藏表
CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    word_id BIGINT REFERENCES words(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- 学习进度表
CREATE TABLE learning_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    word_id BIGINT REFERENCES words(id) ON DELETE CASCADE,
    correct_count INTEGER DEFAULT 0,
    wrong_count INTEGER DEFAULT 0,
    last_learned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
    UNIQUE(user_id, word_id)
);

-- 创建索引
CREATE INDEX idx_words_category ON words(category_id);
CREATE INDEX idx_words_active ON words(is_active);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_progress_user ON learning_progress(user_id);
CREATE INDEX idx_words_search ON words USING gin(to_tsvector('english', word || ' ' || chinese));

-- 启用RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Allow read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow read access to words" ON words FOR SELECT USING (true);
CREATE POLICY "Users can read their own favorites" ON favorites FOR SELECT USING (true);
CREATE POLICY "Users can insert their own favorites" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (true);
CREATE POLICY "Users can read their own progress" ON learning_progress FOR SELECT USING (true);
CREATE POLICY "Users can insert their own progress" ON learning_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own progress" ON learning_progress FOR UPDATE USING (true);

-- 创建存储过程
CREATE OR REPLACE FUNCTION update_correct_progress(p_user_id TEXT, p_word_id BIGINT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO learning_progress (user_id, word_id, correct_count, last_learned_at)
    VALUES (p_user_id, p_word_id, 1, NOW())
    ON CONFLICT (user_id, word_id) 
    DO UPDATE SET 
        correct_count = learning_progress.correct_count + 1,
        last_learned_at = NOW(),
        mastery_level = LEAST(5, CASE 
            WHEN learning_progress.correct_count + 1 >= 10 THEN 5
            WHEN learning_progress.correct_count + 1 >= 7 THEN 4
            WHEN learning_progress.correct_count + 1 >= 5 THEN 3
            WHEN learning_progress.correct_count + 1 >= 3 THEN 2
            WHEN learning_progress.correct_count + 1 >= 1 THEN 1
            ELSE 0
        END);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_wrong_progress(p_user_id TEXT, p_word_id BIGINT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO learning_progress (user_id, word_id, wrong_count, last_learned_at)
    VALUES (p_user_id, p_word_id, 1, NOW())
    ON CONFLICT (user_id, word_id) 
    DO UPDATE SET 
        wrong_count = learning_progress.wrong_count + 1,
        last_learned_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 插入分类数据
INSERT INTO categories (name, display_name, description, icon, color) VALUES
('fruits', '水果蔬菜', '各种水果和蔬菜的英语单词', '🍎', '#FF6B6B'),
('animals', '动物世界', '可爱的动物朋友们', '🦁', '#4ECDC4'),
('colors', '颜色形状', '基本颜色和形状认知', '🌈', '#45B7D1'),
('numbers', '数字时间', '数字和时间概念', '🔢', '#96CEB4'),
('family', '家庭成员', '家庭成员称谓', '👨‍👩‍👧‍👦', '#FFEAA7'),
('body', '身体部位', '认识身体各部位', '🙋‍♀️', '#DDA0DD'),
('clothes', '服装配饰', '日常服装用品', '👕', '#98D8C8'),
('food', '美食餐具', '食物和餐具名称', '🍽️', '#F7DC6F'),
('transport', '交通工具', '各种交通工具', '🚗', '#AED6F1'),
('nature', '自然天气', '自然现象和天气', '🌤️', '#A9DFBF');

-- 插入示例单词数据 (注意使用正确的字段名)
INSERT INTO words (word, chinese, phonetic, image_url, category_id, difficulty_level) VALUES
('apple', '苹果', '/ˈæpəl/', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400', 1, 1),
('banana', '香蕉', '/bəˈnænə/', 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400', 1, 1),
('orange', '橙子', '/ˈɔːrɪndʒ/', 'https://images.unsplash.com/photo-1580013759032-c96505e24771?w=400', 1, 1),
('cat', '猫', '/kæt/', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', 2, 1),
('dog', '狗', '/dɔːɡ/', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400', 2, 1),
('bird', '鸟', '/bɜːrd/', 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400', 2, 1),
('red', '红色', '/red/', 'https://images.unsplash.com/photo-1558618047-b93c0c2e2041?w=400', 3, 1),
('blue', '蓝色', '/bluː/', 'https://images.unsplash.com/photo-1464822759844-d150ad6191c6?w=400', 3, 1),
('green', '绿色', '/ɡriːn/', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', 3, 1),
('one', '一', '/wʌn/', null, 4, 1),
('two', '二', '/tuː/', null, 4, 1),
('three', '三', '/θriː/', null, 4, 1),
('mother', '妈妈', '/ˈmʌðər/', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 5, 2),
('father', '爸爸', '/ˈfɑːðər/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 5, 2),
('sister', '姐妹', '/ˈsɪstər/', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 5, 2); 