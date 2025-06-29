-- 导入抓取的flashcard数据
-- 生成时间: 2025-06-29T01:41:12.983Z
-- 数据来源: kids-flashcards.com
-- 总单词数: 122


-- 分类: colors (13 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active) 
SELECT * FROM (VALUES
  ('aqua', 'aqua', 'https://kids-flashcards.com/images/en/30/thumbs/aqua.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('black', 'black', 'https://kids-flashcards.com/images/en/30/thumbs/black.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('blue', 'blue', 'https://kids-flashcards.com/images/en/30/thumbs/blue.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('brown', 'brown', 'https://kids-flashcards.com/images/en/30/thumbs/brown.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('gray', 'gray', 'https://kids-flashcards.com/images/en/30/thumbs/gray.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('green', 'green', 'https://kids-flashcards.com/images/en/30/thumbs/green.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('ivory', 'ivory', 'https://kids-flashcards.com/images/en/30/thumbs/ivory.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('khaki', 'khaki', 'https://kids-flashcards.com/images/en/30/thumbs/khaki.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('olive', 'olive', 'https://kids-flashcards.com/images/en/30/thumbs/olive.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('pink', 'pink', 'https://kids-flashcards.com/images/en/30/thumbs/pink.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('red', 'red', 'https://kids-flashcards.com/images/en/30/thumbs/red.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('teal', 'teal', 'https://kids-flashcards.com/images/en/30/thumbs/teal.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true),
  ('white', 'white', 'https://kids-flashcards.com/images/en/30/thumbs/white.webp', (SELECT id FROM categories WHERE name = 'colors'), 1, true)
) AS new_words(word, chinese, image_url, category_id, difficulty_level, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM words 
  WHERE words.word = new_words.word 
  AND words.category_id = new_words.category_id
);


-- 分类: daily_phrases (81 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active) 
SELECT * FROM (VALUES
  ('bench', 'bench', 'https://kids-flashcards.com/images/en/17/thumbs/bench-2831670618175.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('bible', 'bible', 'https://kids-flashcards.com/images/en/58/thumbs/bible.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('big', 'big', 'https://kids-flashcards.com/images/en/43/thumbs/big.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('book', 'book', 'https://kids-flashcards.com/images/en/59/thumbs/book.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('cage', 'cage', 'https://kids-flashcards.com/images/en/17/thumbs/cage.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('chair', 'chair', 'https://kids-flashcards.com/images/en/17/thumbs/chair.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('chalk', 'chalk', 'https://kids-flashcards.com/images/en/59/thumbs/chalk.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('chest', 'chest', 'https://kids-flashcards.com/images/en/17/thumbs/chest.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('clean', 'clean', 'https://kids-flashcards.com/images/en/43/thumbs/clean.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('cold', 'cold', 'https://kids-flashcards.com/images/en/43/thumbs/cold.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('color', 'color', 'https://kids-flashcards.com/images/en/43/thumbs/color.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('couch', 'couch', 'https://kids-flashcards.com/images/en/17/thumbs/couch.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('curly', 'curly', 'https://kids-flashcards.com/images/en/43/thumbs/curly.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('curve', 'curve', 'https://kids-flashcards.com/images/en/43/thumbs/curve.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('dark', 'dark', 'https://kids-flashcards.com/images/en/43/thumbs/dark.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('desk', 'desk', 'https://kids-flashcards.com/images/en/59/thumbs/desk-13451670671459.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('dirty', 'dirty', 'https://kids-flashcards.com/images/en/43/thumbs/dirty.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('drone', 'drone', 'https://kids-flashcards.com/images/en/57/thumbs/drone.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('dry', 'dry', 'https://kids-flashcards.com/images/en/43/thumbs/dry.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('dull', 'dull', 'https://kids-flashcards.com/images/en/43/thumbs/dull.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('empty', 'empty', 'https://kids-flashcards.com/images/en/43/thumbs/empty.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('fast', 'fast', 'https://kids-flashcards.com/images/en/43/thumbs/fast.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('fat', 'fat', 'https://kids-flashcards.com/images/en/43/thumbs/fat.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('few', 'few', 'https://kids-flashcards.com/images/en/43/thumbs/few.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('flat', 'flat', 'https://kids-flashcards.com/images/en/43/thumbs/flat.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('full', 'full', 'https://kids-flashcards.com/images/en/43/thumbs/full.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('globe', 'globe', 'https://kids-flashcards.com/images/en/59/thumbs/globe.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('glue', 'glue', 'https://kids-flashcards.com/images/en/59/thumbs/glue.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('gym', 'gym', 'https://kids-flashcards.com/images/en/60/thumbs/gym.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('hall', 'hall', 'https://kids-flashcards.com/images/en/60/thumbs/hall.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('happy', 'happy', 'https://kids-flashcards.com/images/en/43/thumbs/happy.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('heavy', 'heavy', 'https://kids-flashcards.com/images/en/43/thumbs/heavy.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('hen', 'hen', 'https://kids-flashcards.com/images/en/58/thumbs/hen-13201650221709.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('high', 'high', 'https://kids-flashcards.com/images/en/43/thumbs/high.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('hot', 'hot', 'https://kids-flashcards.com/images/en/43/thumbs/hot.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('icon', 'icon', 'https://kids-flashcards.com/images/en/58/thumbs/icon.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('kind', 'kind', 'https://kids-flashcards.com/images/en/43/thumbs/kind.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('lab', 'lab', 'https://kids-flashcards.com/images/en/60/thumbs/lab.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('left', 'left', 'https://kids-flashcards.com/images/en/43/thumbs/left.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('lens', 'lens', 'https://kids-flashcards.com/images/en/57/thumbs/lens-12971641028825.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('light', 'light', 'https://kids-flashcards.com/images/en/43/thumbs/light.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('lily', 'lily', 'https://kids-flashcards.com/images/en/58/thumbs/lily.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('long', 'long', 'https://kids-flashcards.com/images/en/43/thumbs/long.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('low', 'low', 'https://kids-flashcards.com/images/en/43/thumbs/low.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('many', 'many', 'https://kids-flashcards.com/images/en/43/thumbs/many.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('new', 'new', 'https://kids-flashcards.com/images/en/43/thumbs/new.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('old', 'old', 'https://kids-flashcards.com/images/en/43/thumbs/old.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('open', 'open', 'https://kids-flashcards.com/images/en/43/thumbs/open.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('pen', 'pen', 'https://kids-flashcards.com/images/en/59/thumbs/pen.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('phone', 'phone', 'https://kids-flashcards.com/images/en/57/thumbs/phone.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('pool', 'pool', 'https://kids-flashcards.com/images/en/60/thumbs/pool-13831679157249.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('poor', 'poor', 'https://kids-flashcards.com/images/en/43/thumbs/poor.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('pouf', 'pouf', 'https://kids-flashcards.com/images/en/17/thumbs/pouf.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('pupil', 'pupil', 'https://kids-flashcards.com/images/en/59/thumbs/pupil.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('real', 'real', 'https://kids-flashcards.com/images/en/43/thumbs/real.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('rich', 'rich', 'https://kids-flashcards.com/images/en/43/thumbs/rich.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('right', 'right', 'https://kids-flashcards.com/images/en/43/thumbs/right.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('ripe', 'ripe', 'https://kids-flashcards.com/images/en/43/thumbs/ripe.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('ruler', 'ruler', 'https://kids-flashcards.com/images/en/59/thumbs/ruler.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('sad', 'sad', 'https://kids-flashcards.com/images/en/43/thumbs/sad.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('safe', 'safe', 'https://kids-flashcards.com/images/en/17/thumbs/safe.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('sharp', 'sharp', 'https://kids-flashcards.com/images/en/43/thumbs/sharp.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('short', 'short', 'https://kids-flashcards.com/images/en/43/thumbs/short.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('slim', 'slim', 'https://kids-flashcards.com/images/en/43/thumbs/slim.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('slow', 'slow', 'https://kids-flashcards.com/images/en/43/thumbs/slow.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('small', 'small', 'https://kids-flashcards.com/images/en/43/thumbs/small.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('sofa', 'sofa', 'https://kids-flashcards.com/images/en/17/thumbs/sofa.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('soft', 'soft', 'https://kids-flashcards.com/images/en/43/thumbs/soft.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('sour', 'sour', 'https://kids-flashcards.com/images/en/43/thumbs/sour.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('stool', 'stool', 'https://kids-flashcards.com/images/en/17/thumbs/stool.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('sweet', 'sweet', 'https://kids-flashcards.com/images/en/43/thumbs/sweet.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('table', 'table', 'https://kids-flashcards.com/images/en/17/thumbs/table.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('thick', 'thick', 'https://kids-flashcards.com/images/en/43/thumbs/thick.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('thin', 'thin', 'https://kids-flashcards.com/images/en/43/thumbs/thin.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('tough', 'tough', 'https://kids-flashcards.com/images/en/43/thumbs/tough.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('tv', 'tv', 'https://kids-flashcards.com/images/en/57/thumbs/tv.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('ugly', 'ugly', 'https://kids-flashcards.com/images/en/43/thumbs/ugly.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('upper', 'upper', 'https://kids-flashcards.com/images/en/43/thumbs/upper.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('wet', 'wet', 'https://kids-flashcards.com/images/en/43/thumbs/wet.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('wine', 'wine', 'https://kids-flashcards.com/images/en/58/thumbs/wine.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true),
  ('young', 'young', 'https://kids-flashcards.com/images/en/43/thumbs/young.webp', (SELECT id FROM categories WHERE name = 'daily_phrases'), 1, true)
) AS new_words(word, chinese, image_url, category_id, difficulty_level, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM words 
  WHERE words.word = new_words.word 
  AND words.category_id = new_words.category_id
);


-- 分类: food (4 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active) 
SELECT * FROM (VALUES
  ('jar', 'jar', 'https://kids-flashcards.com/images/en/19/thumbs/jar.webp', (SELECT id FROM categories WHERE name = 'food'), 1, true),
  ('ladle', 'ladle', 'https://kids-flashcards.com/images/en/19/thumbs/ladle.webp', (SELECT id FROM categories WHERE name = 'food'), 1, true),
  ('pot', 'pot', 'https://kids-flashcards.com/images/en/19/thumbs/pot.webp', (SELECT id FROM categories WHERE name = 'food'), 1, true),
  ('whisk', 'whisk', 'https://kids-flashcards.com/images/en/19/thumbs/whisk.webp', (SELECT id FROM categories WHERE name = 'food'), 1, true)
) AS new_words(word, chinese, image_url, category_id, difficulty_level, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM words 
  WHERE words.word = new_words.word 
  AND words.category_id = new_words.category_id
);


-- 分类: fruits (14 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active) 
SELECT * FROM (VALUES
  ('apple', 'apple', 'https://kids-flashcards.com/images/en/8/thumbs/apple.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('beet', 'beet', 'https://kids-flashcards.com/images/en/9/thumbs/beet.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('corn', 'corn', 'https://kids-flashcards.com/images/en/9/thumbs/corn.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('dates', 'dates', 'https://kids-flashcards.com/images/en/8/thumbs/dates.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('guava', 'guava', 'https://kids-flashcards.com/images/en/8/thumbs/guava.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('kiwi', 'kiwi', 'https://kids-flashcards.com/images/en/8/thumbs/kiwi.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('lemon', 'lemon', 'https://kids-flashcards.com/images/en/8/thumbs/lemon.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('lime', 'lime', 'https://kids-flashcards.com/images/en/8/thumbs/lime.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('mango', 'mango', 'https://kids-flashcards.com/images/en/8/thumbs/mango.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('onion', 'onion', 'https://kids-flashcards.com/images/en/9/thumbs/onion.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('peach', 'peach', 'https://kids-flashcards.com/images/en/8/thumbs/peach.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('pear', 'pear', 'https://kids-flashcards.com/images/en/8/thumbs/pear.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('peas', 'peas', 'https://kids-flashcards.com/images/en/9/thumbs/garden-pea.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true),
  ('plum', 'plum', 'https://kids-flashcards.com/images/en/8/thumbs/plum.webp', (SELECT id FROM categories WHERE name = 'fruits'), 1, true)
) AS new_words(word, chinese, image_url, category_id, difficulty_level, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM words 
  WHERE words.word = new_words.word 
  AND words.category_id = new_words.category_id
);


-- 分类: numbers (10 个单词)
INSERT INTO words (word, chinese, image_url, category_id, difficulty_level, is_active) 
SELECT * FROM (VALUES
  ('eight', 'eight', 'https://kids-flashcards.com/images/en/36/thumbs/eight.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('five', 'five', 'https://kids-flashcards.com/images/en/36/thumbs/five.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('four', 'four', 'https://kids-flashcards.com/images/en/36/thumbs/four.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('nine', 'nine', 'https://kids-flashcards.com/images/en/36/thumbs/nine.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('one', 'one', 'https://kids-flashcards.com/images/en/36/thumbs/one-6871667672924.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('seven', 'seven', 'https://kids-flashcards.com/images/en/36/thumbs/seven-6931667656549.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('six', 'six', 'https://kids-flashcards.com/images/en/36/thumbs/six.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('ten', 'ten', 'https://kids-flashcards.com/images/en/36/thumbs/ten.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('three', 'three', 'https://kids-flashcards.com/images/en/36/thumbs/three-6891667672924.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true),
  ('two', 'two', 'https://kids-flashcards.com/images/en/36/thumbs/two-6881667656549.webp', (SELECT id FROM categories WHERE name = 'numbers'), 1, true)
) AS new_words(word, chinese, image_url, category_id, difficulty_level, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM words 
  WHERE words.word = new_words.word 
  AND words.category_id = new_words.category_id
);

