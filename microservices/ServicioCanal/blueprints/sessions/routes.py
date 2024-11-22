from flask import Blueprint, request, jsonify
from ServicioCanal.utils import decode_user
from datetime import datetime
from ServicioCanal.commands.message_create import CreateMessage
from ServicioCanal.commands.message_get_all import GetAllMessages
from ServicioCanal.commands.session_get import GetSession
from ServicioCanal.commands.session_exists import ExistsSession
from ServicioCanal.commands.session_update import UpdateSession
from ServicioCanal.services.notification_service import NotificationService
from ServicioCanal.services.monitor_service import MonitorService
from ServicioCanal.commands.session_get_all_with_filters import GetAllSessionsByFilters

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
    
@sessions_bp.route('/sessions', methods=['GET'])
def get_all_sessions():
    auth_header = request.headers.get('Authorization')

    try:
        status = request.args.get('status')
        assigned_to = request.args.get('assigned_to')
        channel = request.args.get('channel')
        opened_by = request.args.get('opened_by')
        topic = request.args.get('topic')
        topic_refid = request.args.get('topic_refid')
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        order = request.args.get('order', 'desc')

        start_date = None
        end_date = None
        if start_date_str:
            start_date = datetime.fromisoformat(start_date_str)
        if end_date_str:
            end_date = datetime.fromisoformat(end_date_str)

        sessions = GetAllSessionsByFilters(channel, assigned_to, opened_by, status, topic, \
                                           topic_refid, order, start_date, end_date).execute()

        if not sessions:
            return jsonify([]), 200

        sessions_list = [
            {
                "id": session.id,
                "channel_id": session.channel_id,
                "status": session.status,
                "topic": session.topic,
                "topic_refid": session.topic_refid,
                "opened_by_id": session.opened_by_id,
                "opened_by_name": session.opened_by_name,
                "assigned_to_type": session.assigned_to_type,
                "assigned_to_id": session.assigned_to_id,
                "assigned_to_name": session.assigned_to_name,
                "created_at": session.createdAt.isoformat(),
                "updated_at": session.updatedAt.isoformat(),
            }
            for session in sessions
        ]

        return jsonify(sessions_list), 200

    except Exception as e:
        return jsonify({'error': f'Error retrieving sessions. Details: {str(e)}'}), 500