from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    # Credentials to be updated on production environment
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mariadb+mariadbconnector://mysql:@localhost:3306/typingtest'
    db.init_app(app)

    from .routes import routes
    app.register_blueprint(routes, url_prefix="/")

    return app
