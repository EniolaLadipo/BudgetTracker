import pytest
from backend import create_app, db
from backend.config import TestConfig
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.user import User


@pytest.fixture()
def app():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def test_user(app):
    hashed_password = generate_password_hash("test_password123")
    new_test_user = User(username="test_user123", password_hash=hashed_password)
    db.session.add(new_test_user)
    db.session.commit()

    return new_test_user
