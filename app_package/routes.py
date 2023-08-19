from flask import Blueprint, render_template, redirect, url_for, json, request, flash, current_app
from sqlalchemy import text
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .models import Users, Tests
from flask_login import login_user, logout_user, login_required, current_user
from os import path
from .auth import generate_email_token, confirm_email_token
from .utilities.email import send_confirm_email
from .checks import checkResults, checkRegister

routes = Blueprint("routes", __name__)

@routes.route("/")
def index():
    username = ""
    if current_user.is_authenticated :
        username = current_user.username

    return render_template("base.html", template_check="Template working", is_logged_in=current_user.is_authenticated, username=username)

@routes.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        user_info = checkRegister(request.form)

        if not user_info["validity"]["error"] :
            email = user_info["email"]
            username = user_info["username"]
            new_user = Users(email=email, username=username, password=generate_password_hash(user_info["password"], method="scrypt"))
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
        else :
            length = len(user_info["validity"]["messages"])
            for i in range(length) :
                flash(user_info["validity"]["messages"][i], category=user_info["validity"]["categories"][i])
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
        content_type = request.headers.get("Content-Type")
        if content_type == "application/json" :
            language = request.json.get("language")
            root_dir = current_app.config["ROOT_DIRECTORY"]
            with open(f"{root_dir}/app_package/static/languages/{language}.json", "r", encoding="utf-8") as file:
                words = json.load(file)
                return json.dumps(words)
    return redirect(url_for("routes.index"))

@routes.route("/test/results", methods=["POST"])
def results():
    if request.method == "POST":
        content_type = request.headers.get("Content-Type")
        if current_user.is_authenticated and (content_type == "application/json") :
            results = request.json   
            checkedResults = checkResults(results)

            if checkedResults["validity"]:
                new_test = Tests(user_id=current_user.id, mode=checkedResults["mode"], language=checkedResults["language"], time=checkedResults["time"], wpm=checkedResults["wpm"], raw_wpm=checkedResults["rawWpm"], accuracy=checkedResults["accuracy"], state=checkedResults["state"], chars_correct_correctword=checkedResults["correctWordsCorrectChars"], chars_correct_incorrectword=checkedResults["incorrectWordsCorrectChars"], chars_incorrect=checkedResults["incorrectChars"], chars_extra=checkedResults["extraChars"], chars_missed=checkedResults["missedChars"])
                db.session.add(new_test)
                db.session.commit()
                print("success")
                return "success"
            else: print("failure")
        return "failure"
    return redirect(url_for("routes.index"))