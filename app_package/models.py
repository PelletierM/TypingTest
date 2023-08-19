from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(36), unique=True, nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False)
    password = db.Column(db.String(254), nullable=False)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())
    is_confirmed = db.Column(db.Boolean, nullable=False, default=False)
    date_confirmed = db.Column(db.DateTime, nullable=True)

class Tests(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    mode = db.Column(db.String(32), nullable=False)
    language = db.Column(db.String(32))
    time = db.Column(db.Integer)
    words = db.Column(db.Integer)
    wpm = db.Column(db.Float, nullable=False, default=0.0)
    raw_wpm = db.Column(db.Float, nullable=False, default=0.0)
    accuracy = db.Column(db.Float, nullable=False, default=0.0)
    state = db.Column(db.String(32), nullable=False)
    date = db.Column(db.DateTime(timezone=True), default=func.now())
    chars_correct_correctword = db.Column(db.Integer, default=0)
    chars_correct_incorrectword = db.Column(db.Integer, default=0)
    chars_incorrect = db.Column(db.Integer, default=0)
    chars_extra = db.Column(db.Integer, default=0)
    chars_missed = db.Column(db.Integer, default=0)