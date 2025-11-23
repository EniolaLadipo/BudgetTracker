from backend import db
from datetime import datetime, timezone


class Transaction(db.Model):
    __tablename__ = "transactions"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer(), unique=True, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer(), db.ForeignKey("users.id"), nullable=False)

    item = db.Column(db.String(), nullable=False)
    amount = db.Column(db.Float(), nullable=False)
    category = db.Column(db.String(), nullable=False)
    created_at = db.Column(
        db.DateTime, nullable=False, default=datetime.now(timezone.utc)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "item": self.item,
            "amount": self.amount,
            "category": self.category,
            "created_at": self.created_at.strftime("%b %d, %Y %I:%M %p"),
        }
