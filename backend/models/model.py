from __init__ import db

class User(db.Model):
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer(), unique=True, primary_key=True, autoincrement=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    password_hash = db.Column(db.String(), nullable=False)

    def __repr__(self):
        return f"""{{"id": {self.id},"username": "{self.username}","password": "{self.password_hash}"}}"""