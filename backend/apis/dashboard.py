from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("dashboard", __name__)

@bp.route("/dashboard")

def show_dashboard():
    
    response = {
        "message": "This is the dashboard page",
        "status": "good"
    }

    return jsonify("message")