import os
import sys
sys.stdout.flush()
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
loaded = load_dotenv('.env')

from .services.secret_service import SecretService
app = Flask(__name__)

region = os.getenv("AWS_REGION", "us-east-1")
secret_name = os.getenv('SECRET_NAME')
SecretService(secret_name, region).load_secret_to_env()

from .blueprints import register_blueprints
from .models.model import initdb, session

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

origins = os.getenv("ORIGINS", "*")

CORS(app, resources={r"/*": {
    "origins": origins,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
    print("ServicioChannel is running on 5000")