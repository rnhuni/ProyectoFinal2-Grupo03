from flask import Blueprint, request, jsonify
from ServicioCanal.utils import decode_user
import uuid

from ServicioCanal.commands.channel_create import CreateChannel
from ServicioCanal.commands.channel_exists import ExistsChannel
from ServicioCanal.commands.session_create import CreateSession
from ServicioCanal.services.notification_service import NotificationService

channels_bp = Blueprint('channels_bp', __name__)

@channels_bp.route('/channels', methods=['GET'])
def get_all_channels():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        #TODO: check agent

        return jsonify([{
            "id":"support-chat",
            "name": "Canal de soporte",
            "description": "Canal de soporte para gestionar los problemas en incidencias",
            "type": "chat",
            "platforms":"mobile;webapp",
            "created_at":"2024-01-01T00:00:00",
            "updated_at":"2024-01-01T00:00:00"
        }]), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving channels. Details: {str(e)}'}), 500
    
@channels_bp.route('/channels/<channel_id>', methods=['GET'])
def get_channel(channel_id):
    #TODO: check agent
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        return jsonify({
            "id":"support-chat",
            "name": "Canal de soporte",
            "description": "Canal de soporte para gestionar los problemas en incidencias",
            "type": "chat",
            "platforms":"mobile;webapp",
            "created_at":"2024-01-01T00:00:00",
            "updated_at":"2024-01-01T00:00:00"
        }), 200
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
def get_all_sessions(channel_id):
    auth_header = request.headers.get('Authorization')
    #TODO: check agent

    try:
        user = decode_user(auth_header)

        return jsonify([{
            "id":str(uuid.uuid4()),
            "channel_id": channel_id,
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
        }]), 200
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