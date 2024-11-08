from flask import Blueprint, request, jsonify
from ServicioSistema.commands.client_get_all import GetAllClients
from ServicioSistema.commands.client_update import UpdateClient
from ServicioSistema.commands.subscription_plan_exists import ExistsSubscriptionPlan

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
            "created_at": cli.createdAt,
            "updated_at": cli.updatedAt
        } for cli in clients]), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving clients. Details: {str(e)}'}), 500
    
@clients_bp.route('/clients/<client_id>', methods=['PUT'])
def client(client_id):
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
            "created_at": updated_client.createdAt,
            "updated_at": updated_client.updatedAt
        }), 200

    except Exception as e:
        return jsonify({'error': f'Update Client failed. Details: {str(e)}'}), 500