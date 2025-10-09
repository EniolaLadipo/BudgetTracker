from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint("dashboard", __name__)


@bp.route("/dashboard")
@jwt_required()
def show_dashboard():
    current_user = get_jwt_identity()
    response = {"logged_in_as": current_user, "status": "good"}

    return jsonify(response), 200
