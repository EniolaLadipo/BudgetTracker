from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.user import User
from __init__ import db

def register_new_user(username, password):

    hashed = generate_password_hash(password)
    new_user = User(
        username=username,
        password_hash=hashed
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user

def verify_account(username, password):

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        return user
    else:
        return None