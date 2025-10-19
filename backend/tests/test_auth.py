from backend.models.user import User


def test_register_user_success_200(client, app):
    data = {"username": "new_user456", "password": "new_password456"}

    response = client.post("/register", json=data)
    json_data = response.get_json()

    assert response.status_code == 200

    assert "message" in json_data
    assert json_data["message"] == "Registration Successful"

    with app.app_context():
        user = User.query.filter_by(username="new_user456").first()

        assert user is not None


def test_login_success_200(client, app, test_user):
    data = {"username": test_user.username, "password": "test_password123"}

    response = client.post("/login", json=data)

    assert response.status_code == 200
    json_data = response.get_json()

    assert "message" in json_data
    assert json_data["message"] == "Login Successful"

    with app.app_context():
        user = User.query.filter_by(username=test_user.username).first()

        assert user is not None
