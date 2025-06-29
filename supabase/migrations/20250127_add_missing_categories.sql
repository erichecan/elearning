-- 添加缺失的5个分类
-- 执行日期：2025-01-27
-- 目的：添加日常短语、问候短语、动作短语、简单句子、对话句子等5个分类

-- 插入缺失的分类
INSERT INTO categories (name, display_name, description, icon, color) VALUES
('daily_phrases', '日常短语', '生活中常用的英语短语', '💬', '#FF9FF3'),
('greeting_phrases', '问候短语', '礼貌问候和寒暄用语', '👋', '#54A0FF'),
('action_phrases', '动作短语', '描述动作和行为的短语', '🏃‍♀️', '#5F27CD'),
('simple_sentences', '简单句子', '基础英语句子结构', '📝', '#00D2D3'),
('conversation_sentences', '对话句子', '日常对话常用句子', '🗣️', '#FF6B6B')
ON CONFLICT (name) DO NOTHING;

-- 插入日常短语类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) 
SELECT 
    word_data.word,
    word_data.chinese,
    word_data.phonetic,
    word_data.image_url,
    word_data.audio_url,
    c.id,
    word_data.difficulty_level
FROM categories c,
(VALUES
    ('Good morning', '早上好', '/ɡʊd ˈmɔːrnɪŋ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Good night', '晚安', '/ɡʊd naɪt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Thank you', '谢谢', '/θæŋk juː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('You are welcome', '不客气', '/juː ɑːr ˈwelkəm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('Excuse me', '对不起', '/ɪkˈskjuːz miː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('I am sorry', '我很抱歉', '/aɪ æm ˈsɑːri/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('How are you', '你好吗', '/haʊ ɑːr juː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('I am fine', '我很好', '/aɪ æm faɪn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('See you later', '再见', '/siː juː ˈleɪtər/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3),
    ('Have a nice day', '祝你愉快', '/hæv ə naɪs deɪ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3)
) AS word_data(word, chinese, phonetic, image_url, audio_url, difficulty_level)
WHERE c.name = 'daily_phrases'
ON CONFLICT (word, category_id) DO NOTHING;

-- 插入问候短语类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) 
SELECT 
    word_data.word,
    word_data.chinese,
    word_data.phonetic,
    word_data.image_url,
    word_data.audio_url,
    c.id,
    word_data.difficulty_level
FROM categories c,
(VALUES
    ('Hello', '你好', '/həˈloʊ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Hi', '嗨', '/haɪ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Goodbye', '再见', '/ɡʊdˈbaɪ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Nice to meet you', '很高兴认识你', '/naɪs tuː miːt juː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('My name is', '我的名字是', '/maɪ neɪm ɪz/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('What is your name', '你叫什么名字', '/wɑːt ɪz jɔːr neɪm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('How old are you', '你多大了', '/haʊ oʊld ɑːr juː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('I am years old', '我岁了', '/aɪ æm jɪrz oʊld/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('Where are you from', '你来自哪里', '/wer ɑːr juː frʌm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3),
    ('I am from', '我来自', '/aɪ æm frʌm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3)
) AS word_data(word, chinese, phonetic, image_url, audio_url, difficulty_level)
WHERE c.name = 'greeting_phrases'
ON CONFLICT (word, category_id) DO NOTHING;

-- 插入动作短语类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) 
SELECT 
    word_data.word,
    word_data.chinese,
    word_data.phonetic,
    word_data.image_url,
    word_data.audio_url,
    c.id,
    word_data.difficulty_level
FROM categories c,
(VALUES
    ('Stand up', '站起来', '/stænd ʌp/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Sit down', '坐下', '/sɪt daʊn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Come here', '过来', '/kʌm hɪr/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Go away', '走开', '/ɡoʊ əˈweɪ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('Look at me', '看着我', '/lʊk æt miː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('Listen carefully', '仔细听', '/ˈlɪsən ˈkerfəli/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('Open the door', '开门', '/ˈoʊpən ðə dɔːr/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('Close the window', '关窗', '/kloʊz ðə ˈwɪndoʊ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('Turn on the light', '开灯', '/tɜːrn ɑːn ðə laɪt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3),
    ('Turn off the TV', '关电视', '/tɜːrn ɔːf ðə ˌtiː ˈviː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3)
) AS word_data(word, chinese, phonetic, image_url, audio_url, difficulty_level)
WHERE c.name = 'action_phrases'
ON CONFLICT (word, category_id) DO NOTHING;

-- 插入简单句子类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) 
SELECT 
    word_data.word,
    word_data.chinese,
    word_data.phonetic,
    word_data.image_url,
    word_data.audio_url,
    c.id,
    word_data.difficulty_level
FROM categories c,
(VALUES
    ('I am a student', '我是一个学生', '/aɪ æm ə ˈstjuːdənt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('This is my book', '这是我的书', '/ðɪs ɪz maɪ bʊk/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('I like apples', '我喜欢苹果', '/aɪ laɪk ˈæpəlz/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('She is my friend', '她是我的朋友', '/ʃiː ɪz maɪ frend/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('We are happy', '我们很开心', '/wiː ɑːr ˈhæpi/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('The cat is sleeping', '猫在睡觉', '/ðə kæt ɪz ˈsliːpɪŋ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('I can swim', '我会游泳', '/aɪ kæn swɪm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('The sun is bright', '太阳很亮', '/ðə sʌn ɪz braɪt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('I want to eat', '我想吃东西', '/aɪ wɑːnt tuː iːt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3),
    ('The weather is nice', '天气很好', '/ðə ˈweðər ɪz naɪs/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3)
) AS word_data(word, chinese, phonetic, image_url, audio_url, difficulty_level)
WHERE c.name = 'simple_sentences'
ON CONFLICT (word, category_id) DO NOTHING;

-- 插入对话句子类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) 
SELECT 
    word_data.word,
    word_data.chinese,
    word_data.phonetic,
    word_data.image_url,
    word_data.audio_url,
    c.id,
    word_data.difficulty_level
FROM categories c,
(VALUES
    ('What is this', '这是什么', '/wɑːt ɪz ðɪs/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('It is a cat', '这是一只猫', '/ɪt ɪz ə kæt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 1),
    ('Where is my bag', '我的包在哪里', '/wer ɪz maɪ bæɡ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('It is on the table', '它在桌子上', '/ɪt ɪz ɑːn ðə ˈteɪbəl/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('What time is it', '几点了', '/wɑːt taɪm ɪz ɪt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('It is three o clock', '三点钟了', '/ɪt ɪz θriː ə klɑːk/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 2),
    ('Do you like ice cream', '你喜欢冰淇淋吗', '/duː juː laɪk aɪs kriːm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3),
    ('Yes I do', '是的我喜欢', '/jes aɪ duː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3),
    ('Can you help me', '你能帮我吗', '/kæn juː help miː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3),
    ('Of course I can', '当然可以', '/əv kɔːrs aɪ kæn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3)
) AS word_data(word, chinese, phonetic, image_url, audio_url, difficulty_level)
WHERE c.name = 'conversation_sentences'
ON CONFLICT (word, category_id) DO NOTHING; 