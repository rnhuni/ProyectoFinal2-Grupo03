import os
import sys
sys.stdout.flush()
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
loaded = load_dotenv('.env')
from .blueprints import register_blueprints
from .models.model import initdb, session

app = Flask(__name__)
register_blueprints(app)

initdb()

@app.teardown_request
def remove_session(exception=None):
    session.remove()

@app.teardown_request
def handle_exception(exception=None):
    if exception:
        session.rollback()
    session.remove()

@app.after_request
def commit_or_rollback(response):
    try:
        session.commit()
    except Exception:
        session.rollback()
    return response

CORS(app, resources={r"/*": {
    "origins": "https://abcallg03.com",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

if __name__ == '__main__':
    print("ServicioSistema is running on 5000")