from typing import List
from backend import db
from datetime import datetime, timedelta, timezone
from backend.models.transaction import Transaction
from backend.services.users_service import check_user_exists


def reformat_date(date: str) -> str:
    return date.stfrtime


def get_transactions_since(
    user_id: int, timespan: timedelta
) -> List[Transaction] | None:

    user = check_user_exists(user_id)

    if not user:
        return None

    since = datetime.now(timezone.utc) - timespan

    transactions = (
        Transaction.query.filter(Transaction.user_id == user_id)
        .filter(Transaction.created_at >= since)
        .all()
    )

    return [t.to_dict() for t in transactions]


def get_transaction(user_id: int) -> Transaction | None:
    user = check_user_exists(user_id)

    if not user:
        return None

    transaction = Transaction.query.filter_by(user_id=user_id).first()

    if not transaction:
        return None

    return transaction


def get_transactions(user_id: int) -> List[Transaction] | None:

    user = check_user_exists(user_id)

    if not user:
        return None

    transactions = Transaction.query.filter_by(user_id=user_id).all()
    return [t.to_dict() for t in transactions]


def add_transaction(
    user_id: int, item: str, amount: float, category: str
) -> Transaction | None:

    user = check_user_exists(user_id)

    if not user:
        return None

    new_transaction = Transaction(
        user_id=user_id, item=item, amount=amount, category=category
    )

    db.session.add(new_transaction)
    return new_transaction


def delete_transaction(user_id: int, transaction_id: int) -> int | None:

    user = check_user_exists(user_id)

    if not user:
        return None

    if check_if_transaction_exist(transaction_id):

        transaction = Transaction.query.filter_by(
            id=transaction_id, user_id=user_id
        ).first()

        db.session.delete(transaction)
        return transaction.id

    else:
        return None


def check_if_transaction_exist(transaction_id: int) -> bool:
    transaction = Transaction.query.filter_by(id=transaction_id).first()

    if not transaction:
        return False

    return True


def check_add_transaction_fields_valid(item: str, amount: float, category: str) -> bool:

    if not (item or amount or category):
        return False

    if item == "" or category == "":
        return False

    if amount < 0:
        return False

    return True
