from flask import Blueprint, request, jsonify
from ServicioCanal.utils import decode_user
from ServicioCanal.utils.utils import build_channel_id
import uuid

from ServicioCanal.commands.message_create import CreateMessage
from ServicioCanal.commands.session_exists import ExistsSession
from ServicioCanal.services.notification_service import NotificationService

sessions_bp = Blueprint('sessions_bp', __name__)

@sessions_bp.route('/sessions/<session_id>', methods=['GET'])
def get_session(session_id):
    auth_header = request.headers.get('Authorization')
    #TODO: check agent

    try:
        user = decode_user(auth_header)

        return jsonify({
            "id":session_id,
            "channel_id": "channel_id",
            "status": "OPEN",
            "topic":"incident",
            "topic_refid":"TXT-asasasas",
            "opened_by_id": "user_id",
            "opened_by_name": "user_name",
            "assigned_to_type": "agent|system",
            "assigned_to_id": "agent_id",
            "assigned_to_name": "agent_name",
            "created_at":"2024-01-01T00:00:00",
            "updated_at":"2024-01-01T00:00:00"
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving session. Details: {str(e)}'}), 500

@sessions_bp.route('/sessions/<session_id>/messages', methods=['GET'])
def get_messages(session_id):
    auth_header = request.headers.get('Authorization')
    #TODO: check agent

    try:
        user = decode_user(auth_header)

        return jsonify([{
            "id": str(uuid.uuid4()),
            "session_id":session_id,
            "source_id": user["id"],
            "source_name":user["name"],
            "source_role":"",
            "content_type": "plain/text",
            "body": "",
            "created_at":"2024-01-01T00:00:00",
            "updated_at":"2024-01-01T00:00:00"
        }]), 200
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

        return jsonify([{
            "id": str(data.id),
            "session_id": data.session_id,
            "content_type": data.content_type,
            "body": data.body,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }]), 201
    except Exception as e:
        return jsonify({'error': f'Error creating sessmessageion. Details: {str(e)}'}), 500