# app.py
from flask import Flask, render_template, request, jsonify
from models import db, Question
import os
import logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@localhost/education_data'
db.init_app(app)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/subjects')
def get_subjects():
    subjects = Question.query.with_entities(Question.subject_name).distinct().all()
    return jsonify([subject[0] for subject in subjects])


@app.route('/chapters/<subject_name>')
def get_chapters(subject_name):
    chapters = Question.query.filter_by(subject_name=subject_name).with_entities(
        Question.chapter_name, Question.chapter_sort
    ).distinct().order_by(Question.chapter_sort).all()

    result = [{"name": chapter[0], "sort": chapter[1]} for chapter in chapters]
    logging.debug(f"Chapters for {subject_name}: {result}")
    return jsonify(result)


@app.route('/subchapters/<subject_name>/<chapter_name>')
def get_subchapters(subject_name, chapter_name):
    try:
        subchapters = Question.query.filter_by(subject_name=subject_name, chapter_name=chapter_name).with_entities(
            Question.child_chapter_name, Question.child_chapter_sort
        ).distinct().order_by(Question.child_chapter_sort).all()

        result = [{"name": subchapter[0], "sort": subchapter[1]} for subchapter in subchapters]

        logging.debug(f"Subchapters for {subject_name}/{chapter_name}: {result}")
        return jsonify(result)
    except Exception as e:
        logging.error(f"Error fetching subchapters: {e}")
        return jsonify([])


if __name__ == '__main__':
    app.run(debug=True)