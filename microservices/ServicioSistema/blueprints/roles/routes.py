from flask import Blueprint, request, jsonify
from ServicioSistema.commands.role_create import CreateRole
from ServicioSistema.commands.role_exists import ExistsRole
from ServicioSistema.commands.role_get import GetRole
from ServicioSistema.commands.role_get_all import GetAllRoles
from ServicioSistema.commands.permission_exists import ExistsPermission
from ServicioSistema.commands.role_update import UpdateRole

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
        if ExistsRole(id).execute() or id == "role-admin":
            return "Role already exists", 400
        
        valid_permissions = []
        for perm in permissions:
            permission_id = perm.get('id')
            actions = perm.get('actions', [])

            if len(actions) < 1:
                return f"Permission '{permission_id}' does not have accessLevel list values", 400

            if not ExistsPermission(id=permission_id).execute():
                return f"Permission '{permission_id}' does not exist", 400

            valid_permissions.append({
                "permission": permission_id,
                "actions": actions
            })

        if len(valid_permissions) < 1:
            return "permissions is required", 400
        
        data = CreateRole(id, name, valid_permissions).execute()

        return jsonify({
            "id": data.id,
            "name": data.name,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create role failed. Details: {str(e)}'}), 500

@roles_bp.route('/roles/<role_id>', methods=['GET'])
def get_role(role_id):
    try:
        role = GetRole(id=role_id).execute()

        if not role:
            return "Role not found", 404

        permission_dict = {}

        for rp in role.permissions:
            permission_id = rp.permission.id
            if permission_id not in permission_dict:
                permission_dict[permission_id] = {
                    "id": rp.permission.id,
                    "actions": []
                }
            permission_dict[permission_id]["actions"].append(rp.action)

        permissions = list(permission_dict.values())

        return jsonify({
            "id": role.id,
            "name": role.name,
            "permissions": permissions,
            "created_at": role.createdAt.isoformat(),
            "updated_at": role.updatedAt.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving role. Details: {str(e)}'}), 500


@roles_bp.route('/roles', methods=['GET'])
def get_all_roles():
    try:
        roles = GetAllRoles().execute()

        result = []

        for role in roles:
            permission_dict = {}

            for rp in role.permissions:
                permission_id = rp.permission.id
                if permission_id not in permission_dict:
                    permission_dict[permission_id] = {
                        "id": rp.permission.id,
                        "actions": []
                    }
                permission_dict[permission_id]["actions"].append(rp.action)

            permissions = list(permission_dict.values())

            result.append({
                "id": role.id,
                "name": role.name,
                "permissions": permissions,
                "created_at": role.createdAt.isoformat(),
                "updated_at": role.updatedAt.isoformat()
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving roles. Details: {str(e)}'}), 500
    
@roles_bp.route('/roles/<role_id>', methods=['PUT'])
def edit_role(role_id):
    try:
        data = request.get_json()
        name = data.get('name')
        permissions = data.get('permissions', [])

        if not name or len(name) < 1:
            return "Name is required", 400

        role = GetRole(role_id).execute()
        if not role:
            return "Role not found", 404
        
        new_id = build_role_id(name)
        if new_id != role_id and (ExistsRole(new_id).execute() or new_id == "role-admin"):
            return "Role with this name already exists", 400

        valid_permissions = []
        for perm in permissions:
            permission_id = perm.get('id')
            actions = perm.get('actions', [])

            if len(actions) < 1:
                return f"Permission '{permission_id}' does not have accessLevel list values", 400

            if not ExistsPermission(id=permission_id).execute():
                return f"Permission '{permission_id}' does not exist", 400

            valid_permissions.append({
                "permission": permission_id,
                "actions": actions
            })

        if len(valid_permissions) < 1:
            return "permissions is required", 400

        updated_role = UpdateRole(role_id, name, permissions).execute()

        return jsonify({
            "id": updated_role.id,
            "name": updated_role.name,
            "permissions": permissions,
            "updated_at": updated_role.updatedAt.isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': f'Update role failed. Details: {str(e)}'}), 500