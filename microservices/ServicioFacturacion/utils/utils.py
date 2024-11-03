import os
import jwt
from jwt import PyJWKClient

COGNITO_SIGN_URL = os.getenv('COGNITO_SIGN_URL', '')
COGNITO_AUDIENCE = os.getenv('COGNITO_AUDIENCE', '')

def decode_user(auth_header):
    if not auth_header or len(auth_header.split(" ")) < 2:
        raise Exception("Invalid token format")
    
    if os.getenv('ENV') == 'test':
        return {
            "id": "id",
            "name": "name",
            "email": "email",
            "client": "client"
        }
    
    try:
        token = auth_header.split(" ")[1].strip()
        jwk_client = PyJWKClient(COGNITO_SIGN_URL)

        signing_key = jwk_client.get_signing_key_from_jwt(token)

        token_payload = jwt.decode(
            token,
            key=signing_key.key,
            algorithms=["RS256"],
            audience=COGNITO_AUDIENCE
        )

        return {
            "id": token_payload.get("sub"),
            "name": token_payload.get("name"),
            "email": token_payload.get("email"),
            "client": token_payload.get("custom:client")
        }
    
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidAudienceError:
        raise Exception("Invalid audience")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")
