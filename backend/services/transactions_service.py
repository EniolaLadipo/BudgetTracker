from backend import db
from backend.models.transaction import Transaction
from backend.services.users_service import check_user_exists


def get_transactions(user_id):

    user = check_user_exists(user_id)

    if not user:
        return None

    transactions = Transaction.query.filter_by(user_id=user_id).all()
    return [t.to_dict() for t in transactions]


def add_transaction(user_id, item, amount, category):

    user = check_user_exists(user_id)

    if not user:
        return None

    new_transaction = Transaction(
        user_id=user_id, item=item, amount=amount, category=category
    )

    db.session.add(new_transaction)
    db.session.commit()


def check_add_transaction_fields_valid(item, amount, category):
    if not (item or amount or category):
        return False

    if item == "" or category == "":
        return False

    if amount < 0:
        return False

    return True
