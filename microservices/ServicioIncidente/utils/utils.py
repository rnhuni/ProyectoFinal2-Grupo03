import os
import jwt
import datetime
from jwt import PyJWKClient

COGNITO_SIGN_URL=os.getenv('COGNITO_SIGN_URL')
COGNITO_AUDIENCE=os.getenv('COGNITO_AUDIENCE')

def build_incident_id():
    current_time = datetime.datetime.now()
    date_str = current_time.strftime("%y%m%d")
    time_str = current_time.strftime("%H%M%S") + f"{current_time.microsecond // 1000:03d}"
    return f"TKT-{date_str}-{time_str}"

def build_channel_name(slug):
    if slug.startswith("chan-"):
        slug = slug[len("chan-"):]
    
    slug = slug.replace("-", " ")
    
    return " ".join(word.capitalize() for word in slug.split(" "))

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
        "role_type": token_payload["custom:role"].split("-")[1]
    }