from flask import Blueprint, request, jsonify
from ServicioSistema.commands.client_get_all import GetAllClients
from ServicioSistema.commands.client_update import UpdateClient
from ServicioSistema.commands.subscription_plan_exists import ExistsSubscriptionPlan
from ServicioSistema.commands.client_create import CreateClient
from ServicioSistema.commands.client_exists import ExistsClient
from ServicioSistema.utils.utils import build_client_id

clients_bp = Blueprint('clients_bp', __name__)

@clients_bp.route('/clients', methods=['GET'])
def get_all_clients():
    try:
        clients = GetAllClients().execute()

        return jsonify([{
            "id": cli.id,
            "name": cli.name,
            "subscription_plan": {
                "id": cli.active_subscription_plan.id,
                "name": cli.active_subscription_plan.name
            },
            "description": cli.description,
            "email": cli.email,
            "created_at": cli.createdAt.isoformat(),
            "updated_at": cli.updatedAt.isoformat()
        } for cli in clients]), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving clients. Details: {str(e)}'}), 500
    
@clients_bp.route('/clients/<client_id>', methods=['PUT'])
def update_client(client_id):
    try:
        data = request.get_json()
        subscription_id = data.get('subscription_id').strip()

        if not subscription_id:
            return "Invalid parameters", 400

        if not ExistsSubscriptionPlan(subscription_id).execute():
            return "Subscription plan not found", 404

        updated_client = UpdateClient(client_id, subscription_id).execute()

        return jsonify({
            "id": updated_client.id,
            "name": updated_client.name,
            "description": updated_client.description,
            "subscription_plan": {
                "id": updated_client.active_subscription_plan.id,
                "name": updated_client.active_subscription_plan.name
            },
            "created_at": updated_client.createdAt.isoformat(),
            "updated_at": updated_client.updatedAt.isoformat()
        }), 200

    except Exception as e:
        return jsonify({'error': f'Update Client failed. Details: {str(e)}'}), 500
    
@clients_bp.route('/clients', methods=['POST'])
def create_client():
    try:
        data = request.get_json()
        name = data.get('name').strip()
        description = data.get('description')
        email = data.get('email')
        subscription_id = data.get('subscription_id')

        if not name or len(name) < 1:
            return "Name is required", 400
        
        if not subscription_id or not email:
            return "Invalid parameters", 400
        
        client_id = build_client_id(name)
        if ExistsClient(client_id).execute():
            return "Client already exists", 400
        
        data = CreateClient(client_id, name, description, email, subscription_id).execute()

        return jsonify({
            "id": data.id,
            "name": data.name,
            "description": data.description,
            "email": data.email,
            "subscription_id": data.active_subscription_plan_id,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 201

    except Exception as e:
        return jsonify({'error': f'Create client failed. Details: {str(e)}'}), 500
