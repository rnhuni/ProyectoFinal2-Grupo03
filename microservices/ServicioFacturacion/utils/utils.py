import os
import jwt
from jwt import PyJWKClient

COGNITO_SIGN_URL = os.getenv('COGNITO_SIGN_URL')
COGNITO_AUDIENCE = os.getenv('COGNITO_AUDIENCE')

def decode_user(auth_header):
    if not auth_header or len(auth_header.split(" ")) < 2:
        raise Exception("Invalid token format")
    
    try:
        token = auth_header.split(" ")[1].strip()
        jwk_client = PyJWKClient(COGNITO_SIGN_URL)

        # Obtener la clave de firma del token
        signing_key = jwk_client.get_signing_key_from_jwt(token)

        # Decodificar el token
        token_payload = jwt.decode(
            token,
            key=signing_key.key,
            algorithms=["RS256"],
            audience=COGNITO_AUDIENCE
        )

        # Extraer datos de usuario, usando `.get` para campos opcionales
        return {
            "id": token_payload.get("sub"),
            "name": token_payload.get("name"),
            "email": token_payload.get("email"),
            "client": token_payload.get("custom:client")  # Usa `get` para evitar KeyError si no está presente
        }
    
    except jwt.ExpiredSignatureError:
        # Error específico para token expirado
        raise Exception("Token has expired")
    except jwt.InvalidAudienceError:
        # Error específico si la audiencia es incorrecta
        raise Exception("Invalid audience")
    except jwt.InvalidTokenError:
        # Error general de token inválido
        raise Exception("Invalid token")
