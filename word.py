from src.models.user import db

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(10), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    # 关联到单词
    words = db.relationship('Word', backref='category', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'icon': self.icon,
            'description': self.description,
            'word_count': len(self.words),
            'words': [word.to_dict() for word in self.words]
        }

class Word(db.Model):
    __tablename__ = 'words'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    pronunciation = db.Column(db.String(300))  # 音标
    image_url = db.Column(db.String(500))
    audio_url = db.Column(db.String(500))
    definition = db.Column(db.Text)  # 定义/解释
    example_sentence = db.Column(db.Text)  # 例句
    difficulty_level = db.Column(db.Integer, default=1)  # 难度等级 1-5
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'pronunciation': self.pronunciation,
            'image': self.image_url,
            'audio': self.audio_url,
            'definition': self.definition,
            'example_sentence': self.example_sentence,
            'difficulty_level': self.difficulty_level,
            'category_id': self.category_id
        }

class Phrase(db.Model):
    __tablename__ = 'phrases'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(500), nullable=False)
    translation = db.Column(db.String(500))  # 翻译
    image_url = db.Column(db.String(500))
    audio_url = db.Column(db.String(500))
    context = db.Column(db.Text)  # 使用场景
    difficulty_level = db.Column(db.Integer, default=1)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'translation': self.translation,
            'image': self.image_url,
            'audio': self.audio_url,
            'context': self.context,
            'difficulty_level': self.difficulty_level,
            'category_id': self.category_id
        }

class LearningProgress(db.Model):
    __tablename__ = 'learning_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)  # 用户标识
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'))
    phrase_id = db.Column(db.Integer, db.ForeignKey('phrases.id'))
    learned_count = db.Column(db.Integer, default=0)  # 学习次数
    mastery_level = db.Column(db.Integer, default=0)  # 掌握程度 0-100
    last_learned = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'word_id': self.word_id,
            'phrase_id': self.phrase_id,
            'learned_count': self.learned_count,
            'mastery_level': self.mastery_level,
            'last_learned': self.last_learned.isoformat() if self.last_learned else None
        }

