from flask import Blueprint, request, jsonify
from ServicioSistema.commands.role_exists import ExistsRole
from ServicioSistema.commands.subscription_plan_get import GetSubscriptionPlan
from ServicioSistema.commands.subscription_plan_get_all import GetAllSubscriptions
from ServicioSistema.commands.subscription_plan_exists import ExistsSubscriptionPlan
from ServicioSistema.commands.subscription_plan_create import CreateSubscriptionPlan
from ServicioSistema.commands.subscription_plan_update import UpdateSubscriptionPlan
from ServicioSistema.utils import build_plan_id

subscriptions_bp = Blueprint('subscriptions_bp', __name__)

@subscriptions_bp.route('/subscriptions', methods=['POST'])
def create_plan():
    try:
        data = request.get_json()
        name = data.get('name')
        description = data.get('description', '').strip()
        status = data.get('status', '').strip()
        price = data.get('price', 0.0)
        features = data.get('features', '').strip()
        roles = data.get('roles', [])

        if not name or len(name.strip()) < 1:
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

@subscriptions_bp.route('/subscriptions/<subscription_id>', methods=['GET'])
def get_subscription(subscription_id):
    try:
        subscription_plan = GetSubscriptionPlan(subscription_id).execute()

        if not subscription_plan:
            return jsonify({'error': 'Subscription plan not found'}), 404

        roles_list = [
            {"id": role.id, "name": role.name} for role in subscription_plan.roles
        ]

        return jsonify({
            "id": subscription_plan.id,
            "name": subscription_plan.name,
            "description": subscription_plan.description,
            "status": subscription_plan.status,
            "price": float(subscription_plan.price),
            "features": subscription_plan.features,
            "roles": roles_list,
            "createdAt": subscription_plan.createdAt,
            "updatedAt": subscription_plan.updatedAt
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve subscription plan. Details: {str(e)}'}), 500

@subscriptions_bp.route('/subscriptions', methods=['GET'])
def get_all_subscriptions():
    try:
        subscriptions = GetAllSubscriptions().execute()

        if not subscriptions:
            return jsonify({"message": "No subscription plans found"}), 404

        subscriptions_data = []
        for subscription in subscriptions:
            subscription_data = {
                "id": subscription.id,
                "name": subscription.name,
                "description": subscription.description,
                "status": subscription.status,
                "price": float(subscription.price),
                "features": subscription.features,
                "createdAt": subscription.createdAt,
                "updatedAt": subscription.updatedAt
            }
            
            subscription_data["roles"] = [{"id": role.id, "name": role.name} for role in subscription.roles]
            subscriptions_data.append(subscription_data) 

        return jsonify(subscriptions_data), 200

    except Exception as e:
        return jsonify({'error': f'Failed to retrieve subscription plans. Details: {str(e)}'}), 500

@subscriptions_bp.route('/subscriptions/<subscription_id>', methods=['PUT'])
def update_subscription(subscription_id):
    try:
        # Obtener los datos de la solicitud
        data = request.get_json()
        name = data.get('name')
        description = data.get('description', '').strip()
        status = data.get('status', '').strip()
        price = data.get('price', 0.0)
        features = data.get('features', '').strip()
        roles = data.get('roles', [])

        # Validar roles (puedes usar el mismo patrón que en create)
        valid_roles = []
        for role in roles:
            role_id = role.get('id')
            valid_roles.append(role_id)

        if len(valid_roles) < 1:
            return jsonify({"error": "At least one valid role is required"}), 400

        # Llamar al comando para actualizar la suscripción
        updated_subscription = UpdateSubscriptionPlan(
            subscription_id=subscription_id,
            name=name,
            description=description,
            status=status,
            price=price,
            features=features,
            roles=valid_roles
        ).execute()

        # Retornar la suscripción actualizada
        return jsonify({
            "id": updated_subscription.id,
            "name": updated_subscription.name,
            "description": updated_subscription.description,
            "status": updated_subscription.status,
            "price": float(updated_subscription.price),
            "features": updated_subscription.features,
            "roles": [{"id": role.id, "name": role.name} for role in updated_subscription.roles],
            "createdAt": updated_subscription.createdAt,
            "updatedAt": updated_subscription.updatedAt
        }), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    except Exception as e:
        return jsonify({"error": f"Failed to update subscription. Details: {str(e)}"}), 500
