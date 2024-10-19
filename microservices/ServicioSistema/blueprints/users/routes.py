from flask import Blueprint, request, jsonify
from ServicioSistema.commands.user_create import CreateUser
from ServicioSistema.commands.role_get import GetRole
from ServicioSistema.commands.client_exists import ExistsClient
from ServicioSistema.commands.user_exists_by_email import ExistsUserByEmail

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        name = data.get('name').strip()
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

        if not ExistsClient(client_id).execute():
            return f"Client '{client_id}' does not exist", 400

        user = CreateUser(name, email, role, client_id).execute()

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role_id": user.role_id,
            "status": user.status,
            "client_id": user.client_id,
            "createdAt": user.createdAt,
            "updatedAt": user.updatedAt
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create user failed. Details: {str(e)}'}), 500

@users_bp.route('/users', methods=['PUT'])
def edit_user():
    #try:
        data = request.get_json()
        username = data['username']
        attributes = data['attributes']

        user_attributes = [{'Name': key, 'Value': value} for key, value in attributes.items()]

        """ response = cognito_client.admin_update_user_attributes(
            UserPoolId=USER_POOL_ID,
            Username=username,
            UserAttributes=user_attributes
        ) """

        return jsonify({'message': f'Usuario {username} actualizado exitosamente.', 'response': "response"}), 200
    #except KeyError as e:
    #    return jsonify({'error': f'Faltan parámetros necesarios: {str(e)}'}), 400
    #except Exception as e:
    #    return jsonify({'error': f'Error al actualizar el usuario: {str(e)}'}), 500
