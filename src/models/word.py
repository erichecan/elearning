from .user import db

class Category(db.Model):
    __tablename__ = 'category'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    icon = db.Column(db.String(50))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    words = db.relationship('Word', backref='category', lazy=True)
    phrases = db.relationship('Phrase', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'icon': self.icon,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Word(db.Model):
    __tablename__ = 'word'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100), nullable=False)
    pronunciation = db.Column(db.String(100))
    image_url = db.Column(db.String(500))
    audio_url = db.Column(db.String(500))
    definition = db.Column(db.Text)
    example_sentence = db.Column(db.Text)
    difficulty_level = db.Column(db.Integer, default=1)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'pronunciation': self.pronunciation,
            'image_url': self.image_url,
            'audio_url': self.audio_url,
            'definition': self.definition,
            'example_sentence': self.example_sentence,
            'difficulty_level': self.difficulty_level,
            'category_id': self.category_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Phrase(db.Model):
    __tablename__ = 'phrase'
    
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    translation = db.Column(db.Text)
    audio_url = db.Column(db.String(500))
    context = db.Column(db.String(200))
    difficulty_level = db.Column(db.Integer, default=1)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'text': self.text,
            'translation': self.translation,
            'audio_url': self.audio_url,
            'context': self.context,
            'difficulty_level': self.difficulty_level,
            'category_id': self.category_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class LearningProgress(db.Model):
    __tablename__ = 'learning_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    word_id = db.Column(db.Integer, db.ForeignKey('word.id'), nullable=False)
    is_learned = db.Column(db.Boolean, default=False)
    review_count = db.Column(db.Integer, default=0)
    last_reviewed = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'word_id': self.word_id,
            'is_learned': self.is_learned,
            'review_count': self.review_count,
            'last_reviewed': self.last_reviewed.isoformat() if self.last_reviewed else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        } 