from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.word import Category, Word, Phrase, LearningProgress
from sqlalchemy import func
import json

learning_bp = Blueprint('learning', __name__)

# 获取所有分类
@learning_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify({
            'success': True,
            'data': [category.to_dict() for category in categories]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 获取特定分类的详细信息
@learning_bp.route('/categories/<int:category_id>', methods=['GET'])
def get_category(category_id):
    try:
        category = Category.query.get_or_404(category_id)
        return jsonify({
            'success': True,
            'data': category.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 创建新分类
@learning_bp.route('/categories', methods=['POST'])
def create_category():
    try:
        data = request.get_json()
        
        category = Category(
            name=data['name'],
            icon=data['icon'],
            description=data.get('description', '')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': category.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 获取分类下的所有单词
@learning_bp.route('/categories/<int:category_id>/words', methods=['GET'])
def get_category_words(category_id):
    try:
        words = Word.query.filter_by(category_id=category_id).all()
        return jsonify({
            'success': True,
            'data': [word.to_dict() for word in words]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 创建新单词
@learning_bp.route('/words', methods=['POST'])
def create_word():
    try:
        data = request.get_json()
        
        word = Word(
            text=data['text'],
            pronunciation=data.get('pronunciation', ''),
            image_url=data.get('image_url', ''),
            audio_url=data.get('audio_url', ''),
            definition=data.get('definition', ''),
            example_sentence=data.get('example_sentence', ''),
            difficulty_level=data.get('difficulty_level', 1),
            category_id=data['category_id']
        )
        
        db.session.add(word)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': word.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 批量创建单词
@learning_bp.route('/words/batch', methods=['POST'])
def create_words_batch():
    try:
        data = request.get_json()
        words_data = data.get('words', [])
        
        words = []
        for word_data in words_data:
            word = Word(
                text=word_data['text'],
                pronunciation=word_data.get('pronunciation', ''),
                image_url=word_data.get('image_url', ''),
                audio_url=word_data.get('audio_url', ''),
                definition=word_data.get('definition', ''),
                example_sentence=word_data.get('example_sentence', ''),
                difficulty_level=word_data.get('difficulty_level', 1),
                category_id=word_data['category_id']
            )
            words.append(word)
        
        db.session.add_all(words)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': [word.to_dict() for word in words],
            'count': len(words)
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 获取单词详情
@learning_bp.route('/words/<int:word_id>', methods=['GET'])
def get_word(word_id):
    try:
        word = Word.query.get_or_404(word_id)
        return jsonify({
            'success': True,
            'data': word.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 更新单词
@learning_bp.route('/words/<int:word_id>', methods=['PUT'])
def update_word(word_id):
    try:
        word = Word.query.get_or_404(word_id)
        data = request.get_json()
        
        word.text = data.get('text', word.text)
        word.pronunciation = data.get('pronunciation', word.pronunciation)
        word.image_url = data.get('image_url', word.image_url)
        word.audio_url = data.get('audio_url', word.audio_url)
        word.definition = data.get('definition', word.definition)
        word.example_sentence = data.get('example_sentence', word.example_sentence)
        word.difficulty_level = data.get('difficulty_level', word.difficulty_level)
        word.category_id = data.get('category_id', word.category_id)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': word.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 删除单词
@learning_bp.route('/words/<int:word_id>', methods=['DELETE'])
def delete_word(word_id):
    try:
        word = Word.query.get_or_404(word_id)
        db.session.delete(word)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Word deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 搜索单词
@learning_bp.route('/words/search', methods=['GET'])
def search_words():
    try:
        query = request.args.get('q', '')
        category_id = request.args.get('category_id')
        difficulty = request.args.get('difficulty')
        
        words_query = Word.query
        
        if query:
            words_query = words_query.filter(Word.text.contains(query))
        
        if category_id:
            words_query = words_query.filter_by(category_id=int(category_id))
        
        if difficulty:
            words_query = words_query.filter_by(difficulty_level=int(difficulty))
        
        words = words_query.all()
        
        return jsonify({
            'success': True,
            'data': [word.to_dict() for word in words],
            'count': len(words)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 获取学习统计
@learning_bp.route('/stats', methods=['GET'])
def get_learning_stats():
    try:
        total_categories = Category.query.count()
        total_words = Word.query.count()
        total_phrases = Phrase.query.count()
        
        # 按分类统计单词数量
        category_stats = db.session.query(
            Category.name,
            func.count(Word.id).label('word_count')
        ).outerjoin(Word).group_by(Category.id, Category.name).all()
        
        return jsonify({
            'success': True,
            'data': {
                'total_categories': total_categories,
                'total_words': total_words,
                'total_phrases': total_phrases,
                'category_stats': [
                    {'category': stat[0], 'word_count': stat[1]}
                    for stat in category_stats
                ]
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 初始化示例数据
@learning_bp.route('/init-data', methods=['POST'])
def init_sample_data():
    try:
        # 检查是否已有数据
        if Category.query.count() > 0:
            return jsonify({
                'success': False,
                'message': 'Data already exists'
            }), 400
        
        # 创建示例分类
        categories_data = [
            {'name': 'Animals', 'icon': '🐾', 'description': 'Learn about different animals'},
            {'name': 'Food', 'icon': '🍎', 'description': 'Learn about food and drinks'},
            {'name': 'Colors', 'icon': '🌈', 'description': 'Learn about colors'},
            {'name': 'Body Parts', 'icon': '👤', 'description': 'Learn about body parts'},
            {'name': 'Numbers', 'icon': '🔢', 'description': 'Learn numbers'},
            {'name': 'Family', 'icon': '👨‍👩‍👧‍👦', 'description': 'Learn about family members'}
        ]
        
        categories = []
        for cat_data in categories_data:
            category = Category(**cat_data)
            categories.append(category)
            db.session.add(category)
        
        db.session.commit()
        
        # 创建示例单词
        words_data = [
            # Animals
            {'text': 'cat', 'image_url': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop', 'category_id': 1},
            {'text': 'dog', 'image_url': 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop', 'category_id': 1},
            {'text': 'bird', 'image_url': 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop', 'category_id': 1},
            {'text': 'fish', 'image_url': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop', 'category_id': 1},
            {'text': 'elephant', 'image_url': 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop', 'category_id': 1},
            
            # Food
            {'text': 'apple', 'image_url': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=300&fit=crop', 'category_id': 2},
            {'text': 'banana', 'image_url': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop', 'category_id': 2},
            {'text': 'bread', 'image_url': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', 'category_id': 2},
            {'text': 'milk', 'image_url': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop', 'category_id': 2},
            {'text': 'cake', 'image_url': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', 'category_id': 2},
            
            # Colors
            {'text': 'red', 'image_url': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 'category_id': 3},
            {'text': 'blue', 'image_url': 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop', 'category_id': 3},
            {'text': 'green', 'image_url': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', 'category_id': 3},
            {'text': 'yellow', 'image_url': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', 'category_id': 3},
            {'text': 'purple', 'image_url': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 'category_id': 3}
        ]
        
        for word_data in words_data:
            word = Word(**word_data)
            db.session.add(word)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Sample data initialized successfully',
            'categories_count': len(categories_data),
            'words_count': len(words_data)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 获取分类下的所有短句
@learning_bp.route('/categories/<int:category_id>/phrases', methods=['GET'])
def get_category_phrases(category_id):
    try:
        phrases = Phrase.query.filter_by(category_id=category_id).all()
        return jsonify({
            'success': True,
            'data': [phrase.to_dict() for phrase in phrases]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 创建新短句
@learning_bp.route('/phrases', methods=['POST'])
def create_phrase():
    try:
        data = request.get_json()
        
        phrase = Phrase(
            text=data['text'],
            translation=data.get('translation', ''),
            audio_url=data.get('audio_url', ''),
            context=data.get('context', ''),
            difficulty_level=data.get('difficulty_level', 1),
            category_id=data['category_id']
        )
        
        db.session.add(phrase)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': phrase.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 获取短句详情
@learning_bp.route('/phrases/<int:phrase_id>', methods=['GET'])
def get_phrase(phrase_id):
    try:
        phrase = Phrase.query.get_or_404(phrase_id)
        return jsonify({
            'success': True,
            'data': phrase.to_dict()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 更新短句
@learning_bp.route('/phrases/<int:phrase_id>', methods=['PUT'])
def update_phrase(phrase_id):
    try:
        phrase = Phrase.query.get_or_404(phrase_id)
        data = request.get_json()
        
        phrase.text = data.get('text', phrase.text)
        phrase.translation = data.get('translation', phrase.translation)
        phrase.audio_url = data.get('audio_url', phrase.audio_url)
        phrase.context = data.get('context', phrase.context)
        phrase.difficulty_level = data.get('difficulty_level', phrase.difficulty_level)
        phrase.category_id = data.get('category_id', phrase.category_id)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': phrase.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 删除短句
@learning_bp.route('/phrases/<int:phrase_id>', methods=['DELETE'])
def delete_phrase(phrase_id):
    try:
        phrase = Phrase.query.get_or_404(phrase_id)
        db.session.delete(phrase)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Phrase deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 搜索短句
@learning_bp.route('/phrases/search', methods=['GET'])
def search_phrases():
    try:
        query = request.args.get('q', '')
        category_id = request.args.get('category_id')
        context = request.args.get('context')
        
        phrases_query = Phrase.query
        
        if query:
            phrases_query = phrases_query.filter(
                Phrase.text.contains(query) | 
                Phrase.translation.contains(query)
            )
        
        if category_id:
            phrases_query = phrases_query.filter_by(category_id=int(category_id))
            
        if context:
            phrases_query = phrases_query.filter_by(context=context)
        
        phrases = phrases_query.all()
        
        return jsonify({
            'success': True,
            'data': [phrase.to_dict() for phrase in phrases],
            'count': len(phrases)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# 获取所有可用的上下文标签
@learning_bp.route('/phrases/contexts', methods=['GET'])
def get_phrase_contexts():
    try:
        contexts = db.session.query(Phrase.context).distinct().all()
        context_list = [context[0] for context in contexts if context[0]]
        
        return jsonify({
            'success': True,
            'data': context_list
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def init_database():
    """初始化数据库，创建默认分类和单词"""
    try:
        # 检查是否已经有数据
        if Category.query.count() > 0:
            print("数据库已有数据，跳过初始化")
            return
        
        # 创建默认分类
        categories_data = [
            {'name': 'Animals', 'icon': '🐾', 'description': 'Learn about different animals'},
            {'name': 'Food', 'icon': '🍎', 'description': 'Food and drinks vocabulary'},
            {'name': 'Colors', 'icon': '🎨', 'description': 'Learn colors in English'},
            {'name': 'Body Parts', 'icon': '👋', 'description': 'Parts of the body'},
            {'name': 'Numbers', 'icon': '🔢', 'description': 'Counting numbers'},
            {'name': 'Family', 'icon': '🏠', 'description': 'Family members'},
            {'name': 'Clothing', 'icon': '👕', 'description': 'Clothes and accessories'},
            {'name': 'Transportation', 'icon': '🚗', 'description': 'Vehicles and transport'},
            {'name': 'Home', 'icon': '🏡', 'description': 'House and furniture'},
            {'name': 'School', 'icon': '🏫', 'description': 'School and education'},
            {'name': 'Sports', 'icon': '⚽', 'description': 'Sports and activities'},
            {'name': 'Weather', 'icon': '☀️', 'description': 'Weather and seasons'},
            {'name': 'Fruits', 'icon': '🍓', 'description': 'Fruits and berries'},
            {'name': 'Vegetables', 'icon': '🥕', 'description': 'Vegetables and greens'},
            {'name': 'Toys', 'icon': '🧸', 'description': 'Toys and games'},
            {'name': 'Shapes', 'icon': '⭐', 'description': 'Shapes and geometry'}
        ]
        
        categories = []
        for cat_data in categories_data:
            category = Category(
                name=cat_data['name'],
                icon=cat_data['icon'],
                description=cat_data['description']
            )
            categories.append(category)
            db.session.add(category)
        
        db.session.commit()
        print(f"创建了 {len(categories)} 个分类")
        
        # 为每个分类添加一些示例单词
        sample_words = {
            'Animals': [
                {'text': 'cat', 'pronunciation': 'kæt', 'definition': 'A small domesticated carnivorous mammal'},
                {'text': 'dog', 'pronunciation': 'dɔːɡ', 'definition': 'A domesticated carnivorous mammal'},
                {'text': 'bird', 'pronunciation': 'bɜːrd', 'definition': 'A warm-blooded egg-laying vertebrate'},
            ],
            'Food': [
                {'text': 'apple', 'pronunciation': 'ˈæpəl', 'definition': 'A round fruit with red or green skin'},
                {'text': 'bread', 'pronunciation': 'bred', 'definition': 'A food made from flour and water'},
                {'text': 'milk', 'pronunciation': 'mɪlk', 'definition': 'A white liquid produced by mammals'},
            ],
            'Colors': [
                {'text': 'red', 'pronunciation': 'red', 'definition': 'The color of blood'},
                {'text': 'blue', 'pronunciation': 'bluː', 'definition': 'The color of the sky'},
                {'text': 'green', 'pronunciation': 'ɡriːn', 'definition': 'The color of grass'},
            ]
        }
        
        for category in categories:
            if category.name in sample_words:
                for word_data in sample_words[category.name]:
                    word = Word(
                        text=word_data['text'],
                        pronunciation=word_data['pronunciation'],
                        definition=word_data['definition'],
                        category_id=category.id,
                        difficulty_level=1
                    )
                    db.session.add(word)
        
        db.session.commit()
        print("数据库初始化完成")
        
    except Exception as e:
        print(f"数据库初始化失败: {e}")
        db.session.rollback()
        raise 