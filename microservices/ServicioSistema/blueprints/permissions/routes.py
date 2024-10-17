from flask import Blueprint, request, jsonify
from ServicioSistema.commands.permission_create import CreatePermission
from ServicioSistema.commands.permission_exists import ExistsPermission
from ServicioSistema.utils import build_permission_id

permissions_bp = Blueprint('permissions_bp', __name__)

@permissions_bp.route('/permissions', methods=['POST'])
def create_permission():
    try:
        data = request.get_json()
        name = data.get('name').strip()
        service = data.get('service').strip()
        description = data.get('description').strip()

        if not name or not service or len(name) < 1 or len(service) < 1:
            return "Invalid parameters", 400

        id = build_permission_id(service, name)
        if ExistsPermission(id=id).execute():
            return "Already exists", 400
        
        data = CreatePermission(id, name, service, description).execute()

        return jsonify({
            "id": data.id,
            "name": data.name,
            "service": data.service,
            "createdAt": data.createdAt,
            "updatedAt": data.updatedAt
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create permission failed. Details: {str(e)}'}), 500