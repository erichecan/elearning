#!/usr/bin/env python3
"""
PDF数据导入脚本
从DK英语词典文本文件中导入单词和短句数据
"""

import re
import sys
import os
import sqlite3
from datetime import datetime

# 添加src目录到Python路径
sys.path.append('src')

def create_database_tables():
    """创建数据库表"""
    conn = sqlite3.connect('database/app.db')
    cursor = conn.cursor()
    
    # 创建分类表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS category (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            icon VARCHAR(10) DEFAULT '📚',
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # 创建单词表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS word (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text VARCHAR(100) NOT NULL,
            pronunciation VARCHAR(200),
            image_url VARCHAR(500),
            audio_url VARCHAR(500),
            definition TEXT,
            example_sentence TEXT,
            difficulty_level INTEGER DEFAULT 1,
            category_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES category (id)
        )
    ''')
    
    # 创建短句表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS phrase (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            translation TEXT,
            audio_url VARCHAR(500),
            context VARCHAR(200),
            difficulty_level INTEGER DEFAULT 1,
            category_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES category (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def import_categories():
    """导入分类数据"""
    conn = sqlite3.connect('database/app.db')
    cursor = conn.cursor()
    
    categories = [
        ('Animals', '🐾', 'Learn about different animals'),
        ('Food', '🍎', 'Learn about food and drinks'),  
        ('Colors', '🌈', 'Learn about colors'),
        ('Body Parts', '👤', 'Learn about body parts'),
        ('Numbers', '🔢', 'Learn numbers'),
        ('Family', '👨‍👩‍👧‍👦', 'Learn about family members'),
        ('Clothing', '👕', 'Learn about clothes and accessories'),
        ('Transportation', '🚗', 'Learn about vehicles and travel'),
        ('Home', '🏠', 'Learn about home and furniture'),
        ('School', '🎓', 'Learn about school and education'),
        ('Sports', '⚽', 'Learn about sports and activities'),
        ('Weather', '☀️', 'Learn about weather and seasons'),
        ('Useful Phrases', '💬', 'Learn common phrases and expressions'),
        ('Greetings', '👋', 'Learn how to greet people'),
        ('Feelings', '😊', 'Learn about emotions and feelings'),
        ('Opposites', '↔️', 'Learn opposite words')
    ]
    
    for name, icon, description in categories:
        cursor.execute('''
            INSERT OR IGNORE INTO category (name, icon, description) 
            VALUES (?, ?, ?)
        ''', (name, icon, description))
    
    conn.commit()
    conn.close()
    print(f"✅ 导入了 {len(categories)} 个分类")

def get_category_id(cursor, category_name):
    """获取分类ID"""
    cursor.execute('SELECT id FROM category WHERE name = ?', (category_name,))
    result = cursor.fetchone()
    return result[0] if result else None

def import_extracted_words():
    """从extracted_words_and_categories.txt导入单词"""
    conn = sqlite3.connect('database/app.db')
    cursor = conn.cursor()
    
    # 分类映射
    category_mapping = {
        'animals': 'Animals',
        'food': 'Food', 
        'colors': 'Colors',
        'body': 'Body Parts',
        'clothing': 'Clothing',
        'transport': 'Transportation',
        'home': 'Home',
        'school': 'School'
    }
    
    try:
        with open('extracted_words_and_categories.txt', 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 解析单词部分
        words_section = content.split('Words (initial extraction')[1] if 'Words (initial extraction' in content else content
        word_lines = [line.strip('- ').strip() for line in words_section.split('\n') if line.strip().startswith('- ')]
        
        # 简单的单词分类逻辑（基于关键词）
        word_categories = {
            # 动物
            'Animals': ['cat', 'dog', 'bird', 'fish', 'elephant', 'bear', 'tiger', 'lion', 'rabbit', 'horse', 'cow', 'pig', 'sheep', 'goat', 'duck', 'chicken', 'mouse', 'rat', 'hamster', 'turtle', 'snake', 'frog', 'bee', 'butterfly', 'ant', 'spider', 'ladybug', 'whale', 'dolphin', 'shark', 'octopus', 'starfish', 'crab', 'alligator', 'crocodile', 'zebra', 'giraffe', 'hippo', 'rhino', 'monkey', 'gorilla', 'panda', 'koala', 'kangaroo', 'penguin', 'owl', 'eagle', 'parrot', 'flamingo', 'deer', 'wolf', 'fox', 'squirrel', 'beaver', 'badger', 'hedgehog', 'bat', 'seal', 'walrus', 'polar bear', 'cheetah', 'leopard', 'jaguar', 'lynx'],
            
            # 食物
            'Food': ['apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'cherry', 'peach', 'pear', 'pineapple', 'watermelon', 'melon', 'mango', 'kiwi', 'lemon', 'lime', 'coconut', 'avocado', 'tomato', 'potato', 'carrot', 'onion', 'garlic', 'broccoli', 'lettuce', 'spinach', 'cucumber', 'pepper', 'corn', 'peas', 'beans', 'bread', 'rice', 'pasta', 'noodles', 'cereal', 'oatmeal', 'pancake', 'waffle', 'toast', 'sandwich', 'pizza', 'burger', 'hot dog', 'taco', 'salad', 'soup', 'egg', 'cheese', 'milk', 'butter', 'yogurt', 'ice cream', 'cake', 'cookie', 'candy', 'chocolate', 'honey', 'jam', 'peanut', 'almond', 'walnut', 'cashew'],
            
            # 颜色
            'Colors': ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white', 'gray', 'grey'],
            
            # 身体部位
            'Body Parts': ['head', 'face', 'eye', 'nose', 'mouth', 'ear', 'neck', 'shoulder', 'arm', 'hand', 'finger', 'thumb', 'chest', 'stomach', 'back', 'leg', 'knee', 'foot', 'toe', 'ankle', 'elbow', 'wrist', 'hair', 'tooth', 'teeth', 'tongue', 'lip', 'chin', 'cheek', 'forehead', 'eyebrow', 'eyelash'],
            
            # 数字
            'Numbers': ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'hundred', 'thousand'],
            
            # 家庭
            'Family': ['family', 'mother', 'father', 'parent', 'brother', 'sister', 'son', 'daughter', 'grandmother', 'grandfather', 'grandparent', 'aunt', 'uncle', 'cousin', 'baby', 'child', 'children', 'mom', 'dad', 'grandma', 'grandpa'],
            
            # 衣服
            'Clothing': ['shirt', 't-shirt', 'pants', 'jeans', 'shorts', 'skirt', 'dress', 'jacket', 'coat', 'sweater', 'hoodie', 'socks', 'shoes', 'sneakers', 'boots', 'sandals', 'hat', 'cap', 'scarf', 'gloves', 'belt', 'tie', 'underwear', 'pajamas', 'swimsuit', 'uniform'],
            
            # 交通工具
            'Transportation': ['car', 'bus', 'train', 'plane', 'airplane', 'bike', 'bicycle', 'motorcycle', 'truck', 'van', 'taxi', 'boat', 'ship', 'subway', 'helicopter', 'rocket', 'scooter', 'skateboard'],
            
            # 家
            'Home': ['house', 'home', 'room', 'bedroom', 'bathroom', 'kitchen', 'living room', 'dining room', 'garage', 'garden', 'yard', 'door', 'window', 'wall', 'floor', 'ceiling', 'roof', 'stairs', 'bed', 'chair', 'table', 'sofa', 'couch', 'desk', 'shelf', 'bookcase', 'tv', 'television', 'computer', 'phone', 'lamp', 'clock', 'mirror', 'picture', 'curtain', 'carpet', 'rug'],
            
            # 学校
            'School': ['school', 'teacher', 'student', 'classroom', 'book', 'pencil', 'pen', 'paper', 'notebook', 'eraser', 'ruler', 'scissors', 'glue', 'crayon', 'marker', 'backpack', 'lunch', 'recess', 'homework', 'test', 'grade', 'math', 'reading', 'writing', 'science', 'art', 'music', 'gym', 'library', 'principal', 'desk', 'chair', 'board', 'chalk']
        }
        
        imported_count = 0
        for word in word_lines:
            if not word or len(word) < 2:
                continue
                
            # 确定单词所属分类
            category_name = 'School'  # 默认分类
            for cat_name, keywords in word_categories.items():
                if word.lower() in [kw.lower() for kw in keywords]:
                    category_name = cat_name
                    break
            
            category_id = get_category_id(cursor, category_name)
            if not category_id:
                continue
            
            # 生成图片URL（使用Unsplash）
            image_url = f"https://images.unsplash.com/400x300/?{word}"
            
            cursor.execute('''
                INSERT OR IGNORE INTO word (text, image_url, category_id, difficulty_level) 
                VALUES (?, ?, ?, ?)
            ''', (word, image_url, category_id, 1))
            
            imported_count += 1
        
        conn.commit()
        print(f"✅ 导入了 {imported_count} 个单词")
        
    except FileNotFoundError:
        print("❌ 未找到 extracted_words_and_categories.txt 文件")
    except Exception as e:
        print(f"❌ 导入单词时出错: {e}")
    finally:
        conn.close()

def import_useful_phrases():
    """导入常用短句"""
    conn = sqlite3.connect('database/app.db')
    cursor = conn.cursor()
    
    # 从DK词典中提取的常用短句
    phrases = [
        ("Hello.", "你好。", "greetings"),
        ("Hi!", "嗨！", "greetings"), 
        ("How are you?", "你好吗？", "greetings"),
        ("I'm fine, thanks!", "我很好，谢谢！", "greetings"),
        ("Would you like an ice cream?", "你想要冰淇淋吗？", "offers"),
        ("Yes, please!", "好的，请！", "responses"),
        ("No, thank you.", "不，谢谢。", "responses"),
        ("Here you go.", "给你。", "giving"),
        ("Would you like a drink?", "你想要喝点什么吗？", "offers"),
        ("Thanks!", "谢谢！", "gratitude"),
        ("Thank you. Bye!", "谢谢你。再见！", "farewells"),
        ("Have a nice day!", "祝你今天愉快！", "farewells"),
        ("What's your name?", "你叫什么名字？", "introductions"),
        ("My name is...", "我的名字是...", "introductions"),
        ("Nice to meet you.", "很高兴见到你。", "introductions"),
        ("How old are you?", "你多大了？", "personal_info"),
        ("I am ... years old.", "我...岁了。", "personal_info"),
        ("Where are you from?", "你来自哪里？", "personal_info"),
        ("I'm from...", "我来自...", "personal_info"),
        ("What time is it?", "现在几点了？", "time"),
        ("It's ... o'clock.", "现在是...点。", "time"),
        ("Excuse me.", "不好意思。", "politeness"),
        ("I'm sorry.", "对不起。", "apologies"),
        ("Can you help me?", "你能帮助我吗？", "requests"),
        ("I need help.", "我需要帮助。", "requests"),
        ("Where is the bathroom?", "洗手间在哪里？", "directions"),
        ("How much is this?", "这个多少钱？", "shopping"),
        ("I would like...", "我想要...", "requests"),
        ("Can I have...?", "我可以要...吗？", "requests"),
        ("I don't understand.", "我不明白。", "communication"),
        ("Can you repeat that?", "你能重复一遍吗？", "communication"),
        ("Speak slowly, please.", "请说慢一点。", "communication"),
        ("Good morning!", "早上好！", "greetings"),
        ("Good afternoon!", "下午好！", "greetings"),
        ("Good evening!", "晚上好！", "greetings"),
        ("Good night!", "晚安！", "farewells"),
        ("See you later!", "回头见！", "farewells"),
        ("See you tomorrow!", "明天见！", "farewells")
    ]
    
    # 获取短句分类ID
    greetings_cat_id = get_category_id(cursor, 'Greetings')
    phrases_cat_id = get_category_id(cursor, 'Useful Phrases')
    
    imported_count = 0
    for phrase_text, translation, context in phrases:
        # 根据上下文选择分类
        if context in ['greetings', 'farewells', 'introductions']:
            category_id = greetings_cat_id
        else:
            category_id = phrases_cat_id
            
        if category_id:
            cursor.execute('''
                INSERT OR IGNORE INTO phrase (text, translation, context, category_id, difficulty_level) 
                VALUES (?, ?, ?, ?, ?)
            ''', (phrase_text, translation, context, category_id, 1))
            imported_count += 1
    
    conn.commit()
    conn.close()
    print(f"✅ 导入了 {imported_count} 个常用短句")

def main():
    """主函数"""
    print("🚀 开始导入PDF数据...")
    
    # 确保数据库目录存在
    os.makedirs('database', exist_ok=True)
    
    # 创建表
    create_database_tables()
    print("✅ 数据库表已创建")
    
    # 导入分类
    import_categories()
    
    # 导入单词
    import_extracted_words()
    
    # 导入短句
    import_useful_phrases()
    
    print("🎉 PDF数据导入完成！")
    print("\n📊 数据统计:")
    
    # 显示统计信息
    conn = sqlite3.connect('database/app.db')
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM category')
    cat_count = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM word')
    word_count = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM phrase')
    phrase_count = cursor.fetchone()[0]
    
    print(f"  📂 分类: {cat_count}")
    print(f"  📝 单词: {word_count}")
    print(f"  💬 短句: {phrase_count}")
    
    conn.close()

if __name__ == "__main__":
    main() 