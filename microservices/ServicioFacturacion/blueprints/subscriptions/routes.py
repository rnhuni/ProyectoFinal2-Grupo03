import json
import uuid
from flask import Blueprint, request, jsonify
from ServicioFacturacion.utils import decode_user

subscriptions_bp = Blueprint('subscriptions', __name__)

@subscriptions_bp.route('/subscriptions/base', methods=['GET'])
def get_all_subscriptions():
    try:
       return jsonify([
            {
                "id": "plan-premium-master",
                "name": "Plan Premium Master",
                "description": "TODO Plan Premium Master",
                "status": "ACTIVE",
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
                ]
            },
            {
                "id": "plan-pro-engage",
                "name": "Plan Pro Engage",
                "description": "TODO Plan Pro Engage",
                "status": "ACTIVE",
                "price": 1000.0,
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
                    {"id": "frt-characteristics-eliminar-usuarios", "price": 1.0, "name": "Eliminar usuarios"}                    
                ]
            },
            {
                "id": "plan-basico-connect",
                "name": "Plan Básico Connect",
                "description": "TODO Plan Básico Connect",
                "status": "ACTIVE",
                "price": 100.0,
                "features":[
                    {"id": "frt-characteristics-soporte-técnico-24/7", "price": 1.0, "name": "Soporte técnico 24/7"},
                    {"id": "frt-characteristics-acceso-a-reportes-detallados", "price": 1.0, "name": "Acceso a reportes detallados"},
                    {"id": "frt-characteristics-editar-perfiles", "price": 1.0, "name": "Editar perfiles"},
                    {"id": "frt-characteristics-integración-con-plataformas-externas", "price": 1.0, "name": "Integración con plataformas externas"}
                ]
            }
        ]), 200

    except Exception as e:
        return jsonify({'error': f'Failed to retrieve subscription plans. Details: {str(e)}'}), 500
    
@subscriptions_bp.route('/subscriptions/active', methods=['GET'])
def get_active_subscription():
    #auth_header = request.headers.get('Authorization')
    
    try:
        #user = decode_user(auth_header)

        return jsonify({
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
            }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve active subscription. Details: {str(e)}"}), 500

@subscriptions_bp.route('/subscriptions/active', methods=['PUT'])
def put_active_subscription():
    #auth_header = request.headers.get('Authorization')
    
    try:
        #user = decode_user(auth_header)

        data = request.get_json()
        notifyByEmail = data.get('notifyByEmail', None)
        subscriptionId = data.get('subscriptionBaseId', None)
        features = data.get('features', None)

        if notifyByEmail is None:
            return "notifyByEmail is required", 400
        
        if subscriptionId is None:
            return "subscriptionId is required", 400
        
        if features is None:
            return "features is required", 400        

        return "OK", 200
    except Exception as e:
        return jsonify({"error": f"Failed to update active subscription. Details: {str(e)}"}), 500
    
@subscriptions_bp.route('/subscriptions/active/history', methods=['GET'])
def get_suscriptions_history():
    #auth_header = request.headers.get('Authorization')
    
    try:
        #user = decode_user(auth_header)

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
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve subscription active history. Details: {str(e)}'}), 500