from flask import Blueprint, render_template, redirect, url_for, json, jsonify, request, flash, current_app
from sqlalchemy.sql import func
from werkzeug.security import generate_password_hash, check_password_hash
from . import db
from .models import Users, Tests
from flask_login import login_user, logout_user, login_required, current_user
from os import path
from .auth import generate_email_token, confirm_email_token
from .utilities.email import send_confirm_email
from .checks import checkResults, checkRegister
from .utilities.queries import *

routes = Blueprint("routes", __name__)

@routes.route("/")
def index():
    username = ""
    if current_user.is_authenticated :
        username = current_user.username

    return render_template("base.html", is_logged_in=current_user.is_authenticated, username=username)

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
            subject = "TPWRTR : Please confirm your email"
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

@routes.route("/api/wordlist/<token>", methods=["GET"])
def wordlist(token):
    root_dir = current_app.config["ROOT_DIRECTORY"]
    with open(f"{root_dir}/app_package/static/languages/{token}.json", "r", encoding="utf-8") as file:
        words = json.load(file)
        return json.dumps(words)

@routes.route("/api/results", methods=["POST", "GET"])
def results():
    if request.method == "POST":
        content_type = request.headers.get("Content-Type")
        if current_user.is_authenticated and (content_type == "application/json") :
            results = request.json   
            checkedResults = checkResults(results)

            if checkedResults["validity"]:
                new_test = Tests(user_id=current_user.id, mode=checkedResults["mode"], language=checkedResults["language"], time=checkedResults["time"], words=checkedResults["words"], wpm=checkedResults["wpm"], raw_wpm=checkedResults["rawWpm"], accuracy=checkedResults["accuracy"], state=checkedResults["state"], chars_correct_correctword=checkedResults["correctWordsCorrectChars"], chars_correct_incorrectword=checkedResults["incorrectWordsCorrectChars"], chars_incorrect=checkedResults["incorrectChars"], chars_extra=checkedResults["extraChars"], chars_missed=checkedResults["missedChars"])
                db.session.add(new_test)
                db.session.commit()
                print("success")
                return "success"
            else: print("failure")
        return "failure"
    return redirect(url_for("routes.index"))

@routes.route("/api/leaderboards")
def leaderboards():
    leaderboards = {
        "15": {},
        "60": {},
    }
    
    for key in leaderboards:
        query = leaderboards_query(key)
        query_result = db.session.execute(query).fetchall()
        n = 1
        for row in query_result:
            leaderboards[key][n] = {
                "username": row[0],
                "wpm": row[1],
                "accuracy": row[2],
                "timestamp": row[3]
            }
            n = n + 1

    return jsonify(leaderboards)

@routes.route("/api/profile")
def profile():
    if not current_user.is_authenticated:
        return redirect(url_for("routes.index"))

    user_id = current_user.id
    profile_info = {
        "highscores": {
            "time": {},
            "words": {}
        },
        "stats": {
            "tests": {},
            "wpm": {},
            "rawwpm": {},
            "accuracy": {}
        },
        "history": {}
    }

    for key in profile_info["highscores"]:
        query = highscores_query(user_id, key)
        query_result = db.session.execute(query).fetchall()
        for row in query_result:
            profile_info["highscores"][key][row[0]] = row[1]

    stats_test_states = ['completed', 'started']
    for state in stats_test_states :
        query = stats_tests_query(user_id, state)
        query_result = db.session.execute(query).fetchall()
        profile_info["stats"]["tests"][f"{state}"] = query_result[0][0]

    stats_quantity = [0, 10] # 0 is configured to query all previous tests
    for quantity in stats_quantity:
        query = stats_query(user_id, quantity)
        query_result = db.session.execute(query).fetchall()

        profile_info["stats"]["wpm"][f"{quantity}"] = query_result[0][0]
        profile_info["stats"]["rawwpm"][f"{quantity}"] = query_result[0][1]
        profile_info["stats"]["accuracy"][f"{quantity}"] = query_result[0][2]

    history_quantity = 25
    query_history = history_query(user_id, history_quantity)
    query_history_result = db.session.execute(query_history).fetchall()

    n = 0
    for row in query_history_result:
        profile_info["history"][n] = {
            "mode": row[0],
            "language": row[1],
            "time": row[2],
            "words": row[3],
            "wpm": row[4],
            "rawwpm": row[5],
            "accuracy": row[6],
            "date": row[7],
            "charsCorrectCorrectword": row[8],
            "charsCorrectIncorrectword": row[9],
            "charsIncorrect": row[10],
            "charsExtra": row[11],
            "charsMissed": row[12]
        }
        n = n + 1

    return jsonify(profile_info)