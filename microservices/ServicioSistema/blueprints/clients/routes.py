from flask import Blueprint, request, jsonify
from ServicioSistema.commands.client_get_all import GetAllClients

clients_bp = Blueprint('clients_bp', __name__)

@clients_bp.route('/clients', methods=['GET'])
def get_all_clients():
    try:
        clients = GetAllClients().execute()

        return jsonify([{
            "id": perm.id,
            "name": perm.name,
            "description": perm.description,
            "createdAt": perm.createdAt,
            "updatedAt": perm.updatedAt
        } for perm in clients]), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving clients. Details: {str(e)}'}), 500
    
@clients_bp.route('/clients/<client_id>', methods=['PUT'])
def update_client(client_id):
    try:
        return "OK", 200
    except Exception as e:
        return jsonify({'error': f'Error to update client. Details: {str(e)}'}), 500