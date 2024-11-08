from flask import Blueprint, request, jsonify

notifications_bp = Blueprint('notifications_bp', __name__)

@notifications_bp.route('/notifications', methods=['GET'])
def get_all_notifications():
    try:
        return jsonify([
            {
                "id": "a4b2c1d4-5f6e-4d7f-8e9f-0123456789ab",
                "name": "notificacion 1",
                "service": "servicio 1",
                "show_by_default": False,
                "created_at": "2024-11-07 15:34:000",
                "updated_at": "2024-11-07 15:34:000"
            },
            {
                "id": "b4b2c1d4-5f6e-4d7f-8e9f-0123456789ab",
                "name": "notificacion 2",
                "service": "servicio 2",
                "show_by_default": False,
                "created_at": "2024-11-07 15:34:000",
                "updated_at": "2024-11-07 15:34:000"
            },
            {
                "id": "c4b2c1d4-5f6e-4d7f-8e9f-0123456789ab",
                "name": "notificacion 3",
                "service": "servicio 3",
                "show_by_default": False,
                "created_at": "2024-11-07 15:34:000",
                "updated_at": "2024-11-07 15:34:000"
            },
        ]), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving notifications. Details: {str(e)}'}), 500
    
@notifications_bp.route('/notifications', methods=['POST'])
def create_notification():
    try:
        return "", 201
    except Exception as e:
        return jsonify({'error': f'Error creating notification. Details: {str(e)}'}), 500
    
@notifications_bp.route('/notifications/<notification_id>', methods=['PUT'])
def put_notification(notification_id):
    try:
        return notification_id, 200
    except Exception as e:
        return jsonify({'error': f'Error editting notification. Details: {str(e)}'}), 500