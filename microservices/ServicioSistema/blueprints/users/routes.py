from flask import Blueprint, request, jsonify
from ServicioSistema.commands.user_create import CreateUser
from ServicioSistema.commands.user_get import GetUser
from ServicioSistema.commands.user_get_all import GetAllUsers
from ServicioSistema.commands.user_update import UpdateUser
from ServicioSistema.commands.role_get import GetRole
from ServicioSistema.commands.client_get import GetClient
from ServicioSistema.commands.client_exists import ExistsClient
from ServicioSistema.commands.user_exists_by_email import ExistsUserByEmail

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email').strip()
        role_id = data.get('role_id').strip()
        client_id = data.get('client_id').strip()

        if not name or len(name) < 1:
            return "Name is required", 400

        if not email or len(email) < 1:
            return "Email is required", 400

        if not role_id or len(role_id) < 1:
            return "Role ID is required", 400

        if not client_id or len(client_id) < 1:
            return "Client ID is required", 400
        
        if ExistsUserByEmail(email).execute():
            return "Email is already in use", 400        

        role = GetRole(role_id).execute()
        if not role:
            return f"Role '{role_id}' does not exist", 400

        client = GetClient(client_id).execute()
        if client is None:
            return f"Client '{client_id}' does not exist", 400
                
        if client.active_subscription_plan is None:
            return f"Client '{client_id}' does not active subscription_plan", 400
        
        features = client.active_subscription_plan.features

        user = CreateUser(name, email, role, features, client_id).execute()

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role_id": user.role_id,
            "features":user.features,
            "status": user.status,
            "client_id": user.client_id,
            "created_at": user.createdAt.isoformat(),
            "updated_at": user.updatedAt.isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create user failed. Details: {str(e)}'}), 500
    
@users_bp.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user = GetUser(user_id).execute()
        
        if not user:
            return "User not found", 404
        
        role_name = user.role.name if user.role else None
        client_name = user.client.name if user.client else None

        return jsonify({
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "cognito_id": user.cognito_id,
            "role_id": user.role_id,
            "role_name": role_name,
            "client_id": str(user.client_id),
            "client_name": client_name,
            "created_at": user.createdAt.isoformat(),
            "updated_at": user.updatedAt.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve user. Details: {str(e)}'}), 500

@users_bp.route('/users', methods=['GET'])
def get_all_users():
    try:
        users = GetAllUsers().execute()

        users_data = []
        for user in users:
            role_name = user.role.name if user.role else None
            client_name = user.client.name if user.client else None

            users_data.append({
                "id": str(user.id),
                "name": user.name,
                "email": user.email,
                "cognito_id": user.cognito_id,
                "role_id": user.role_id,
                "role_name": role_name,
                "client_id": str(user.client_id),
                "client_name": client_name,
                "created_at": user.createdAt.isoformat(),
                "updated_at": user.updatedAt.isoformat()
            })

        return jsonify(users_data), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve users. Details: {str(e)}'}), 500

@users_bp.route('/users/<user_id>', methods=['PUT'])
def edit_user(user_id):
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        role_id = data.get('role_id', '').strip()
        client_id = data.get('client_id', '').strip()

        if not name or len(name) < 1:
            return "Name is required", 400

        if not email or len(email) < 1:
            return "Email is required", 400

        if not role_id or len(role_id) < 1:
            return "Role ID is required", 400

        if not client_id or len(client_id) < 1:
            return "Client ID is required", 400

        user = GetUser(user_id).execute()
        if not user:
            return f"User with id '{user_id}' not found", 404

        if ExistsUserByEmail(email).execute() and email != user.email:
            return "Email is already in use", 400

        role = GetRole(role_id).execute()
        if not role:
            return f"Role '{role_id}' does not exist", 400

        if not ExistsClient(client_id).execute():
            return f"Client '{client_id}' does not exist", 400

        updated_user = UpdateUser(user_id, name, email, role_id, client_id).execute()

        return jsonify({
            "id": str(updated_user.id),
            "name": updated_user.name,
            "email": updated_user.email,
            "cognito_id": updated_user.cognito_id,
            "role_id": updated_user.role_id,
            "client_id": str(updated_user.client_id),
            "created_at": updated_user.createdAt.isoformat(),
            "updated_at": updated_user.updatedAt.isoformat()
        }), 200

    except ValueError as e:
        return str(e), 404
    except Exception as e:
        return jsonify({'error': f'Failed to update user. Details: {str(e)}'}), 500