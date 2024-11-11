from flask import Blueprint, request, jsonify
from ServicioSistema.commands.permission_create import CreatePermission
from ServicioSistema.commands.permission_exists import ExistsPermission
from ServicioSistema.commands.permission_update import UpdatePermission
from ServicioSistema.commands.permission_get import GetPermission
from ServicioSistema.commands.permission_get_all import GetAllPermissions

from ServicioSistema.utils import build_permission_id

permissions_bp = Blueprint('permissions_bp', __name__)

@permissions_bp.route('/permissions', methods=['POST'])
def create_permission():
    try:
        data = request.get_json()
        name = data.get('name').strip()
        resource = data.get('resource').strip()
        description = data.get('description').strip()

        if not name or not resource or len(name) < 1 or len(resource) < 1:
            return "Invalid parameters", 400

        id = build_permission_id(resource, name)
        if ExistsPermission(id=id).execute():
            return "Already exists", 400
        
        data = CreatePermission(id, name, resource, description).execute()

        return jsonify({
            "id": data.id,
            "name": data.name,
            "resource": data.resource,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create permission failed. Details: {str(e)}'}), 500
    
@permissions_bp.route('/permissions/<permission_id>', methods=['GET'])
def get_permission(permission_id):
    try:
        permission = GetPermission(id=permission_id).execute()

        if permission is None:
            return "Permission does not exist", 404

        return jsonify({
            "id": permission.id,
            "name": permission.name,
            "resource": permission.resource,
            "description": permission.description,
            "created_at": permission.createdAt.isoformat(),
            "updated_at": permission.updatedAt.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving permission. Details: {str(e)}'}), 500
    

@permissions_bp.route('/permissions', methods=['GET'])
def get_all_permissions():
    try:
        permissions = GetAllPermissions().execute()

        return jsonify([{
            "id": perm.id,
            "name": perm.name,
            "resource": perm.resource,
            "description": perm.description,
            "created_at": perm.createdAt.isoformat(),
            "updated_at": perm.updatedAt.isoformat()
        } for perm in permissions]), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving permissions. Details: {str(e)}'}), 500

@permissions_bp.route('/permissions/<permission_id>', methods=['PUT'])
def edit_permission(permission_id):
    try:
        data = request.get_json()
        name = data.get('name').strip()
        resource = data.get('resource').strip()
        description = data.get('description').strip()

        if not name or not resource or len(name) < 1 or len(resource) < 1:
            return "Invalid parameters", 400

        permission = GetPermission(permission_id).execute()
        if not permission:
            return "Permission not found", 404

        new_id = build_permission_id(resource, name)
        if new_id != permission_id and ExistsPermission(id=new_id).execute():
            return "Permission with this name and resource already exists", 400

        updated_permission = UpdatePermission(permission_id, name, resource, description).execute()

        return jsonify({
            "id": updated_permission.id,
            "name": updated_permission.name,
            "resource": updated_permission.resource,
            "description": updated_permission.description,
            "updated_at": updated_permission.updatedAt.isoformat()
        }), 200

    except Exception as e:
        print(f"Error during update permission: {str(e)}")
        return jsonify({'error': f'Update permission failed. Details: {str(e)}'}), 500