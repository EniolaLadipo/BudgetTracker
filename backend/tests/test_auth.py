from backend.models.user import User
from backend.services.users_service import get_user, verify_account
from werkzeug.security import generate_password_hash, check_password_hash


def test_register_user_account__success_200(client, app):
    data = {"username": "new_user456", "password": "new_password456"}

    response = client.post("/register", json=data)
    json_data = response.get_json()

    assert response.status_code == 200

    assert "message" in json_data
    assert json_data["message"] == "Registration Successful"

    with app.app_context():
        user = User.query.filter_by(username="new_user456").first()

        assert user is not None


def test_register_user_account__already_exists_400(client, app, test_user):
    data = {"username": test_user.username, "password": "test_password123"}

    response = client.post("register", json=data)
    json_data = response.get_json()

    assert response.status_code == 400

    assert "error" in json_data
    assert json_data["error"] == "Account already exists"

    with app.app_context():
        user = get_user(username=test_user.username)

        assert user is not None


def test_login__success_200(client, app, test_user):
    data = {"username": test_user.username, "password": "test_password123"}

    response = client.post("/login", json=data)

    assert response.status_code == 200
    json_data = response.get_json()

    assert "message" in json_data
    assert json_data["message"] == "Login Successful"

    with app.app_context():
        user = get_user(username=test_user.username)

        assert user is not None


def test_login__incorrect_username_400(client, app, test_user):
    bad_username = "bad_user123"

    data = {"username": bad_username, "password": "test_password123"}

    response = client.post("/login", json=data)

    assert response.status_code == 400
    json_data = response.get_json()

    assert "error" in json_data
    assert json_data["error"] == "Username or Password were incorrect"

    assert bad_username != test_user.username
    assert check_password_hash(test_user.password_hash, "test_password123")

    with app.app_context():
        user = verify_account(username=bad_username, password="test_password123")

        assert user is None


def test_login__incorrect_password_400(client, app, test_user):

    bad_password = "bad_password123"

    data = {"username": test_user.username, "password": bad_password}

    response = client.post("/login", json=data)

    assert response.status_code == 400
    json_data = response.get_json()

    assert "error" in json_data
    assert json_data["error"] == "Username or Password were incorrect"

    assert test_user.username == "test_user123"
    assert not check_password_hash(test_user.password_hash, bad_password)

    with app.app_context():
        user = verify_account(test_user.username, bad_password)

        assert user is None
