from flask import Blueprint, request, jsonify
from ServicioSistema.commands.role_create import CreateRole
from ServicioSistema.commands.role_exists import ExistsRole
from ServicioSistema.commands.permission_exists import ExistsPermission
from ServicioSistema.utils import build_role_id

roles_bp = Blueprint('roles_bp', __name__)

@roles_bp.route('/roles', methods=['POST'])
def create_role():
    try:
        data = request.get_json()
        name = data.get('name').strip()
        permissions = data.get('permissions', [])

        if not name or len(name) < 1:
            return "Name is required", 400
        
        id = build_role_id(name)
        if ExistsRole(id).execute():
            return "Role already exists", 400
        
        valid_permissions = []
        for perm in permissions:
            permission_id = perm.get('id')
            scopes = perm.get('scopes', [])

            if len(scopes) < 1:
                return f"Permission '{permission_id}' does not have accessLevel list values", 400

            if not ExistsPermission(id=permission_id).execute():
                return f"Permission '{permission_id}' does not exist", 400

            valid_permissions.append({
                "permission": permission_id,
                "scopes": scopes
            })

        if len(valid_permissions)< 1:
            return "permissions is required", 400
        
        data = CreateRole(id, name, valid_permissions).execute()

        return jsonify({
            "id": data.id,
            "name": data.name,
            "createdAt": data.createdAt,
            "updatedAt": data.updatedAt
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create permission failed. Details: {str(e)}'}), 500