# models.py

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    subject_id = db.Column(db.Integer)
    subject_name = db.Column(db.String(255))
    title = db.Column(db.String(255))
    analysis = db.Column(db.Text)
    chapter_id = db.Column(db.Integer)
    chapter_sort = db.Column(db.Integer)
    chapter_name = db.Column(db.String(255))
    child_chapter_id = db.Column(db.Integer)
    child_chapter_sort = db.Column(db.Integer)
    child_chapter_name = db.Column(db.String(255))
    child_knowledge_id = db.Column(db.Integer)
    child_knowledge_name = db.Column(db.String(255))
    content = db.Column(db.Text)
    question_id = db.Column(db.Integer)
    is_real = db.Column(db.SmallInteger)
    question_options = db.Column(db.JSON)
    question_rule = db.Column(db.JSON)
    domain = db.Column(db.String(255), default='基金从业')
    is_collected = db.Column(db.SmallInteger, default=0)
    notes = db.Column(db.String(500))

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}