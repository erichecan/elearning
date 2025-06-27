-- 🚨 紧急修复：将随机图片替换为真实匹配的图片
-- 执行此SQL将解决"起司显示图书馆"等图片不匹配问题

-- 🐾 动物类图片更新
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&auto=format' WHERE text = 'dog';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop&auto=format' WHERE text = 'cat';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&auto=format' WHERE text = 'bird';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop&auto=format' WHERE text = 'elephant';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&auto=format' WHERE text = 'giraffe';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=300&fit=crop&auto=format' WHERE text = 'tiger';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=300&fit=crop&auto=format' WHERE text = 'lion';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=400&h=300&fit=crop&auto=format' WHERE text = 'zebra';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=300&fit=crop&auto=format' WHERE text = 'monkey';

-- 🍎 食物类图片更新  
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop&auto=format' WHERE text = 'cheese';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format' WHERE text = 'pizza';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format' WHERE text = 'hamburger';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop&auto=format' WHERE text = 'apple';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format' WHERE text = 'banana';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&auto=format' WHERE text = 'bread';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop&auto=format' WHERE text = 'milk';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop&auto=format' WHERE text = 'orange';

-- 🎨 颜色类图片更新
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format' WHERE text = 'red';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop&auto=format' WHERE text = 'blue';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format' WHERE text = 'green';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1471919743851-c4df8b6ee130?w=400&h=300&fit=crop&auto=format' WHERE text = 'yellow';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1553181128-22e8bb5cd5fc?w=400&h=300&fit=crop&auto=format' WHERE text = 'purple';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format' WHERE text = 'black';
UPDATE words SET image_url = 'https://images.unsplash.com/photo-1548031616-7a61927ce0e1?w=400&h=300&fit=crop&auto=format' WHERE text = 'white';

-- 📊 验证更新结果
SELECT text, image_url FROM words WHERE text IN (
  'dog', 'cat', 'bird', 'elephant', 'giraffe', 'tiger', 'lion', 'zebra', 'monkey',
  'cheese', 'pizza', 'hamburger', 'apple', 'banana', 'bread', 'milk', 'orange',
  'red', 'blue', 'green', 'yellow', 'purple', 'black', 'white'
) ORDER BY text; 