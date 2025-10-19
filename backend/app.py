from dotenv import load_dotenv
from flask_cors import CORS
from backend.config import Config
from backend import create_app
import os

load_dotenv()

allowed_origins = os.getenv("ORIGINS_ALLOWED")


def start():
    app = create_app(config=Config)
    CORS(
        app,
        resources={r"/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True,
    )

    return app


if __name__ == "__main__":
    start().run(debug=True)
