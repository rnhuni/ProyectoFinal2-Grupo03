from flask import Blueprint, request, jsonify
import json
from ServicioIncidente.commands.incident_create import CreateIncident
from ServicioIncidente.commands.incident_exists import ExistsIncident
from ServicioIncidente.commands.attachment_exists import ExistsAttachment
from ServicioIncidente.commands.attachment_create import CreateAttachment
from ServicioIncidente.utils import decode_user, build_incident_id

incidents_bp = Blueprint('incident_bp', __name__)

@incidents_bp.route('/incidents', methods=['POST'])
def create_incident():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        data = request.get_json()
        type = data.get('type')
        description = data.get('description')
        contact = data.get('contact', "")
        
        if not type or not description or len(description) < 1:
            return "Invalid parameters", 400
        
        if contact and len(contact) > 0:
            contact = json.dumps(contact)

        id = build_incident_id()
        
        data = CreateIncident(id, type, description, contact, user["id"], user["name"]).execute()

        return jsonify({
            "id": data.id,
            "type": data.type,
            "description": data.description,
            "contact": json.loads(data.contact),
            "user_issuer_id": data.user_issuer_id,
            "user_issuer_name": data.user_issuer_name,
            "createdAt": data.createdAt,
            "updatedAt": data.updatedAt
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create incident failed. Details: {str(e)}'}), 500
    
@incidents_bp.route('/incidents/<incident_id>/attachments', methods=['PUT'])
def create_attachment(incident_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        data = request.get_json()
        id = data.get('media_id')
        file_name = data.get('media_name')
        file_uri = data.get('media_uri')
        content_type = data.get('content_type')
        
        if not id or not incident_id or not file_name or not content_type or not file_uri:
            return "Invalid parameters", 400
        
        if not ExistsIncident(incident_id).execute():
            return "Incident not found", 404
        
        if ExistsAttachment(id).execute():
            return "Media id already exists", 400
        
        data = CreateAttachment(id, incident_id, file_name, file_uri, content_type,\
                                user["id"], user["name"]).execute()

        return jsonify({
            "id": data.id,
            "name": data.file_name,
            "uri": data.file_uri,
            "content_type": data.content_type,
            "user_attacher_id": data.user_attacher_id,
            "user_attacher_name": data.user_attacher_name,
            "createdAt": data.createdAt,
            "updatedAt": data.updatedAt
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create attachment failed. Details: {str(e)}'}), 500