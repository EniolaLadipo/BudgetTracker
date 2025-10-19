from flask import Blueprint, jsonify, request
from backend import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.services.transactions_service import (
    get_transactions,
    add_transaction,
    check_add_transaction_fields_valid,
)

bp = Blueprint("dashboard", __name__)


@bp.route("/transactions", methods=["GET"])
@jwt_required()
def get_user_transactions():
    current_user_id = int(get_jwt_identity())

    try:
        transactions = get_transactions(current_user_id)

        if not transactions:
            return jsonify({"error": "User does not exist"}), 400

        return jsonify(transactions), 200

    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {e}")
        return jsonify({"error": "Failed to return user transactions"}), 500


@bp.route("/transactions/add", methods=["POST"])
@jwt_required()
def add_user_transaction():
    current_user_id = int(get_jwt_identity())

    try:
        data = request.get_json()

        item = data.get("item")
        amount = data.get("amount")
        category = data.get("category")

        if check_add_transaction_fields_valid(item, amount, category):

            add_transaction(current_user_id, item, amount, category)

            response = {"message": "Transaction Added Successfully"}
            return jsonify(response), 200

        else:

            response = {"message": "Invalid Field Values"}
            return jsonify(response), 400

    except Exception as e:
        db.session.rollback()
        print(f"Error occurred: {e}")
        return jsonify({"error": "Failed to add new user transaction"}), 500
