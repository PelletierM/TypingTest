from flask import Blueprint, render_template, json
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .models import User
from flask_login import login_user, logout_user, login_required
from os import path

routes = Blueprint("routes", __name__)

@routes.route('/')
def index():
    #Test for database query
    result = db.session.execute(text('SELECT * FROM test')).all()
    return render_template("base.html", template_check="Template working", result=result)

@routes.route("/sign-up", methods=['GET', 'POST'])
def signup():
    #Get form data
    #Check if email or username already exist
    #Check if password meets requirements
    #Check if passwords match


    new_user = User(email=email, username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return render_template("signup.html")

@routes.route("/test/wordlist", methods=['POST'])
def wordlist():
    with open('/home/maxime/documents/github/typing-test/app_package/static/wordlists/french_weighted.json', 'r') as file:
        words = json.load(file)
        return json.dumps(words)