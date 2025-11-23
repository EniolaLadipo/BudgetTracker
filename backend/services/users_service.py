from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.user import User
from backend import db


def get_user(username: str) -> User | None:
    user = User.query.filter_by(username=username).first()

    if not user:
        return None

    return user


def register_new_user(username: str, password: str) -> User | None:

    hashed = generate_password_hash(password)

    user = User.query.filter_by(username=username).first()

    if user:
        return None

    new_user = User(username=username, password_hash=hashed)

    db.session.add(new_user)
    return new_user


def verify_account(username: str, password: str) -> User | None:

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        return user
    else:
        return None


def check_user_exists(user_id: int) -> User | None:
    user = User.query.filter_by(id=user_id).first()
    return user
