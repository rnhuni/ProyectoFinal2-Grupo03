from flask import Blueprint, request, jsonify
from ServicioSistema.commands.notification_create import CreateNotification
from ServicioSistema.commands.notification_get_all import GetAllNotifications
from ServicioSistema.commands.notification_get import GetNotification
from ServicioSistema.commands.notification_update import UpdateNotification

notifications_bp = Blueprint('notifications_bp', __name__)

@notifications_bp.route('/notifications', methods=['POST'])
def create_notification():
    try:
        data = request.get_json()
        name = data.get('name')
        service = data.get('service')
        show_by_default = data.get('show_by_default', True)

        if not name or not service or len(name) < 1 or show_by_default is None:
            return "Invalid parameters", 400
        
        data = CreateNotification(name, service, show_by_default).execute()

        return jsonify({
            "id": data.id,
            "name": data.name,
            "service": data.service,
            "show_by_default": bool(data.show_by_default),
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Error creating notification. Details: {str(e)}'}), 500

@notifications_bp.route('/notifications', methods=['GET'])
def get_all_notifications():
    try:
        notifications = GetAllNotifications().execute()

        notifications_data = []
        for notification in notifications:
            notifications_data.append({
                "id": str(notification.id),
                "name": notification.name,
                "service": notification.service,
                "show_by_default": bool(notification.show_by_default),
                "created_at": notification.createdAt.isoformat(),
                "updated_at": notification.updatedAt.isoformat()
            })

        return jsonify(notifications_data), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve notifications. Details: {str(e)}'}), 500

@notifications_bp.route('/notifications/<notification_id>', methods=['GET'])
def get_notification(notification_id):
    try:
        notification = GetNotification(notification_id).execute()

        if not notification:
            return "Notification not found", 404

        return jsonify({
            "id": str(notification.id),
            "name": notification.name,
            "service": notification.service,
            "show_by_default": bool(notification.show_by_default),
            "created_at": notification.createdAt.isoformat(),
            "updated_at": notification.updatedAt.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve notification. Details: {str(e)}'}), 500

@notifications_bp.route('/notifications/<notification_id>', methods=['PUT'])
def put_notification(notification_id):
    try:
        data = request.get_json()
        name = data.get('name')
        service = data.get('service')
        show_by_default = data.get('show_by_default')

        if not name or not service or show_by_default is None:
            return "Invalid parameters", 400

        notification = GetNotification(notification_id).execute()
        if not notification:
            return "Notification not found", 404

        updated_notification = UpdateNotification(
            notification_id, name, service, show_by_default
        ).execute()

        return jsonify({
            "id": str(updated_notification.id),
            "name": updated_notification.name,
            "service": updated_notification.service,
            "show_by_default": bool(updated_notification.show_by_default),
            "created_at": updated_notification.createdAt.isoformat(),
            "updated_at": updated_notification.updatedAt.isoformat()
        }), 200
    except ValueError as e:
        return str(e), 400
    except Exception as e:
        return jsonify({'error': f'Failed to update notification. Details: {str(e)}'}), 500