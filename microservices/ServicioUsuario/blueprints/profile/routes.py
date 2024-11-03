import os
import jwt
from flask import Blueprint, request, jsonify
from ServicioUsuario.services.cognito_service import CognitoService
from jwt import PyJWKClient

profile_bp = Blueprint('profile_bp', __name__)

COGNITO_SIGN_URL=os.getenv('COGNITO_SIGN_URL')
COGNITO_AUDIENCE=os.getenv('COGNITO_AUDIENCE')

@profile_bp.route('/profile', methods=['GET'])
def get_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Token de autorización no encontrado o inválido"}), 400

    token = auth_header.split(" ")[1].strip()
    jwk_client = PyJWKClient(COGNITO_SIGN_URL)

    try:
        signing_key = jwk_client.get_signing_key_from_jwt(token)
        token_payload = jwt.decode(token, key=signing_key.key, algorithms=["RS256"], audience=COGNITO_AUDIENCE)

        permissions = token_payload["custom:permissions"].split(';')
        structured_permissions = {}

        for permission in permissions:
            if permission:
                parts = permission.split(':')
                menu, action = parts[0].split('-')[1:], parts[1]
                menu_key = menu[0]
                menu_section = menu[1]
                if menu_key not in structured_permissions:
                    structured_permissions[menu_key] = {
                        "id": menu_key,
                        "menu": menu_section,
                        "actions": set()
                    }
                structured_permissions[menu_key]["actions"].add(action)

        views = []
        for item in structured_permissions.values():
            item["actions"] = list(item["actions"])
            views.append(item)

        cognito_status = CognitoService().get_user_status(token_payload["email"])
            
        return {
            "user":
            {
                "id": token_payload["sub"],
                "name": token_payload["name"],
                "email": token_payload["email"],
                "status": cognito_status,
                "client": token_payload["custom:client"],
                "role": token_payload["custom:role"]             
            },
            "views": views,
            "features": token_payload["custom:features"].split(';')
        }, 200
    except jwt.InvalidTokenError:
        return jsonify({"error": "Formato de token inválido"}), 400
    except Exception as e:
        return jsonify({'error': f'Error retrieving profile. Details: {str(e)}'}), 500

