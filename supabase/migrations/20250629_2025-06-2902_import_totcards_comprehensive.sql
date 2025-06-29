-- TotCards全面数据导入
-- 导入时间: 2025-06-29T02:01:28.714Z
-- 来源: totcards.com (全分类)
-- 包含: 84个单词 (月份、数字、字母、形状、颜色、时间)

-- 颜色形状 (22 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Black', '黑色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Black' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Blue', '蓝色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Blue' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Brown', '棕色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Brown' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Circle', '圆形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Circle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Diamond', '菱形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Diamond' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Gray', '灰色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Gray' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Green', '绿色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Green' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Heart', '心形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Heart' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hexagon', '六角形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hexagon' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Orange', '橙色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Orange' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Oval', '椭圆形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Oval' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pentagon', '五角形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pentagon' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pink', '粉色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pink' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Purple', '紫色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Purple' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rectangle', '长方形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rectangle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Red', '红色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Red' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Silver', '银色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Silver' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Square', '正方形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Square' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Star', '星形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Star' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Triangle', '三角形', 'https://www.totcards.com/img/shape-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Triangle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'White', '白色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'White' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Yellow', '黄色', 'https://www.totcards.com/img/colour-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Yellow' AND w.category_id = c.id);


-- 日常短语 (26 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter A', '字母A', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter A' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter B', '字母B', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter B' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter C', '字母C', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter C' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter D', '字母D', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter D' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter E', '字母E', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter E' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter F', '字母F', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter F' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter G', '字母G', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter G' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter H', '字母H', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter H' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter I', '字母I', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter I' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter J', '字母J', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter J' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter K', '字母K', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter K' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter L', '字母L', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter L' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter M', '字母M', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter M' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter N', '字母N', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter N' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter O', '字母O', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter O' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter P', '字母P', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter P' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter Q', '字母Q', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter Q' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter R', '字母R', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter R' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter S', '字母S', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter S' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter T', '字母T', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter T' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter U', '字母U', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter U' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter V', '字母V', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter V' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter W', '字母W', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter W' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter X', '字母X', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter X' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter Y', '字母Y', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter Y' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Letter Z', '字母Z', 'https://www.totcards.com/img/alphabet-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Letter Z' AND w.category_id = c.id);


-- 数字时间 (36 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Afternoon', '下午', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Afternoon' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'April', '四月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'April' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'August', '八月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'August' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Autumn', '秋天', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Autumn' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'December', '十二月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'December' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Eight', '八', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Eight' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Evening', '晚上', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Evening' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'February', '二月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'February' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Five', '五', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Five' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Four', '四', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Four' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Half past', '半点', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Half past' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hour', '小时', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hour' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'January', '一月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'January' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'July', '七月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'July' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'June', '六月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'June' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'March', '三月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'March' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'May', '五月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'May' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Minute', '分钟', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Minute' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Morning', '早上', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Morning' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Night', '夜晚', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Night' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Nine', '九', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Nine' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'November', '十一月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'November' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'O''clock', '整点', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'O''clock' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'October', '十月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'October' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'One', '一', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'One' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Quarter past', '一刻钟', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Quarter past' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Quarter to', '差一刻', 'https://www.totcards.com/img/time-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Quarter to' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'September', '九月', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'September' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Seven', '七', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Seven' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Six', '六', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Six' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Spring', '春天', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Spring' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Summer', '夏天', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Summer' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ten', '十', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ten' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Three', '三', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Three' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Two', '二', 'https://www.totcards.com/img/number-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Two' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Winter', '冬天', 'https://www.totcards.com/img/months-seasons-flashcards.png', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Winter' AND w.category_id = c.id);


