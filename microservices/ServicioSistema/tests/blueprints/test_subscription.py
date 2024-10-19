from flask import Blueprint, request, jsonify
from ServicioSistema.commands.role_exists import ExistsRole
from ServicioSistema.commands.subscription_plan_exists import ExistsSubscriptionPlan
from ServicioSistema.commands.subscription_plan_create import CreateSubscriptionPlan
from ServicioSistema.utils import build_plan_id

subscriptions_bp = Blueprint('subscriptions_bp', __name__)

@subscriptions_bp.route('/subscriptions', methods=['POST'])
def create_plan():
    try:
        data = request.get_json()
        name = data.get('name').strip()
        description = data.get('description', '').strip()
        status = data.get('status', '').strip()

        price = float(data.get('price', 0.0))
        features = data.get('features', '').strip()
        roles = data.get('roles', [])

        if not name or len(name) < 1:
            return "Name is required", 400
        
        id = build_plan_id(name)
        if ExistsSubscriptionPlan(id).execute():
            return "Subscription plan already exists", 400

        valid_roles = []
        for role in roles:
            role_id = role.get('id')

            if not ExistsRole(id=role_id).execute():
                return f"Role '{role_id}' does not exist", 400

            valid_roles.append(role_id)

        if len(valid_roles) < 1:
            return "roles are required", 400
        
        data = CreateSubscriptionPlan(id, name, description, status, 
                                      price, features, valid_roles).execute()

        return jsonify({
            "id": data.id,
            "name": data.name,
            "description": data.description,
            "status": data.status,
            "price": float(data.price),
            "features": data.features,
            "roles": valid_roles,
            "createdAt": data.createdAt,
            "updatedAt": data.updatedAt
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create subscription plan failed. Details: {str(e)}'}), 500
