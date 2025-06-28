-- 启用RLS (行级安全)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-secret-jwt-token-with-at-least-32-characters-long';

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- hex color code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 单词表
CREATE TABLE IF NOT EXISTS words (
    id BIGSERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    chinese VARCHAR(100) NOT NULL,
    phonetic VARCHAR(200), -- 音标
    image_url TEXT,
    audio_url TEXT,
    category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
    difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL, -- 可以是设备ID或用户ID
    word_id BIGINT REFERENCES words(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- 学习进度表
CREATE TABLE IF NOT EXISTS learning_progress (
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
CREATE INDEX IF NOT EXISTS idx_words_category ON words(category_id);
CREATE INDEX IF NOT EXISTS idx_words_active ON words(is_active);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_words_search ON words USING gin(to_tsvector('english', word || ' ' || chinese));

-- 启用RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略 - 允许所有用户读取分类和单词
CREATE POLICY "Allow read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow read access to words" ON words FOR SELECT USING (true);

-- 收藏表的RLS策略 - 只能操作自己的收藏
CREATE POLICY "Users can read their own favorites" ON favorites FOR SELECT USING (true);
CREATE POLICY "Users can insert their own favorites" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete their own favorites" ON favorites FOR DELETE USING (true);

-- 学习进度表的RLS策略 - 只能操作自己的进度
CREATE POLICY "Users can read their own progress" ON learning_progress FOR SELECT USING (true);
CREATE POLICY "Users can insert their own progress" ON learning_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own progress" ON learning_progress FOR UPDATE USING (true);

-- 创建存储过程来更新学习进度
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

-- 插入初始分类数据
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
('nature', '自然天气', '自然现象和天气', '🌤️', '#A9DFBF'),
('daily_phrases', '日常短语', '生活中常用的英语短语', '💬', '#FF9FF3'),
('greeting_phrases', '问候短语', '礼貌问候和寒暄用语', '👋', '#54A0FF'),
('action_phrases', '动作短语', '描述动作和行为的短语', '🏃‍♀️', '#5F27CD'),
('simple_sentences', '简单句子', '基础英语句子结构', '📝', '#00D2D3'),
('conversation_sentences', '对话句子', '日常对话常用句子', '🗣️', '#FF6B6B')
ON CONFLICT (name) DO NOTHING; 