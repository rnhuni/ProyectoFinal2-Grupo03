import os
import jwt
import datetime
from jwt import PyJWKClient
import re
import unicodedata

COGNITO_SIGN_URL=os.getenv('COGNITO_SIGN_URL')
COGNITO_AUDIENCE=os.getenv('COGNITO_AUDIENCE')

def build_channel_id(name):
    slug = generate_slug(name)
    return f"chan-{slug}" if not slug.startswith("chan-") else slug

def generate_slug(name):
    name = name.lower()
    name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('ascii')
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '-', name).strip('-')
    
    return name

def decode_user(auth_header):
    if not auth_header or len(auth_header.split(" ")) < 2:
        raise Exception("Invalid token")
    token = auth_header.split(" ")[1].strip()
    jwk_client = PyJWKClient(COGNITO_SIGN_URL)

    signing_key = jwk_client.get_signing_key_from_jwt(token)
    token_payload = jwt.decode(token, key=signing_key.key, algorithms=["RS256"], audience=COGNITO_AUDIENCE)

    return {
        "id": token_payload["sub"], 
        "name": token_payload["name"], 
        "email": token_payload["email"],
        "permissions": token_payload["custom:permissions"],
        "client": token_payload["custom:client"],
        "role": token_payload["custom:role"],
        "features": token_payload["custom:features"],
    }