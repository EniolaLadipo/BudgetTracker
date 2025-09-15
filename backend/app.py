import os

from dotenv import load_dotenv
from flask_cors import CORS
from config import Config
from __init__ import create_app

load_dotenv()


def start():
    app = create_app(config=Config)
    CORS(
        app,
        resources={
            r"/*": {"origins": "*", "methods": ["GET", "POST", "PATCH", "DELETE"]}
        },
        supports_credentials=True,
    )

    return app


if __name__ == "__main__":
    start().run(debug=True)
