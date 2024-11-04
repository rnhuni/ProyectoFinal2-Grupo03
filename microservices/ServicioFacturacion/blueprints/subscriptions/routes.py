import json
import uuid
import traceback
from flask import Blueprint, request, jsonify
from ServicioFacturacion.utils import decode_user
from ServicioFacturacion.commands.active_subscription_exists import ActiveSubscriptionExists
from ServicioFacturacion.commands.active_subscription_get import GetActiveSubscription
from ServicioFacturacion.commands.active_subscription_get_all import GetAllSubscriptions
from ServicioFacturacion.services.system_service import SystemService
from ServicioFacturacion.commands.active_subscription_create import CreateActiveSubscription
from ServicioFacturacion.commands.active_subscription_update import UpdateActiveSubscription
from ServicioFacturacion.utils import decode_user

subscriptions_bp = Blueprint('subscriptions', __name__)

@subscriptions_bp.route('/subscriptions/base', methods=['GET'])
def get_active_all_subscriptions():
    try:
        subscriptions = GetAllSubscriptions().execute()

        subscriptions_list = [
            {
                "id": subscription.id,
                "name": subscription.base_name,
                "description": subscription.description,
                "status": subscription.status,
                "price": float(subscription.price),
                "features": [
                    {
                        "id": feature.feature_id,
                        "price": float(feature.feature_price),
                        "name": feature.feature_name
                    }
                    for feature in subscription.features
                ],
                "createdAt": subscription.createdAt,
                "updatedAt": subscription.updatedAt
            }
            for subscription in subscriptions
        ]

        return jsonify(subscriptions_list), 200

    except Exception as e:
        return jsonify({'error': f'Failed to retrieve subscription plans. Details: {str(e)}'}), 500
    
