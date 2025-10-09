from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)

    from apis.auth import bp as auth_bp
    from apis.dashboard import bp as dashboard_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)

    db.init_app(app)
    jwt.init_app(app)

    @jwt.unauthorized_loader
    def missing_jwt_callback(err_str):
        print(f"Unauthorized access: {err_str}")
        return jsonify({"error": err_str}), 401
    
    return app