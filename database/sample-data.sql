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

-- 插入身体部位类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Head', '头', '/hed/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 6, 1),
('Eye', '眼睛', '/aɪ/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 6, 1),
('Nose', '鼻子', '/noʊz/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 6, 1),
('Mouth', '嘴巴', '/maʊθ/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 6, 1),
('Ear', '耳朵', '/ɪr/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 6, 1),
('Hand', '手', '/hænd/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 6, 2),
('Foot', '脚', '/fʊt/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 6, 2),
('Arm', '手臂', '/ɑːrm/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 6, 2),
('Leg', '腿', '/leɡ/', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', null, 6, 2),
('Hair', '头发', '/her/', 'https://images.unsplash.com/photo-1494790108755-2616c2e930a8?w=400&h=300&fit=crop', null, 6, 2);

-- 插入服装配饰类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Shirt', '衬衫', '/ʃɜːrt/', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', null, 7, 1),
('Pants', '裤子', '/pænts/', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop', null, 7, 1),
('Shoes', '鞋子', '/ʃuːz/', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop', null, 7, 1),
('Hat', '帽子', '/hæt/', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=300&fit=crop', null, 7, 1),
('Socks', '袜子', '/sɑːks/', 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c8a?w=400&h=300&fit=crop', null, 7, 2),
('Dress', '裙子', '/dres/', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop', null, 7, 2),
('Jacket', '夹克', '/ˈdʒækɪt/', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop', null, 7, 2),
('Bag', '包', '/bæɡ/', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop', null, 7, 2),
('Glasses', '眼镜', '/ˈɡlæsɪz/', 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=300&fit=crop', null, 7, 3),
('Watch', '手表', '/wɑːtʃ/', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop', null, 7, 3);

-- 插入美食餐具类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Rice', '米饭', '/raɪs/', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', null, 8, 1),
('Bread', '面包', '/bred/', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', null, 8, 1),
('Milk', '牛奶', '/mɪlk/', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', null, 8, 1),
('Egg', '鸡蛋', '/eɡ/', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=300&fit=crop', null, 8, 1),
('Chicken', '鸡肉', '/ˈtʃɪkɪn/', 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop', null, 8, 2),
('Fish', '鱼', '/fɪʃ/', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', null, 8, 2),
('Fork', '叉子', '/fɔːrk/', 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=300&fit=crop', null, 8, 2),
('Knife', '刀子', '/naɪf/', 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=300&fit=crop', null, 8, 2),
('Plate', '盘子', '/pleɪt/', 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=300&fit=crop', null, 8, 2),
('Cup', '杯子', '/kʌp/', 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=400&h=300&fit=crop', null, 8, 3);

-- 插入交通工具类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Car', '汽车', '/kɑːr/', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop', null, 9, 1),
('Bus', '公交车', '/bʌs/', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop', null, 9, 1),
('Bike', '自行车', '/baɪk/', 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop', null, 9, 1),
('Train', '火车', '/treɪn/', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop', null, 9, 2),
('Plane', '飞机', '/pleɪn/', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop', null, 9, 2),
('Boat', '船', '/boʊt/', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', null, 9, 2),
('Truck', '卡车', '/trʌk/', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop', null, 9, 3),
('Motorcycle', '摩托车', '/ˈmoʊtərsaɪkl/', 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400&h=300&fit=crop', null, 9, 3),
('Helicopter', '直升机', '/ˈhelɪkɑːptər/', 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop', null, 9, 3),
('Subway', '地铁', '/ˈsʌbweɪ/', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop', null, 9, 3);

-- 插入自然天气类单词
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Sun', '太阳', '/sʌn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 10, 1),
('Moon', '月亮', '/muːn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 10, 1),
('Star', '星星', '/stɑːr/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 10, 1),
('Cloud', '云', '/klaʊd/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 10, 1),
('Rain', '雨', '/reɪn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 10, 2),
('Snow', '雪', '/snoʊ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 10, 2),
('Wind', '风', '/wɪnd/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 10, 2),
('Tree', '树', '/triː/', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', null, 10, 2),
('Flower', '花', '/ˈflaʊər/', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', null, 10, 2),
('Grass', '草', '/ɡræs/', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', null, 10, 3);

-- 插入日常短语类数据
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Good morning', '早上好', '/ɡʊd ˈmɔːrnɪŋ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 1),
('Good night', '晚安', '/ɡʊd naɪt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 1),
('Thank you', '谢谢', '/θæŋk juː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 1),
('You are welcome', '不客气', '/juː ɑːr ˈwelkəm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 2),
('Excuse me', '对不起', '/ɪkˈskjuːz miː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 2),
('I am sorry', '我很抱歉', '/aɪ æm ˈsɑːri/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 2),
('How are you', '你好吗', '/haʊ ɑːr juː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 2),
('I am fine', '我很好', '/aɪ æm faɪn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 2),
('See you later', '再见', '/siː juː ˈleɪtər/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 3),
('Have a nice day', '祝你愉快', '/hæv ə naɪs deɪ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 11, 3);

-- 插入问候短语类数据
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Hello', '你好', '/həˈloʊ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 1),
('Hi', '嗨', '/haɪ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 1),
('Goodbye', '再见', '/ɡʊdˈbaɪ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 1),
('Nice to meet you', '很高兴认识你', '/naɪs tuː miːt juː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 2),
('My name is', '我的名字是', '/maɪ neɪm ɪz/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 2),
('What is your name', '你叫什么名字', '/wɑːt ɪz jɔːr neɪm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 2),
('How old are you', '你多大了', '/haʊ oʊld ɑːr juː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 2),
('I am years old', '我岁了', '/aɪ æm jɪrz oʊld/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 2),
('Where are you from', '你来自哪里', '/wer ɑːr juː frʌm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 3),
('I am from', '我来自', '/aɪ æm frʌm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 12, 3);

-- 插入动作短语类数据
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('Stand up', '站起来', '/stænd ʌp/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 1),
('Sit down', '坐下', '/sɪt daʊn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 1),
('Come here', '过来', '/kʌm hɪr/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 1),
('Go away', '走开', '/ɡoʊ əˈweɪ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 2),
('Look at me', '看着我', '/lʊk æt miː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 2),
('Listen carefully', '仔细听', '/ˈlɪsən ˈkerfəli/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 2),
('Open the door', '开门', '/ˈoʊpən ðə dɔːr/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 2),
('Close the window', '关窗', '/kloʊz ðə ˈwɪndoʊ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 2),
('Turn on the light', '开灯', '/tɜːrn ɑːn ðə laɪt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 3),
('Turn off the TV', '关电视', '/tɜːrn ɔːf ðə ˌtiː ˈviː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 13, 3);

-- 插入简单句子类数据
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('I am a student', '我是一个学生', '/aɪ æm ə ˈstjuːdənt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 1),
('This is my book', '这是我的书', '/ðɪs ɪz maɪ bʊk/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 1),
('I like apples', '我喜欢苹果', '/aɪ laɪk ˈæpəlz/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 1),
('She is my friend', '她是我的朋友', '/ʃiː ɪz maɪ frend/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 2),
('We are happy', '我们很开心', '/wiː ɑːr ˈhæpi/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 2),
('The cat is sleeping', '猫在睡觉', '/ðə kæt ɪz ˈsliːpɪŋ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 2),
('I can swim', '我会游泳', '/aɪ kæn swɪm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 2),
('The sun is bright', '太阳很亮', '/ðə sʌn ɪz braɪt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 2),
('I want to eat', '我想吃东西', '/aɪ wɑːnt tuː iːt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 3),
('The weather is nice', '天气很好', '/ðə ˈweðər ɪz naɪs/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 14, 3);

-- 插入对话句子类数据
INSERT INTO words (word, chinese, phonetic, image_url, audio_url, category_id, difficulty_level) VALUES
('What is this', '这是什么', '/wɑːt ɪz ðɪs/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 1),
('It is a cat', '这是一只猫', '/ɪt ɪz ə kæt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 1),
('Where is my bag', '我的包在哪里', '/wer ɪz maɪ bæɡ/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 2),
('It is on the table', '它在桌子上', '/ɪt ɪz ɑːn ðə ˈteɪbəl/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 2),
('What time is it', '几点了', '/wɑːt taɪm ɪz ɪt/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 2),
('It is three o clock', '三点钟了', '/ɪt ɪz θriː ə klɑːk/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 2),
('Do you like ice cream', '你喜欢冰淇淋吗', '/duː juː laɪk aɪs kriːm/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 3),
('Yes I do', '是的我喜欢', '/jes aɪ duː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 3),
('Can you help me', '你能帮我吗', '/kæn juː help miː/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 3),
('Of course I can', '当然可以', '/əv kɔːrs aɪ kæn/', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', null, 15, 3); 