@subscriptions_bp.route('/subscriptions/active', methods=['GET'])
def get_active_subscription():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)        

        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        client_id = user.get("client")
        if not client_id:
            return jsonify({"error": "Client ID not found"}), 400
        
        active_subscription = GetActiveSubscription(client_id=client_id, status="active").execute()

        if not active_subscription:
            return jsonify({'message': 'No active subscriptions found.'}), 404

        return jsonify({
            "id": str(active_subscription.id),
            "baseId": active_subscription.base_id,
            "baseName": active_subscription.base_name,
            "description": active_subscription.description,
            "status": active_subscription.status,
            "price": float(active_subscription.price),
            "notifyByEmail": active_subscription.notify_by_email,
            "features": [
                {
                    "id": feature.feature_id,
                    "name": feature.feature_name,
                    "price": float(feature.feature_price)
                } for feature in (active_subscription.features or [])
            ],
            "createdAt": active_subscription.createdAt,
            "updatedAt": active_subscription.updatedAt
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to retrieve active subscriptions. Details: {str(e)}'}), 500

    
@subscriptions_bp.route('/subscriptions/active/history', methods=['GET'])
def get_suscriptions_history():
    return jsonify([
            {
                "id": "4675d547-d115-4437-87b8-890c52b1f819",
                "baseId": "plan-premium-master",
                "baseName": "Plan Premium Master",
                "description": "Plan Premium Master",
                "notifyByEmail": True,
                "price": 10000.0,
                "features":[
                    {"id": "frt-characteristics-soporte-técnico-24/7", "price": 1.0, "name": "Soporte técnico 24/7"},
                    {"id": "frt-characteristics-acceso-a-reportes-detallados", "price": 1.0, "name": "Acceso a reportes detallados"},
                    {"id": "frt-characteristics-editar-perfiles", "price": 1.0, "name": "Editar perfiles"},
                    {"id": "frt-characteristics-integración-con-plataformas-externas", "price": 1.0, "name": "Integración con plataformas externas"},
                    {"id": "frt-characteristics-facturación-automática", "price": 1.0, "name": "Facturación automática"},
                    {"id": "frt-characteristics-usuarios-permitidos", "price": 1.0, "name": "Usuarios permitidos"},
                    {"id": "frt-characteristics-espacio-de-almacenamiento", "price": 1.0, "name": "Espacio de almacenamiento"},
                    {"id": "frt-characteristics-actualizaciones-de-software-automáticas", "price": 1.0, "name": "Actualizaciones de software automáticas"},
                    {"id": "frt-characteristics-acceso-móvil", "price": 1.0, "name": "Acceso móvil"},
                    {"id": "frt-characteristics-modificar-usuarios", "price": 1.0, "name": "Modificar usuarios"},
                    {"id": "frt-characteristics-eliminar-usuarios", "price": 1.0, "name": "Eliminar usuarios"},
                    {"id": "frt-characteristics-varios-usuarios-al-tiempo", "price": 1.0, "name": "Varios usuarios al tiempo"},
                    {"id": "frt-characteristics-con-publicidad", "price": 1.0, "name": "Con publicidad"},
                    {"id": "frt-characteristics-sin-publicidad", "price": 1.0, "name": "Sin publicidad"},
                    {"id": "frt-characteristics-facturación-periódica", "price": 1.0, "name": "Facturación periódica"}
                ],
                "createdAt": "2024-10-24 19:35:55.357",
                "updatedAt": "2024-10-24 19:35:55.357"
            }
        ]), 200

@subscriptions_bp.route('/subscriptions/active', methods=['PUT'])
def put_active_subscription():
    auth_header = request.headers.get('Authorization')
    
    try:
        user = decode_user(auth_header)
       
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        client_id = user.get("client")
        if not client_id:
            return jsonify({"error": "Client ID not found"}), 400
        
        data = request.get_json()
        base_subscription_id = data.get('subscriptionBaseId')
        active_features = data.get('features')
        notify_by_email = data.get('notifyByEmail', False)

        if not base_subscription_id or not active_features:
            return jsonify({"error": "Invalid parameters"}), 400

        active_subscription = GetActiveSubscription(client_id=client_id, status="active").execute()
        if not active_subscription:
            return jsonify({"error": "Active subscription not found"}), 404

        base_subscription = SystemService().get_subscription(base_subscription_id)
        if not base_subscription:
            return jsonify({"error": "Base subscription not found"}), 404

        features = SystemService().get_features()
        
        updated_active_features = []
        for af in active_features:
            for f in features:
                if af == f["id"]:
                    updated_active_features.append(f)
                    break

        updated_subscription = UpdateActiveSubscription(
            active_subscription=active_subscription,
            base_subscription=base_subscription,
            features=updated_active_features,
            notify_by_email=notify_by_email
        ).execute()

        return jsonify({
            "id": str(updated_subscription.id),
            "baseId": updated_subscription.base_id,
            "baseName": updated_subscription.base_name,
            "description": updated_subscription.description,
            "status": updated_subscription.status,
            "price": float(updated_subscription.price),
            "notifyByEmail": updated_subscription.notify_by_email,
            "features": [
                {
                    "id": feature.feature_id,
                    "name": feature.feature_name,
                    "price": float(feature.feature_price)
                } for feature in (updated_subscription.features or [])
            ]
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': f'Failed to update active subscription. Details: {str(e)}'}), 500
    
@subscriptions_bp.route('/subscriptions/active', methods=['POST'])
def create_active_subscription():
    auth_header = request.headers.get('Authorization')
    try:
        user = decode_user(auth_header)

        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        client_id = user.get("client")
        if not client_id:
            return jsonify({"error": "Client ID not found"}), 400
        
        data = request.get_json()        
        base_subscription_id = data.get('subscriptionBaseId')
        active_features = data.get('features')
        notify_by_email = data.get('notifyByEmail', False)
        
        if not base_subscription_id or not active_features:
            return jsonify({"error": "Invalid parameters"}), 400
        
        base_subscription = SystemService().get_subscription(base_subscription_id)
        if not base_subscription:
            return jsonify({"error": "Base subscription not found"}), 404
        
        features = SystemService().get_features()

        new_active_features = []
        for af in active_features:
            for f in features:
                if af == f["id"]:
                    new_active_features.append(f)
                    break

        active_subscription = GetActiveSubscription(client_id=client_id, status="request_open").execute()

        if active_subscription:            
            active_subscription = UpdateActiveSubscription(active_subscription, base_subscription, new_active_features, notify_by_email).execute()
        else:
            active_subscription = CreateActiveSubscription(client_id, base_subscription, new_active_features, notify_by_email).execute()

        return jsonify({
            "id": active_subscription.id,
            "baseId": active_subscription.base_id,
            "baseName": active_subscription.base_name,
            "description": active_subscription.description,
            "notifyByEmail": active_subscription.notify_by_email,
            "price": active_subscription.price,
            "features": [
                    {
                        "id": feature.feature_id,
                        "name": feature.feature_name,
                        "price": feature.feature_price
                    } for feature in (active_subscription.features or [])
                ]
        }), 200
    except Exception as e:
        traceback.print_exc() 
        return jsonify({'error': f'"Create active subscription failed. Details: {str(e)}'}), 500