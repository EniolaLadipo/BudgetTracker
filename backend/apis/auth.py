from flask import Blueprint, request, jsonify
from services.users_service import register_new_user, verify_account
from __init__ import db
from flask_jwt_extended import create_access_token, set_access_cookies, unset_jwt_cookies

bp = Blueprint("auth", __name__)


@bp.route("/register", methods=["POST"])
def create_account():
    try:
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        new_user = register_new_user(username, password)
        access_token = create_access_token(identity=str(new_user.id))

        response = jsonify({
            "message": "Registration Successful",
            "user_id": new_user.id
        })

        set_access_cookies(response, access_token)

        return response, 200
    
    except Exception as e:
        db.session.rollback()
        print("Error occured: ", e)
        return jsonify({"error": "Failed to register new user"}), 500


@bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        username = data.get('username')
        password = data.get('password')

        user = verify_account(username, password)
        
        if user:
            access_token = create_access_token(identity=user.id)
            response = {
                "message": "Login Successful",
                "access_token": access_token,
                "user_id": user.id
            }

            return jsonify(response), 200
        
        else:
            return jsonify({"message": "Username or Password were incorrect"}), 400
    
    except Exception as e:
        db.session.rollback()
        print("Error occurred: ", e)
        return jsonify({"error": "Failed to login user"}), 500


@bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Logout Successful"})
    unset_jwt_cookies(response)
    return response