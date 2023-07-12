from flask import Blueprint, render_template
from . import db
from sqlalchemy import text


routes = Blueprint("routes", __name__)

@routes.route('/')
def index():
    #Test for database query
    result = db.session.execute(text('SELECT * FROM test')).all()
    return render_template("index.html", template_check="Template working", result=result)
