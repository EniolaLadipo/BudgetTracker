from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    from apis.auth import bp as auth_bp
    app.register_blueprint(auth_bp)

    db.init_app(app)
    jwt.init_app(app)
    return app