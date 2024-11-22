import os
import jwt
import datetime
from jwt import PyJWKClient

COGNITO_SIGN_URL=os.getenv('COGNITO_SIGN_URL')
COGNITO_AUDIENCE=os.getenv('COGNITO_AUDIENCE')

USER_DASHBOARD_URL=os.getenv('USER_DASHBOARD_URL', '')
AGENT_DASHBOARD_URL=os.getenv('AGENT_DASHBOARD_URL', '')
CLIENT_DASHBOARD_URL=os.getenv('CLIENT_DASHBOARD_URL', '')

def build_dashboard_url(user_id, role, client_id):
    dashboard_url = USER_DASHBOARD_URL
    if role == "agent":
        dashboard_url = AGENT_DASHBOARD_URL
    elif role == "client":
        dashboard_url = CLIENT_DASHBOARD_URL
    
    return dashboard_url.replace("CLIENT_ID", client_id).replace("USER_ID", user_id)

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