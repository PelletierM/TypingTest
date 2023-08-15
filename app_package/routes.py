from flask import Blueprint, render_template, redirect, url_for, json, request, flash
from sqlalchemy import text
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .models import Users
from flask_login import login_user, logout_user, login_required, current_user
from os import path
from .auth import generate_email_token, confirm_email_token
from .utilities.email import send_confirm_email
import re

routes = Blueprint("routes", __name__)

@routes.route("/")
def index():
    # Test for database query
    result = db.session.execute(text("SELECT * FROM test")).all()
    
    username = ""
    if current_user.is_authenticated :
        username = current_user.username

    return render_template("base.html", template_check="Template working", result=result, is_logged_in=current_user.is_authenticated, username=username)

@routes.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = (request.form.get("username")).lower()
        email = request.form.get("email")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        error = False

        # Requirements : 8-24 characters, only letters and numbers
        username_regex = r"^[a-z\d]{8,24}$"
        if not re.fullmatch(username_regex, username) :
            error = True
            flash("Username does not meet requirements", category="error")

        email_regex = r'^.+@[\w\.]+\.[a-zA-Z0-9]+$'
        if not re.fullmatch(email_regex, email) :
            error = True
            flash("Invalid email address", category="error")

        check_email_in_db = Users.query.filter_by(email=email).first()
        if check_email_in_db :
            error = True
            flash("An account is already registered with that email.", category="error")

        check_username_in_db = Users.query.filter_by(username=username).first()
        if check_username_in_db :
            error = True
            flash("Username already exists.", category="error")

        # Requirements : 8-24 characters, at least one uppercase, one lowercase and one number
        password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$"
        if not re.fullmatch(password_regex, password) :
            error = True
            flash("Password does not meet requirements.")

        if password != confirmation :
            error = True
            flash("Passwords don't match.", category="error")

        if not error :
            new_user = Users(email=email, username=username, password=generate_password_hash(password, method="scrypt"))
            db.session.add(new_user)
            db.session.commit()

            email_token = generate_email_token(email)
            confirm_url = url_for("routes.confirm_email", token=email_token, _external=True)
            html = render_template("auth_email.html", username=username, confirm_url=confirm_url)
            subject = "Typing Test : Please confirm your email"
            # send_confirm_email(email, subject, html)

            user = Users.query.filter_by(username=username).first()
            login_user(user, remember=True)
            flash("User created.", category="success")
            return redirect(url_for("routes.index"))
        return render_template("base.html")
    return redirect(url_for("routes.index"))

@routes.route("/confirm/<token>")
@login_required
def confirm_email(token):
    if current_user.is_confirmed :
        flash("Your account has already been confirmed.", category="success")
        return render_template("base.html")
    email = confirm_email_token(token)
    user = Users.query.filter_by(email=current_user.email).first()
    if user.email == email :
        user.is_confirmed = True
        user.date_confirmed = func.now()
        db.session.add(user)
        db.session.commit()
        flash("Your account has been confirmed", category="success")
    else :
        flash("The confirmation link is either invalid or expired.", category="error")

    return redirect(url_for("routes.index"))

@routes.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = (request.form.get("username")).lower()
        password = request.form.get("password")

        user = Users.query.filter_by(username=username).first()
        if user :
            if check_password_hash(user.password, password) :
                flash("Logged in", category="success")
                login_user(user, remember=True)
                return redirect(url_for("routes.index"))
            else :
                flash("Password is incorrect.", category="error")
        else :
            flash("Username does not exist.", category="error")
    return redirect(url_for("routes.index"))
    



@routes.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("routes.index"))

@routes.route("/test/wordlist", methods=["POST"])
def wordlist():
    if request.method == "POST":
        with open("/home/maxime/documents/github/typing-test/app_package/static/wordlists/french_weighted.json", "r", encoding="utf-8") as file:
            words = json.load(file)
            return json.dumps(words)