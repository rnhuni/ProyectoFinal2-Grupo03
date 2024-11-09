from flask import Blueprint, request, jsonify
from ServicioUsuario.services.system_service import SystemService
from ServicioUsuario.commands.notification_get_all import GetAllNotifications
from ServicioUsuario.commands.notification_create import CreateNotification
from ServicioUsuario.commands.notification_update import UpdateNotification
from ServicioUsuario.commands.notification_exists import ExistsNotification
from ServicioUsuario.utils import decode_user

notifications_bp = Blueprint('notifications_bp', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
def get_all_notifications():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        base_notifications = SystemService().get_notifications()
        user_notifications = GetAllNotifications(user["id"]).execute()

        

        notifications = []
        for bn in base_notifications:
            notify = {
                "id": bn["id"],
                "name": bn["name"],
                "show": bn["show_by_default"],
                "updated_at": bn["updated_at"],
                "created_at": bn["created_at"]
            }
            for un in user_notifications:
                if str(un.base_id) == bn["id"]:
                    notify["show"] = un.show
                    notify["updated_at"] = un.updatedAt.isoformat()
                    notify["created_at"] = un.createdAt.isoformat()
                    break
            notifications.append(notify)


        return jsonify(notifications), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving notifications. Details: {str(e)}'}), 500
    
@notifications_bp.route('/notifications/<notification_id>/show/<show>', methods=['PUT'])
def put_notification(notification_id, show):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        data = None
        show = show.lower() == "true"
        if ExistsNotification(user["id"], notification_id).execute():
            data = UpdateNotification(user["id"], notification_id, show).execute()
        else:
            bn = SystemService().get_notification(notification_id)
            if not bn:
                return "Notification not found", 404

            data = CreateNotification(user["id"], bn["id"], bn["name"], show).execute()

        return jsonify({
                "id": data.base_id,
                "name": data.name,
                "show": data.show,
                "updated_at": data.updatedAt.isoformat(),
                "created_at": data.createdAt.isoformat()
            }), 200
    except Exception as e:
        return jsonify({'error': f'Error editting notification. Details: {str(e)}'}), 500