from flask import current_app, json
from . import db
import re
from .models import Users

def checkRegister(formData):
    validity = {
        "error": False,
        "messages": [],
        "categories": [],
    }
    username = (formData.get("username")).lower()
    email = formData.get("email")
    password = formData.get("password")
    confirmation = formData.get("confirmation")

    # Requirements : 8-24 characters, only letters and numbers
    username_regex = r"^[a-z\d]{8,24}$"
    if not re.fullmatch(username_regex, username) :
        validity["error"] = True
        validity["messages"].append("Username does not meet requirements")
        validity["categories"].append("error")

    email_regex = r'^[^\"\'\:\;\{\}\[\]]+@[\w\.]+\.[a-zA-Z0-9]+$'
    if not re.fullmatch(email_regex, email) :
        validity["error"] = True
        validity["messages"].append("Invalid email address")
        validity["categories"].append("error")

    if not validity["error"] :
        check_username_in_db = Users.query.filter_by(username=username).first()
        if check_username_in_db :
            validity["error"] = True
            validity["messages"].append("Username already exists.")
            validity["categories"].append("error")

        check_email_in_db = Users.query.filter_by(email=email).first()
        if check_email_in_db :
            validity["error"] = True
            validity["messages"].append("An account is already registered with that email.")
            validity["categories"].append("error")

    else : 
        email = ""
        username = ""

    # Requirements : 8-24 characters, at least one uppercase, one lowercase and one number
    password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,24}$"
    if not re.fullmatch(password_regex, password) :
        validity["error"] = True
        validity["messages"].append("Password does not meet requirements.")
        validity["categories"].append("error")

    if password != confirmation :
        validity["error"] = True
        validity["messages"].append("Passwords don't match.")
        validity["categories"].append("error")
    return_value = {
        "validity": validity,
        "username": username,
        "email": email,
        "password": password
    }
    return return_value

def checkResults(results):
    modes = []
    languages = []

    root_dir = current_app.config["ROOT_DIRECTORY"]
    with open(f"{root_dir}/app_package/static/modes/modes_list.json", "r", encoding="utf-8") as file:
        modes = json.load(file)
    with open(f"{root_dir}/app_package/static/languages/languages_list.json", "r", encoding="utf-8") as file:
        languages = json.load(file)

    checkedResults = {
        "validity": True,
    }

    if (results["mode"] in list(modes.keys())):
        checkedResults["mode"] = results["mode"]
    else:
        checkedResults["validity"] = False
        return checkedResults

    if (results["language"] in languages):
        checkedResults["language"] = results["language"]
    else:
        checkedResults["validity"] = False
        return checkedResults

    if ("time" in results["mode"]):
        if (int(results["time"]) in modes[checkedResults["mode"]]):
            checkedResults["time"] = int(results["time"])
        else:
            checkedResults["validity"] = False
            return checkedResults
    else:
        checkedResults["time"] = None

    if ("words" in results["mode"]):
        if (int(results["words"]) in modes[checkedResults["mode"]]):
            checkedResults["words"] = int(results["words"])
        else:
            checkedResults["validity"] = False
            return checkedResults
    else:
        checkedResults["words"] = None

    if (float(results["wpm"]) >= 0 and float(results["wpm"]) < 350):
        checkedResults["wpm"] = float(results["wpm"])
    else:
        checkedResults["validity"] = False
        return checkedResults

    if (float(results["rawWpm"]) >= 0 and float(results["rawWpm"]) < 350 and float(results["rawWpm"]) >= checkedResults["wpm"]):
        checkedResults["rawWpm"] = float(results["rawWpm"])
    else:
        checkedResults["validity"] = False
        return checkedResults

    if (float(results["accuracy"]) >= 0 and float(results["accuracy"] <= 1)):
        checkedResults["accuracy"] = float(results["accuracy"])
    else:
        checkedResults["validity"] = False
        return checkedResults

    if (results["state"] in ["inactive", "active", "completed", "cancelled"]):
        checkedResults["state"] = results["state"]
    else:
        checkedResults["validity"] = False
        return checkedResults

    for key in results["inputStats"]["wpmStats"] :
        if (int(results["inputStats"]["wpmStats"][key]) >= 0):
            checkedResults[key] = int(results["inputStats"]["wpmStats"][key])
        else:
            checkedResults["validity"] = False
            return checkedResults

    return checkedResults