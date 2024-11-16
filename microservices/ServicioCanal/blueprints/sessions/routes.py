from flask import Blueprint, request, jsonify
from ServicioCanal.utils import decode_user
from ServicioCanal.utils.utils import build_channel_id
import uuid

from ServicioCanal.commands.message_create import CreateMessage
from ServicioCanal.commands.message_get_all import GetAllMessages
from ServicioCanal.commands.session_get import GetSession
from ServicioCanal.commands.session_exists import ExistsSession
from ServicioCanal.commands.session_update import UpdateSession
from ServicioCanal.services.notification_service import NotificationService
from ServicioCanal.services.monitor_service import MonitorService

sessions_bp = Blueprint('sessions_bp', __name__)

@sessions_bp.route('/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        if not ExistsSession(session_id).execute():
            return jsonify({'error': 'Session not found'}), 404

        session_data = GetSession(session_id).execute()

        if not session_data:
            return jsonify({'error': 'Session not found'}), 404

        
        session_info = {
            "id": str(session_data.id),
            "channel_id": session_data.channel_id,
            "status": session_data.status,
            "topic": session_data.topic,
            "topic_refid": session_data.topic_refid,
            "opened_by_id": session_data.opened_by_id,
            "opened_by_name": session_data.opened_by_name,
            "assigned_to_type": session_data.assigned_to_type,
            "assigned_to_id": session_data.assigned_to_id,
            "assigned_to_name": session_data.assigned_to_name
        }

        return jsonify(session_info), 200

    except Exception as e:
        return jsonify({'error': f'Error retrieving session. Details: {str(e)}'}), 500

@sessions_bp.route('/sessions/<session_id>/messages', methods=['GET'])
def get_messages(session_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        if not ExistsSession(session_id).execute():
            return jsonify({'error': 'Session not found'}), 404

        messages = GetAllMessages(session_id).execute()

        messages_list = [
            {
                "id": str(message.id),
                "session_id": message.session_id,
                "content_type": message.content_type,
                "body": message.body,
                "source_id": message.source_id,
                "source_name": message.source_name,
                "source_type": message.source_type,
                "created_at": message.createdAt.isoformat(),
                "updated_at": message.updatedAt.isoformat()
            }
            for message in messages
        ]

        return jsonify(messages_list), 200

    except Exception as e:
        return jsonify({'error': f'Error retrieving messages. Details: {str(e)}'}), 500

@sessions_bp.route('/sessions/<session_id>/messages', methods=['POST'])
def create_message(session_id):
    auth_header = request.headers.get('Authorization')
    
    try:
        user = decode_user(auth_header)
        
        data = request.get_json()
        content_type = data.get('content_type')
        body = data.get('body')
        source_id = user["id"]
        source_name = user["name"]
        source_type = user["role_type"]

        if not body or not content_type:
            return "Invalid parameters", 400

        if not ExistsSession(session_id).execute():
            return "Session not found", 404

        data = CreateMessage(session_id, source_id, source_name, source_type, content_type, body).execute()
        NotificationService().publish_new_message(data)
        MonitorService().enqueue_event(user, "CREATE-MESSAGE", f"MESSAGE_ID={str(data.id)}")

        return jsonify({
            "id": str(data.id),
            "session_id": data.session_id,
            "content_type": data.content_type,
            "body": data.body,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Error creating message. Details: {str(e)}'}), 500

@sessions_bp.route('/sessions/<session_id>', methods=['DELETE'])
def close_session(session_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        if not ExistsSession(session_id).execute():
            return jsonify({'error': 'Session not found'}), 404

        update_result = UpdateSession(session_id, "CLOSED").execute()

        if not update_result:
            return jsonify({'error': 'Failed to close session'}), 500

        MonitorService().enqueue_event(user, "CLOSE-SESSION", f"SESSION_ID={session_id}")

        return jsonify({'message': f'Session {session_id} has been closed'}), 200

    except Exception as e:
        return jsonify({'error': f'Error closing session. Details: {str(e)}'}), 500