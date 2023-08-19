class Config(object):
    SECRET_KEY = b"randombytes"
    EMAIL_CONFIRM_SALT = b"randombytes"
    SQLALCHEMY_DATABASE_URI = 'mariadb+mariadbconnector://mysql:@localhost:3306/typingtest'

    # Flask Mail settings
    MAIL_DEFAULT_SENDER = "example@app.com"
    MAIL_SERVER = "smtp.app.com"
    MAIL_PORT = 999
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_DEBUG = False
    MAIL_USERNAME = "example@app.com"
    MAIL_PASSWORD = "examplepassword"

    # Path
    ROOT_DIRECTORY = "/home/maxime/documents/github/typing-test/"