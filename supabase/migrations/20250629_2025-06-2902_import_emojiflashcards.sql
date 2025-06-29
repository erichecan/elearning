-- EmojiFlashcards数据导入
-- 导入时间: 2025-06-29T02:08:47.312Z
-- 来源: emojiflashcards.com
-- 包含: 384个单词 (动物、食物、颜色、数字、字母、服装、交通、家庭、天气)

-- 动物世界 (91 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ant', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f41c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ant' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Badger', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a1.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Badger' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f987.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bear', '熊', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f43b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bear' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Beaver', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9ab.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Beaver' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bee', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f41d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bee' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Beetle', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fab2.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Beetle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bird', '鸟', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f426.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bird' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bison', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9ac.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bison' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Black cat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f408-200d-2b1b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Black cat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Boar', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f417.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Boar' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Butterfly', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f98b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Butterfly' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Camel', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f42b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Camel' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cat', '猫', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f408.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Caterpillar', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f41b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Caterpillar' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Chicken', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f413.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Chicken' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cow', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f42e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cow' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Crab', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f980.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Crab' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cricket', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f997.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cricket' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Crocodile', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f40a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Crocodile' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Deer', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f98c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Deer' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Dodo', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a4.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Dodo' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Dog', '狗', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f436.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Dog' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Dolphin', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f42c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Dolphin' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Dragon', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f409.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Dragon' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Duck', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f986.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Duck' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Elephant', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f418.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Elephant' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f41c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fish', '鱼', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f420.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fish' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Flamingo', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a9.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Flamingo' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fly', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fab0.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fly' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fox', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f98a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fox' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Frog', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f438.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Frog' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Giraffe', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f992.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Giraffe' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Goat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f410.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Goat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Gorilla', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f98d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Gorilla' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hamster', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f439.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hamster' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hedgehog', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f994.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hedgehog' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hippopotamus', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f99b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hippopotamus' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Horse', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f434.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Horse' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Kangaroo', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f998.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Kangaroo' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Koala', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f428.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Koala' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ladybug', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f41e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ladybug' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Leopard', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f406.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Leopard' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Lion', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f981.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Lion' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Lizard', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f98e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Lizard' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Llama', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f999.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Llama' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Lobster', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f99e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Lobster' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Mammoth', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Mammoth' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Microbe', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a0.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Microbe' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Monkey', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f435.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Monkey' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Mosquito', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f99f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Mosquito' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Mouse', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f42d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Mouse' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Octopus', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f419.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Octopus' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Orangutan', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a7.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Orangutan' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Otter', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a6.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Otter' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Owl', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f989.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Owl' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ox', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f402.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ox' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Panda', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f43c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Panda' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Parrot', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f99c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Parrot' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Peacock', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f99a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Peacock' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Penguin', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f427.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Penguin' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pig', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f437.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pig' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Polar bear', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f43b-200d-2744-fe0f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Polar bear' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Poodle', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f429.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Poodle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Present', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2795.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Present' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rabbit', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f430.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rabbit' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Raccoon', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f99d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Raccoon' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f400.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rhinoceros', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f98f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rhinoceros' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Scorpion', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f982.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Scorpion' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Seal', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9ad.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Seal' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Shark', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f988.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Shark' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sheep', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f40f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sheep' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Shrimp', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f990.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Shrimp' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Skunk', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a8.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Skunk' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sloth', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a5.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sloth' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Snail', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f40c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Snail' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Snake', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f40d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Snake' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Spider', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f577.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Spider' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Squid', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f991.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Squid' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Squirrel', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f43f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Squirrel' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Swan', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9a2.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Swan' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Tiger', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f405.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Tiger' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Tortoise', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f422.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Tortoise' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Turkey', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f983.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Turkey' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Unicorn', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f984.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Unicorn' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Whale', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f433.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Whale' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Wolf', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f43a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Wolf' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Worm', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fab1.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Worm' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Zebra', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f993.svg', c.id, 1, true
FROM categories c WHERE c.name = 'animals'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Zebra' AND w.category_id = c.id);


-- 服装配饰 (34 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bikini', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f459.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bikini' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Boot', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f462.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Boot' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cap', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9e2.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cap' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Clutch', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f45d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Clutch' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Crown', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f451.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Crown' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Dress', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f457.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Dress' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f459.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Glasses', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f453.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Glasses' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Gloves', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9e4.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Gloves' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Handbag', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f45c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Handbag' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f452.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'High-heeled shoe', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f460.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'High-heeled shoe' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hiking boot', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f97e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hiking boot' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Jacket', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9e5.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Jacket' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Jersey', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f3bd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Jersey' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Kimono', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f458.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Kimono' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pants', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f456.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pants' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Present', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2795.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Present' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Purse', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f45b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Purse' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ring', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f48d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ring' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sandal', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f461.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sandal' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sari', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f97b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sari' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Scarf', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Scarf' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Shirt', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f45a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Shirt' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Shirt and tie', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f454.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Shirt and tie' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Shoe', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f45e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Shoe' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Shorts', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fa73.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Shorts' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sneaker', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f45f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sneaker' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Socks', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9e6.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Socks' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sunglasses', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f576.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sunglasses' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Swimsuit', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fa71.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Swimsuit' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'T-shirt', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f455.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'T-shirt' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Top hat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f3a9.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Top hat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Umbrella', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2602.svg', c.id, 1, true
FROM categories c WHERE c.name = 'clothes'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Umbrella' AND w.category_id = c.id);


-- 颜色形状 (20 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Black', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/26ab.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Black' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Blue', '蓝色', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjUyLCJwdXIiOiJibG9iX2lkIn19--21afe48fdf9ea15d47499ea6f1f38b2d054b94b4/blue-ao.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Blue' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Blue green', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjQ2LCJwdXIiOiJibG9iX2lkIn19--8286f0360f924793d7cd658e2fd5ec8cf8dc5812/turquoise-aomidori.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Blue green' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Brown', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f3ff.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Brown' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Circle', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjUyLCJwdXIiOiJibG9iX2lkIn19--21afe48fdf9ea15d47499ea6f1f38b2d054b94b4/blue-ao.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Circle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Dark green', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjQ4LCJwdXIiOiJibG9iX2lkIn19--e6430666bb38bb7aedffa710e7044cba54b5fbaa/dark-green-fukamidori.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Dark green' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f49a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Gold', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjQyLCJwdXIiOiJibG9iX2lkIn19--3b64eb6c056cf57d6f7aef8c26075b828bdbeb2e/gold-giniro.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Gold' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Gray', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTk0LCJwdXIiOiJibG9iX2lkIn19--b083373206fdacbda5205c85dcfd456fb94f4348/grey.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Gray' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Green', '绿色', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f49a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Green' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Light green', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjQ3LCJwdXIiOiJibG9iX2lkIn19--2f5809722f3ae3372252f40ea84e3f16697bf25d/light-green-kimidori.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Light green' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Orange', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjUzLCJwdXIiOiJibG9iX2lkIn19--c4778668c3e3b9f41d108393db67d3c6ae695ab5/orange-orenji.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Orange' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Peach', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjQ5LCJwdXIiOiJibG9iX2lkIn19--279fc6d85308150284ad0d13938ac76d6805a5e8/peach-momo-iro.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Peach' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pink', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTkzLCJwdXIiOiJibG9iX2lkIn19--c44076316ea420483f4295ad521d1036d094053b/pink.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pink' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Purple', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f49c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Purple' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Red', '红色', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f534.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Red' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Silver', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjQzLCJwdXIiOiJibG9iX2lkIn19--2805f124f441e004d025f937fad3f9e0886fd51b/silver-giniro.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Silver' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sky blue', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MjQ1LCJwdXIiOiJibG9iX2lkIn19--cdd2630a47404aa71b752f1eb11fc93d16da7e8c/sky-blue-mizuiro.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sky blue' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'White', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/25fb.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'White' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Yellow', '黄色', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f49b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'colors'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Yellow' AND w.category_id = c.id);


-- 日常短语 (54 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'A', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDk0LCJwdXIiOiJibG9iX2lkIn19--24a4a2da792e5879f806d1ef2e9657b1a35091ef/roman-lower-a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'A' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'A a', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f34e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'A a' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'B', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDk1LCJwdXIiOiJibG9iX2lkIn19--9a52c86b5f174851d758769272d8fd8db923dc77/roman-lower-b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'B' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'B b', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f4d7.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'B b' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'C', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDk2LCJwdXIiOiJibG9iX2lkIn19--ae3ce9be134169f4adfb0d765a98ad9166b51014/roman-lower-c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'C' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'C c', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f408.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'C c' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'D', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDk3LCJwdXIiOiJibG9iX2lkIn19--e024c272baadb71b557c6a1e4dd7034acdc2f31e/roman-lower-d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'D' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'D d', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f436.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'D d' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'E', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDk4LCJwdXIiOiJibG9iX2lkIn19--ec024bb79f3ebf30fd913f1e57c954551605d166/roman-lower-e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'E' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'E e', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f418.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'E e' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f34e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'F', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NDk5LCJwdXIiOiJibG9iX2lkIn19--8b29371f834e660399780f8776a98ddfbef71ae1/roman-lower-f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'F' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'F f', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f41f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'F f' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'G', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTAwLCJwdXIiOiJibG9iX2lkIn19--5979f5ea36a0ea90fe698ca8faf73bbd3b51aeb4/roman-lower-g.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'G' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'G g', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9e4.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'G g' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'H', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTAxLCJwdXIiOiJibG9iX2lkIn19--f675d6bfa7994be455fc81187e55382e51426f1e/roman-lower-h.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'H' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'H h', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f452.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'H h' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'I', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTAyLCJwdXIiOiJibG9iX2lkIn19--65bb06221da4c75265e3ad6a0f19db6f40a1067b/roman-lower-i.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'I' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'I i', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f41b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'I i' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'J', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTAzLCJwdXIiOiJibG9iX2lkIn19--c8a160c1a875d2c1a94c9b60214e0f37954b99c1/roman-lower-j.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'J' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'J j', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'J j' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'K', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTA0LCJwdXIiOiJibG9iX2lkIn19--015654c2dc5380a4efe847ec831bafc1365df289/roman-lower-k.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'K' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'K k', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f998.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'K k' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'L', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTA1LCJwdXIiOiJibG9iX2lkIn19--b47ffccce5e3f985c77858815f6d7fb3c73171e5/roman-lower-l.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'L' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'L l', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f981.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'L l' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'M', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTA2LCJwdXIiOiJibG9iX2lkIn19--587e3ab8bf71b803dc8759f4b586cfb29e8390f9/roman-lower-m.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'M' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'M m', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f31d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'M m' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'N', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTA3LCJwdXIiOiJibG9iX2lkIn19--37f7d35be4bef3631009b509ffe991405819164e/roman-lower-n.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'N' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'N n', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f95c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'N n' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'O', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTA4LCJwdXIiOiJibG9iX2lkIn19--fa2dc7756fbf90e49c05a40e72d3e7bbdf939cbf/roman-lower-o.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'O' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'O o', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f419.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'O o' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'P', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTA5LCJwdXIiOiJibG9iX2lkIn19--f21ac1a2702b3f1873723225f89d39603ea77495/roman-lower-p.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'P' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'P p', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f58a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'P p' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Present', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2795.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Present' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Q', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTEwLCJwdXIiOiJibG9iX2lkIn19--57a3cad4735421fd21a09d982b73653ad8c540b4/roman-lower-q.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Q' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Q q', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f478-1f3fd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Q q' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'R', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTExLCJwdXIiOiJibG9iX2lkIn19--b3f44e8b4b12f97ec9a3def27f644e23a23dab1d/roman-lower-r.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'R' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'R r', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f308.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'R r' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'S', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTEyLCJwdXIiOiJibG9iX2lkIn19--594dbf7743914779ddee28aed7447f481b39f0a7/roman-lower-s.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'S' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'S s', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f40d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'S s' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'T', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTEzLCJwdXIiOiJibG9iX2lkIn19--8809c18ab48632ce66f1b1b3d20a5cb7e59ba740/roman-lower-t.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'T' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'T t', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f42f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'T t' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'U', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTE0LCJwdXIiOiJibG9iX2lkIn19--7248acbd98326cdaeb5ccd32a02fc4ee12af2da8/roman-lower-u.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'U' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'U u', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f302.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'U u' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'V', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTE1LCJwdXIiOiJibG9iX2lkIn19--b2a2107d0d6772bf00ee5fe9d1fd22cc3ed5a622/roman-lower-v.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'V' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'V v', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f30b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'V v' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'W', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTE2LCJwdXIiOiJibG9iX2lkIn19--94aeffce8800f2b009ea9e1cf538e1e5b4911724/roman-lower-w.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'W' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'W w', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f433.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'W w' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'X', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTE3LCJwdXIiOiJibG9iX2lkIn19--851eb960c626d1ee66254f68f6d1b9aedacfe02c/roman-lower-x.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'X' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'X x', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f98a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'X x' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Y', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTE4LCJwdXIiOiJibG9iX2lkIn19--a1eebcd57e9f6646ebdb7ec628794c24605a0eab/roman-lower-y.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Y' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Y y', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fa80.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Y y' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Z', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6NTE5LCJwdXIiOiJibG9iX2lkIn19--05597ee37dac03a6cc61bb8085bab9c73b066e79/roman-lower-z.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Z' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Z z', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f993.svg', c.id, 1, true
FROM categories c WHERE c.name = 'daily_phrases'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Z z' AND w.category_id = c.id);


-- 家庭成员 (8 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Brother', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f466-1f3fd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'family'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Brother' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f468-200d-1f469-200d-1f467-200d-1f466.svg', c.id, 1, true
FROM categories c WHERE c.name = 'family'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Family', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f468-200d-1f469-200d-1f467-200d-1f466.svg', c.id, 1, true
FROM categories c WHERE c.name = 'family'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Family' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Father', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f468-1f3fd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'family'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Father' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Grandfather', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f474-1f3fd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'family'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Grandfather' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Grandmother', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f475-1f3fd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'family'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Grandmother' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Mother', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f469-1f3fd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'family'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Mother' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sister', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f467-1f3fd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'family'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sister' AND w.category_id = c.id);


-- 美食餐具 (99 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Apple', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f34e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Apple' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Avocado', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f951.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Avocado' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bacon', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f953.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bacon' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bagel', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f96f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bagel' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Banana', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f34c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Banana' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Beans', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fad8.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Beans' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bell pepper', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fad1.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bell pepper' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Birthday cake', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f382.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Birthday cake' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Blueberries', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fad0.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Blueberries' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bread', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f35e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bread' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Broccoli', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f966.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Broccoli' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bubble tea', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9cb.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bubble tea' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Burrito', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f32f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Burrito' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Butter', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c8.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Butter' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cake', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f370.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cake' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Candy', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f36c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Candy' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Carrot', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f955.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Carrot' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cheese', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c0.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cheese' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cherries', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f352.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cherries' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Chestnut', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f330.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Chestnut' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Chicken', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f357.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Chicken' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Chili', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f336.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Chili' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Chocolate', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f36b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Chocolate' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Coconut', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f965.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Coconut' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Coffee', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2615.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Coffee' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Collection', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fad8.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Collection' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cookie', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f36a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cookie' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Corn', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f33d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Corn' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Croissant', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f950.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Croissant' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cucumber', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f952.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cucumber' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cupcake', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c1.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cupcake' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Curry and rice', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f35b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Curry and rice' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Dango', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f361.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Dango' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Doughnut', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f369.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Doughnut' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Dumpling', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f95f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Dumpling' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Egg', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f95a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Egg' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Eggplant', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f346.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Eggplant' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f951.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Falafel', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c6.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Falafel' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fish cake', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f365.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fish cake' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Flatbread', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fad3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Flatbread' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fondue', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fad5.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fondue' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fortune cookie', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f960.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fortune cookie' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'French bread', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f956.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'French bread' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'French fries', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f35f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'French fries' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fried egg', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f373.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fried egg' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fried shrimp', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f364.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fried shrimp' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Garlic', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c4.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Garlic' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Grapes', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f347.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Grapes' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Green tea', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f375.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Green tea' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Gyro', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f959.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Gyro' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hamburger', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f354.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hamburger' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Honey', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f36f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Honey' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hot dog', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f32d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hot dog' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ice', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9ca.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ice' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ice cream', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f368.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ice cream' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Juice', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Juice' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Kiwi', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f95d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Kiwi' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Lemon', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f34b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Lemon' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Lettuce', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f96c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Lettuce' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Lollipop', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f36d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Lollipop' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Mango', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f96d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Mango' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Maté', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c9.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Maté' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Meat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f356.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Meat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Mooncake', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f96e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Mooncake' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Mushroom', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f344.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Mushroom' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Oden', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f362.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Oden' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Olives', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fad2.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Olives' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Onion', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c5.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Onion' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Orange', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f34a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Orange' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pancakes', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f95e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pancakes' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Peach', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f351.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Peach' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Peanut', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f95c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Peanut' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pear', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f350.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pear' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pineapple', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f34d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pineapple' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pizza', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f355.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pizza' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Popcorn', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f37f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Popcorn' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Potato', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f954.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Potato' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Present', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2795.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Present' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Pretzel', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f968.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Pretzel' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ramen', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f35c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ramen' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rice', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f35a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rice' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rice ball', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f359.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rice ball' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rice cracker', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f358.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rice cracker' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Salad', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f957.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Salad' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Salt', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c2.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Salt' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sandwich', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f96a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sandwich' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Shaved ice', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f367.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Shaved ice' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Spaghetti', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f35d.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Spaghetti' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Steak', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f969.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Steak' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Strawberry', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f353.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Strawberry' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sushi', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f363.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sushi' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Taco', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f32e.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Taco' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Tamale', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1fad4.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Tamale' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Tomato', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f345.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Tomato' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Waffle', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f9c7.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Waffle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Water', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f964.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Water' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Watermelon', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f349.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Watermelon' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Yam', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f360.svg', c.id, 1, true
FROM categories c WHERE c.name = 'food'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Yam' AND w.category_id = c.id);


-- 自然天气 (14 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cloudy', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2601.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cloudy' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cold', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f976.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cold' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2600.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Foggy', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f32b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Foggy' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Hot', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f975.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Hot' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Lightning', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f329.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Lightning' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Partly cloudy', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/26c5.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Partly cloudy' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rainbow', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f308.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rainbow' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rainy', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f327.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rainy' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Snowy', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f328.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Snowy' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Stormy', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/26c8.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Stormy' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sunny', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2600.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sunny' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Tornado', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f32a.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Tornado' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Windy', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f32c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'nature'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Windy' AND w.category_id = c.id);


-- 数字时间 (31 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Eight', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/38-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Eight' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Eighteen', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTUsInB1ciI6ImJsb2JfaWQifX0=--7b4a045d6c4d6e6f9b2a5a943ef56040e1d7f26e/numbers-18.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Eighteen' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Eighty', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTAzLCJwdXIiOiJibG9iX2lkIn19--ce29581d2549309e1253b25057be542e4d8c8541/numbers-80.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Eighty' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Eleven', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6ODgsInB1ciI6ImJsb2JfaWQifX0=--6c65ea593e9ef87363c27aa4c87fd43cf51eccbd/numbers-11.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Eleven' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/30-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fifteen', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTIsInB1ciI6ImJsb2JfaWQifX0=--1300d8d449a0d6d38bf5857e0596ffa1a4fbc0dc/numbers-15.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fifteen' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fifty', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTAwLCJwdXIiOiJibG9iX2lkIn19--a2503443d109fa9bc99f8d990cbe6a44b095f2a0/numbers-50.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fifty' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Five', '五', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/35-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Five' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Forty', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTksInB1ciI6ImJsb2JfaWQifX0=--af9f8816ef992485a1e6834a7b35030b0f6dd0af/numbers-40.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Forty' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Four', '四', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/34-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Four' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fourteen', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTEsInB1ciI6ImJsb2JfaWQifX0=--13ecd1e901e2f912b8dc5f96a9642eac9c4b46b9/numbers-14.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fourteen' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Nine', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/39-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Nine' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Nineteen', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTYsInB1ciI6ImJsb2JfaWQifX0=--89ed360fdf1982b98502dfb8c4eccf48775d3c7d/numbers-19.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Nineteen' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ninety', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTA0LCJwdXIiOiJibG9iX2lkIn19--abd3f6b7fa5e5d05aaacd7f458f014efba11ca35/numbers-90.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ninety' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'One', '一', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/31-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'One' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'One hundred', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f4af.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'One hundred' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Present', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/2795.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Present' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Seven', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/37-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Seven' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Seventeen', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTQsInB1ciI6ImJsb2JfaWQifX0=--d643ddb9211a50dc534a03311e2c001286695412/numbers-17.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Seventeen' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Seventy', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTAyLCJwdXIiOiJibG9iX2lkIn19--8d99aa9d1454f5e35f05c2a3bc7fbeb3c6eed20e/numbers-70.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Seventy' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Six', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/36-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Six' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sixteen', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTMsInB1ciI6ImJsb2JfaWQifX0=--bcf572e82e8215cdb02962ec7875d2e99108da66/numbers-16.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sixteen' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sixty', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6MTAxLCJwdXIiOiJibG9iX2lkIn19--86a48130f162cb24d18accc404becc8a4c2cb9f2/numbers-60.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sixty' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ten', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f51f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ten' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Thirteen', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTAsInB1ciI6ImJsb2JfaWQifX0=--ca063baa66ada6bbe84dc0a2b55109a3ff860115/numbers-13.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Thirteen' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Thirty', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTgsInB1ciI6ImJsb2JfaWQifX0=--9790b622ed02d3f9244d51cadf49916cf9f7e47f/numbers-30.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Thirty' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Three', '三', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/33-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Three' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Twelve', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6ODksInB1ciI6ImJsb2JfaWQifX0=--6f635368efa13f024d3af8dc77e08063a4fd9eb9/numbers-12.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Twelve' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Twenty', '', 'https://emojiflashcards.com/rails/active_storage/blobs/proxy/eyJfcmFpbHMiOnsiZGF0YSI6OTcsInB1ciI6ImJsb2JfaWQifX0=--fdf0ee37b132bc69d4a0284e4a084a08fd966acc/numbers-20.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Twenty' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Two', '二', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/32-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Two' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Zero', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/30-20e3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'numbers'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Zero' AND w.category_id = c.id);


-- 交通工具 (33 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Airplane', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6eb.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Airplane' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ambulance', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f691.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ambulance' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bicycle', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6b2.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bicycle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Boat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6a3-1f3fe-200d-2640-fe0f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Boat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bullet train', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f686.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bullet train' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Bus', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f68c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Bus' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Cable car', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6a0.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Cable car' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Car', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f697.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Car' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Collection', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6a3-1f3fe-200d-2640-fe0f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Collection' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Emoji', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6eb.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Emoji' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ferry', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/26f4.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ferry' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Fire truck', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f692.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Fire truck' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Helicopter', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f681.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Helicopter' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Jeep', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f699.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Jeep' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Light aircraft', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6e9.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Light aircraft' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Monorail', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f69f.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Monorail' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Motorcycle', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f3cd.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Motorcycle' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Police car', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f693.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Police car' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Racing car', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f3ce.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Racing car' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rocket', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f680.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rocket' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Rv', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f690.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Rv' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sailboat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/26f5.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sailboat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Scooter', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6f4.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Scooter' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Ship', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6f3.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Ship' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Sled', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6f7.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Sled' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Spaceship', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6f8.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Spaceship' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Speedboat', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f6a4.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Speedboat' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Steam engine', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f682.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Steam engine' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Street car', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f68b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Street car' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Taxi', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f695.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Taxi' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Tractor', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f69c.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Tractor' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Train', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f683.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Train' AND w.category_id = c.id);

INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active)
SELECT 'Truck', '', 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.0.2/assets/svg/1f69b.svg', c.id, 1, true
FROM categories c WHERE c.name = 'transport'
AND NOT EXISTS (SELECT 1 FROM words w WHERE w.word = 'Truck' AND w.category_id = c.id);


