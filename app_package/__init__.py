from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_assets import Environment, Bundle
from flask_mail import Mail
from os import path

from .utilities.assets import bundles

# IMPORTANT : Change to .config.production.config
from .config.dev.app_config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    # Credentials to be updated on production environment
    app.config.from_object(Config)

    assets = Environment(app)
    assets.register(bundles)

    db.init_app(app)

    from .routes import routes
    app.register_blueprint(routes, url_prefix="/")

    from .models import Users

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return Users.query.get(int(id))

    return app
