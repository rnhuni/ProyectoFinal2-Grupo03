from flask import Blueprint, request, jsonify
from ServicioCanal.utils import decode_user
from ServicioCanal.utils.utils import build_channel_id
import uuid

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
        name = data.get('name', 'empty')
        
        data["created_at"]="2024-01-01T00:00:00"
        data["updated_at"]="2024-01-01T00:00:00"
        data["id"] = build_channel_id(name)

        return jsonify(data), 201
    except Exception as e:
        return jsonify({'error': f'Error creating channels. Details: {str(e)}'}), 500

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

@channels_bp.route('/channels/<channel_id>/sessions/<session_id>', methods=['GET'])
def get_session(channel_id, session_id):
    auth_header = request.headers.get('Authorization')
    #TODO: check agent

    try:
        user = decode_user(auth_header)

        return jsonify({
            "id":session_id,
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
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving session. Details: {str(e)}'}), 500

@channels_bp.route('/channels/<channel_id>/sessions', methods=['POST'])
def create_session(channel_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        
        data = request.get_json()
        data["opened_by_id"] = user["id"],
        data["opened_by_name"] = user["name"],
        data["created_at"]="2024-01-01T00:00:00"
        data["updated_at"]="2024-01-01T00:00:00"
        data["id"] = str(uuid.uuid4())
        data["channel_id"] = channel_id

        return jsonify(data), 201
    except Exception as e:
        return jsonify({'error': f'Error creating session. Details: {str(e)}'}), 500
    
@channels_bp.route('/channels/<channel_id>/sessions/<session_id>/messages', methods=['GET'])
def get_messages(channel_id, session_id):
    auth_header = request.headers.get('Authorization')
    #TODO: check agent

    try:
        user = decode_user(auth_header)

        return jsonify([{
            "id": str(uuid.uuid4()),
            "session_id":session_id,
            "channel_id": channel_id,
            "source_id": user["id"],
            "source_name":user["name"],
            "source_role":"",
            "content-type": "plain/text",
            "body": "",
            "created_at":"2024-01-01T00:00:00",
            "updated_at":"2024-01-01T00:00:00"
        }]), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving messages. Details: {str(e)}'}), 500
    
@channels_bp.route('/channels/<channel_id>/sessions/<session_id>/messages', methods=['POST'])
def create_message(channel_id, session_id):
    auth_header = request.headers.get('Authorization')
    #TODO: check agent

    try:
        user = decode_user(auth_header)

        return jsonify([{
            "id": str(uuid.uuid4()),
            "session_id":session_id,
            "channel_id": channel_id,
            "source_id": user["id"],
            "source_name":user["name"],
            "source_role":"",
            "content-type": "plain/text",
            "body": "",
            "created_at":"2024-01-01T00:00:00",
            "updated_at":"2024-01-01T00:00:00"
        }]), 201
    except Exception as e:
        return jsonify({'error': f'Error creating sessmessageion. Details: {str(e)}'}), 500