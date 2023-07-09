from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

app = Flask(__name__)

# Credentials to be updated on production environment
app.config['SQLALCHEMY_DATABASE_URI'] = 'mariadb+mariadbconnector://mysql:@localhost:3306/typingtest'

db = SQLAlchemy(app)

@app.route('/')
def index():
    #Test for database query
    result = db.session.execute(text('SELECT * FROM test')).all()
    return render_template("index.html", template_check="Template working", result=result)
