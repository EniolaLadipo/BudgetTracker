from __init__ import db
from datetime import datetime


class Transaction(db.Model):
    __tablename__ = "transactions"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer(), unique=True, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"), nullable=False)

    item = db.Column(db.String(), nullable=False)
    amount = db.Column(db.Float(), nullable=False)
    category = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.Datetime, default=datetime.now)

    def __repr__(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "item": self.item,
            "amount": self.amount,
            "category": self.category,
        }
