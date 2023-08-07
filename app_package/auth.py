from itsdangerous import URLSafeTimedSerializer
from flask import current_app

def generate_email_token(email) :
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    return serializer.dumps(email, salt=current_app.config["EMAIL_CONFIRM_SALT"])

# Expiration : 1 hour
def confirm_email_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
    try:
        email = serializer.loads(
            token, salt=current_app.config["EMAIL_CONFIRM_SALT"], max_age=expiration
        )
        return email
    except Exception:
        return False