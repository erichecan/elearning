-- 插入水果蔬菜类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Apple', '苹果', '/ˈæpəl/', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop', null, 1, 1),
('Banana', '香蕉', '/bəˈnænə/', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop', null, 1, 1),
('Orange', '橙子', '/ˈɔːrɪndʒ/', 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop', null, 1, 1),
('Strawberry', '草莓', '/ˈstrɔːberi/', 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=300&fit=crop', null, 1, 2),
('Carrot', '胡萝卜', '/ˈkærət/', 'https://images.unsplash.com/photo-1447175008436-170170e8a4d7?w=400&h=300&fit=crop', null, 1, 2),
('Tomato', '西红柿', '/təˈmeɪtoʊ/', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop', null, 1, 2),
('Potato', '土豆', '/pəˈteɪtoʊ/', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop', null, 1, 2),
('Onion', '洋葱', '/ˈʌnjən/', 'https://images.unsplash.com/photo-1518346001043-13fdee3ddf69?w=400&h=300&fit=crop', null, 1, 2),
('Lettuce', '生菜', '/ˈletɪs/', 'https://images.unsplash.com/photo-1556801712-86914437ea81?w=400&h=300&fit=crop', null, 1, 3),
('Broccoli', '西兰花', '/ˈbrɑːkəli/', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop', null, 1, 3);

-- 插入动物世界类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Cat', '猫', '/kæt/', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop', null, 2, 1),
('Dog', '狗', '/dɔːɡ/', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop', null, 2, 1),
('Bird', '鸟', '/bɜːrd/', 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop', null, 2, 1),
('Fish', '鱼', '/fɪʃ/', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', null, 2, 1),
('Elephant', '大象', '/ˈeləfənt/', 'https://images.unsplash.com/photo-1557050543-4d5f2e07c346?w=400&h=300&fit=crop', null, 2, 2),
('Lion', '狮子', '/ˈlaɪən/', 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=400&h=300&fit=crop', null, 2, 2),
('Tiger', '老虎', '/ˈtaɪɡər/', 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop', null, 2, 2),
('Giraffe', '长颈鹿', '/dʒəˈræf/', 'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&h=300&fit=crop', null, 2, 3),
('Penguin', '企鹅', '/ˈpenɡwɪn/', 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=400&h=300&fit=crop', null, 2, 3),
('Dolphin', '海豚', '/ˈdɑːlfɪn/', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop', null, 2, 3);

-- 插入颜色形状类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Red', '红色', '/red/', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', null, 3, 1),
('Blue', '蓝色', '/bluː/', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop', null, 3, 1),
('Green', '绿色', '/ɡriːn/', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', null, 3, 1),
('Yellow', '黄色', '/ˈjeloʊ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 3, 1),
('Purple', '紫色', '/ˈpɜːrpəl/', 'https://images.unsplash.com/photo-1541344179957-b5d8fccf7d37?w=400&h=300&fit=crop', null, 3, 2),
('Orange', '橙色', '/ˈɔːrɪndʒ/', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop', null, 3, 2),
('Circle', '圆形', '/ˈsɜːrkəl/', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', null, 3, 2),
('Square', '正方形', '/skwer/', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', null, 3, 2),
('Triangle', '三角形', '/ˈtraɪæŋɡəl/', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', null, 3, 3),
('Rectangle', '长方形', '/ˈrektæŋɡəl/', 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=300&fit=crop', null, 3, 3);

-- 插入数字时间类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('One', '一', '/wʌn/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 1),
('Two', '二', '/tuː/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 1),
('Three', '三', '/θriː/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 1),
('Four', '四', '/fɔːr/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 1),
('Five', '五', '/faɪv/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 1),
('Six', '六', '/sɪks/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 2),
('Seven', '七', '/ˈsevən/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 2),
('Eight', '八', '/eɪt/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 2),
('Nine', '九', '/naɪn/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 2),
('Ten', '十', '/ten/', 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop', null, 4, 2);

-- 插入家庭成员类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Father', '父亲', '/ˈfɑːðər/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 5, 1),
('Mother', '母亲', '/ˈmʌðər/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 5, 1),
('Brother', '兄弟', '/ˈbrʌðər/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 5, 2),
('Sister', '姐妹', '/ˈsɪstər/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 5, 2),
('Grandfather', '爷爷', '/ˈɡrænfɑːðər/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 5, 3),
('Grandmother', '奶奶', '/ˈɡrænmʌðər/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 5, 3),
('Son', '儿子', '/sʌn/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 5, 2),
('Daughter', '女儿', '/ˈdɔːtər/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 5, 2),
('Uncle', '叔叔', '/ˈʌŋkəl/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 5, 3),
('Aunt', '阿姨', '/ænt/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 5, 3); 