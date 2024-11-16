from flask import Blueprint, request, jsonify
from ServicioCanal.utils import decode_user
import uuid

from ServicioCanal.commands.channel_create import CreateChannel
from ServicioCanal.commands.channel_exists import ExistsChannel
from ServicioCanal.commands.channel_get_all import GetAllChannels
from ServicioCanal.commands.channel_get import GetChannel
from ServicioCanal.commands.session_get_all import GetAllSessions
from ServicioCanal.commands.session_create import CreateSession
from ServicioCanal.services.notification_service import NotificationService
from ServicioCanal.services.monitor_service import MonitorService

channels_bp = Blueprint('channels_bp', __name__)

@channels_bp.route('/channels', methods=['GET'])
def get_all_channels():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        channels = GetAllChannels().execute()

        channels_list = [
            {
                "id": channel.id,
                "name": channel.name,
                "description": channel.description,
                "type": channel.type,
                "platforms": channel.platforms.split(";")
            }
            for channel in channels
        ]

        return jsonify(channels_list), 200

    except Exception as e:
        return jsonify({'error': f'Error retrieving channels. Details: {str(e)}'}), 500

@channels_bp.route('/channels/<channel_id>', methods=['GET'])
def get_channel(channel_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        channel = GetChannel(channel_id).execute()

        if not channel:
            return jsonify({'error': 'Channel not found'}), 404

        channel_data = {
            "id": channel.id,
            "name": channel.name,
            "description": channel.description,
            "type": channel.type,
            "platforms": channel.platforms.split(";")
        }

        return jsonify(channel_data), 200

    except Exception as e:
        return jsonify({'error': f'Error retrieving channel. Details: {str(e)}'}), 500

@channels_bp.route('/channels', methods=['POST'])
def create_channel():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        
        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        type = data.get('type')
        platforms = data.get('platforms')

        if not name or not description or not type or\
           not platforms:
            return "Invalid parameters", 400
        
        data = CreateChannel(name, description, type, platforms).execute()

        return jsonify({
            "id": data.id,
            "name": data.name,
            "description": data.description,
            "type": data.type,
            "platforms": data.platforms.split(";"),
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Error creating channel. Details: {str(e)}'}), 500

@channels_bp.route('/channels/<channel_id>/sessions', methods=['GET'])
def get_sessions_by_channel(channel_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        if not ExistsChannel(channel_id).execute():
            return jsonify({'error': 'Channel not found'}), 404

        sessions = GetAllSessions(channel_id).execute()

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
                "assigned_to_name": session.assigned_to_name
            }
            for session in sessions
        ]

        return jsonify(sessions_list), 200

    except Exception as e:
        return jsonify({'error': f'Error retrieving sessions. Details: {str(e)}'}), 500

@channels_bp.route('/channels/<channel_id>/sessions', methods=['POST'])
def create_session(channel_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        
        data = request.get_json()
        topic = data.get('topic')
        topic_refid = data.get('topic_refid')
        opened_by_id = user["id"]
        opened_by_name = user["name"]
        opened_by_type = user["role_type"]

        if not topic:
            return "Invalid parameters", 400

        if not ExistsChannel(channel_id).execute():
            return "Channel not found", 404
        
        data = CreateSession(channel_id,  topic, topic_refid, opened_by_id, \
                             opened_by_name, opened_by_type).execute()
        
        NotificationService().publish_new_session(data)
        MonitorService().enqueue_event(user, "CREATE-SESSION", f"SESSION_ID={str(data.id)}")

        return jsonify({
            "id": str(data.id),
            "status": str(data.status),
            "channel_id": data.channel_id,
            "topic": data.topic,
            "topic_refid": data.topic_refid,
            "opened_by_id": data.opened_by_id,
            "opened_by_name": data.opened_by_name,
            "opened_by_type": data.opened_by_type,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Error creating session. Details: {str(e)}'}), 500