import os
import sys
sys.stdout.flush()
from flask import Flask
from .blueprints import register_blueprints
from flask_cors import CORS
from dotenv import load_dotenv

loaded = load_dotenv('.env')

from .models.model import initdb

app = Flask(__name__)
register_blueprints(app)

initdb()

origins = os.getenv("ORIGINS", "")

CORS(app, resources={r"/*": {
    "origins": origins,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

if __name__ == '__main__':
    print("ServicioIncidente is running on 5000")