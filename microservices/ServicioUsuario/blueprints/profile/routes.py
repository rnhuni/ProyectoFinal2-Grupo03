import os
import jwt
from flask import Blueprint, request, jsonify
from ServicioUsuario.utils import decode_user
from ServicioUsuario.services.cognito_service import CognitoService
from ServicioUsuario.services.monitor_service import MonitorService

profile_bp = Blueprint('profile_bp', __name__)

@profile_bp.route('/profile', methods=['GET'])
def get_profile():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        structured_permissions = {}

        for permission in user["permissions"].split(';'):
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

        cognito_status = CognitoService().get_user_status(user["email"])

        MonitorService().enqueue_event(user, "LOGIN-WEB-APP", "Login to web app")
            
        return {
            "user":
            {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "status": cognito_status,
                "client": user["client"],
                "role": user["role"]             
            },
            "views": views,
            "features": user["features"].split(';')
        }, 200
    except jwt.InvalidTokenError:
        return jsonify({"error": "Formato de token inválido"}), 400
    except Exception as e:
        return jsonify({'error': f'Error retrieving profile. Details: {str(e)}'}), 500

