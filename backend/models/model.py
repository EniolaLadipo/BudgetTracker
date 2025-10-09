from __init__ import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer(), unique=True, primary_key=True, autoincrement=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    password_hash = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.Datetome, default=datetime.now)

    def __repr__(self):
        return {
            "id": self.id,
            "username": self.username,
            "password_hash": self.password_hash
        }
    

class Transaction(db.Model):
    __tablename__ = "transactions"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer(), unique=True, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id'), nullable=False)

    item = db.Column(db.String(), nullable=False)
    amount = db.Column(db.Float(), nullable=False)
    category = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "item": self.item,
            "amount": self.amount,
            "category": self.category
        }    
