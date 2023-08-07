from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class Users(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(36), unique=True, nullable=False)
    email = db.Column(db.String(254), unique=True, nullable=False)
    password = db.Column(db.String(88), nullable=False)
    date_created = db.Column(db.DateTime(timezone=True), default=func.now())
    is_confirmed = db.Column(db.Boolean, nullable=False, default=False)
    date_confirmed = db.Column(db.DateTime, nullable=True)