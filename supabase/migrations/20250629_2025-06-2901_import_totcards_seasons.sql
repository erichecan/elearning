-- TotCards季节数据导入
-- 导入时间: 2025-06-29T01:55:40.625Z
-- 来源: totcards.com
-- 包含: 4个季节单词 (Spring, Summer, Autumn, Winter)

-- 自然天气 (4 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Autumn', '秋天', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Autumn' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Spring', '春天', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Spring' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Summer', '夏天', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Summer' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Winter', '冬天', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Winter' AND w.category_id = c.id);


