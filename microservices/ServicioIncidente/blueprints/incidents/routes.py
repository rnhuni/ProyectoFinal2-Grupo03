from flask import Blueprint, request, jsonify
import json
from datetime import datetime
from ServicioIncidente.commands.incident_create import CreateIncident
from ServicioIncidente.commands.incident_exists import ExistsIncident
from ServicioIncidente.commands.incident_get_all import GetAllIncidents
from ServicioIncidente.commands.incident_get import GetIncident
from ServicioIncidente.commands.incident_close import CloseIncident
from ServicioIncidente.commands.incident_claim import ClaimIncident
from ServicioIncidente.commands.incident_update import UpdateIncident
from ServicioIncidente.commands.attachment_exists import ExistsAttachment
from ServicioIncidente.commands.attachment_create import CreateAttachment
from ServicioIncidente.commands.attachment_get_all import GetAllAttachments
from ServicioIncidente.commands.attachment_get import GetAttachment
from ServicioIncidente.commands.feedback_exists import ExistsFeedback
from ServicioIncidente.commands.feedback_create import CreateFeedback
from ServicioIncidente.utils import decode_user, build_incident_id
from ServicioIncidente.services.monitor_service import MonitorService

incidents_bp = Blueprint('incident_bp', __name__)

@incidents_bp.route('/incidents', methods=['POST'])
def create_incident():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        data = request.get_json()
        incident_type = data.get('type')
        description = data.get('description')
        contact = data.get('contact', "")
        attachments =  data.get('attachments', [])
        channel_id = data.get('publication_channel_id', "chan-support-channel")
        sla = data.get('sla', 1440)

        if not incident_type or not description or len(description) < 1 or \
           not channel_id or not sla :
            return "Invalid parameters", 400
        
        sla = int(sla)
        
        if contact and len(contact) > 0:
            contact = json.dumps(contact)

        incident_id = build_incident_id()
        
        data = CreateIncident(incident_id, incident_type, description, contact, user["id"], user["name"], \
                              channel_id, sla).execute()
        MonitorService().enqueue_event(user, "CREATE-INCIDENT", f"INCIDENT_ID={str(data.id)}")

        for attachment in attachments:
            aid = attachment["id"]
            content_type = attachment["content_type"]
            file_uri = attachment["file_uri"]
            file_name = attachment["file_name"]
            if not ExistsAttachment(aid).execute():
                CreateAttachment(aid, data.id, file_name, file_uri, content_type,\
                                user["id"], user["name"]).execute()

        return jsonify({
            "id": data.id,
            "type": data.type,
            "description": data.description,
            "contact": json.loads(data.contact),
            "user_issuer_id": data.user_issuer_id,
            "user_issuer_name": data.user_issuer_name,
            "publication_channel_id": data.publication_channel_id,
            "sla": data.sla,
            "status": data.status,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
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
        
        MonitorService().enqueue_event(user, "CREATE-ATTACHMENT", f"ATTACHMENT_ID={str(data.id)}")

        return jsonify({
            "id": data.id,
            "name": data.file_name,
            "uri": data.file_uri,
            "content_type": data.content_type,
            "user_attacher_id": data.user_attacher_id,
            "user_attacher_name": data.user_attacher_name,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 201
    except Exception as e:
        return jsonify({'error': f'Create attachment failed. Details: {str(e)}'}), 500

@incidents_bp.route('/incidents', methods=['GET'])
def get_all_incidents():
    try:
        status = request.args.get('status')
        assigned_to = request.args.get('assigned_to')
        user_issuer = request.args.get('user_issuer')
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        order = request.args.get('order', 'desc')

        start_date = None
        end_date = None
        if start_date_str:
            start_date = datetime.fromisoformat(start_date_str)
        if end_date_str:
            end_date = datetime.fromisoformat(end_date_str)

        incidents = GetAllIncidents(status, assigned_to, user_issuer, order, start_date, end_date).execute()       

        result = []
        for incident in incidents:
            resolution = ""
            if incident.date_resolution:
                incident.date_resolution.isoformat()

            incident_data = {
                "id": incident.id,
                "type": incident.type,
                "description": incident.description,
                "contact": json.loads(incident.contact) if incident.contact else None,
                "user_issuer_id": incident.user_issuer_id,
                "user_issuer_name": incident.user_issuer_name,
                "status": incident.status,
                "date_resolution": resolution,
                "resolution_time": incident.resolution_time,
                "closed_by_id": incident.closed_by_id,
                "closed_by_type": incident.closed_by_type,
                "closed_by_name": incident.closed_by_name,
                "assigned_to_id": incident.assigned_to_id,
                "assigned_to_type": incident.assigned_to_type,
                "assigned_to_name": incident.assigned_to_name,
                "publication_channel_id": incident.publication_channel_id,
                "sla": incident.sla,
                "created_at": incident.createdAt.isoformat(),
                "updated_at": incident.updatedAt.isoformat(),
                "attachments": [
                    {
                        "id": attachment.id,
                        "file_name": attachment.file_name,
                        "file_uri": attachment.file_uri,
                        "content_type": attachment.content_type,
                    } for attachment in (incident.attachments or [])
                ]
            }
            result.append(incident_data)

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': f'Get all incidents failed. Details: {str(e)}'}), 500

@incidents_bp.route('/incidents/<incident_id>', methods=['GET'])
def get_incident(incident_id):
    try:
        incident = GetIncident(incident_id).execute()
        
        if not incident:
            return "Incident not found", 404
        
        resolution = ""
        if incident.date_resolution:
            incident.date_resolution.isoformat()

        return jsonify({
            "id": incident.id,
            "type": incident.type,
            "description": incident.description,
            "contact": json.loads(incident.contact) if incident.contact else None,
            "user_issuer_id": incident.user_issuer_id,
            "user_issuer_name": incident.user_issuer_name,
            "date_resolution": resolution,
            "resolution_time": incident.resolution_time,
            "closed_by_id": incident.closed_by_id,
            "closed_by_type": incident.closed_by_type,
            "closed_by_name": incident.closed_by_name,
            "assigned_to_id": incident.assigned_to_id,
            "assigned_to_type": incident.assigned_to_type,
            "assigned_to_name": incident.assigned_to_name,
            "publication_channel_id": incident.publication_channel_id,
            "sla": incident.sla,
            "created_at": incident.createdAt.isoformat(),
            "updated_at": incident.updatedAt.isoformat(),
            "attachments": [
                {
                    "id": attachment.id,
                    "file_name": attachment.file_name,
                    "file_uri": attachment.file_uri,
                    "content_type": attachment.content_type,
                } for attachment in incident.attachments
            ]
        }), 200
    except Exception as e:
        return jsonify({'error': f'Get incident failed. Details: {str(e)}'}), 500

@incidents_bp.route('/incidents/<incident_id>', methods=['PUT'])
def update_incident(incident_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        data = request.get_json()
        type = data.get('type')
        description = data.get('description')
        contact = data.get('contact')

        if type is not None and (not type or len(type) < 1):
            return jsonify({"error": "Invalid type parameter"}), 400
        if description is not None and (not description or len(description) < 1):
            return jsonify({"error": "Invalid description parameter"}), 400
        if contact is not None and contact != "" and not isinstance(contact, dict):
            return jsonify({"error": "Invalid contact format, must be a dictionary"}), 400

        if contact is not None:
            contact = json.dumps(contact)

        updated_incident = UpdateIncident(incident_id, type=type, description=description, contact=contact).execute()
        MonitorService().enqueue_event(user, "UPDATE-INCIDENT", f"INCIDENT_ID={str(updated_incident.id)};USER-ID={user['id']}")

        return jsonify({
            "id": updated_incident.id,
            "type": updated_incident.type,
            "description": updated_incident.description,
            "contact": json.loads(updated_incident.contact) if updated_incident.contact else None,
            "user_issuer_id": updated_incident.user_issuer_id,
            "user_issuer_name": updated_incident.user_issuer_name,
            "created_at": updated_incident.createdAt.isoformat(),
            "updated_at": updated_incident.updatedAt.isoformat()
        }), 200

    except ValueError as e:
        if str(e) == "Incident not found":
            return jsonify({"error": "Incident not found"}), 404
        return jsonify({"error": f"Update incident failed. Details: {str(e)}"}), 400
        
    except Exception as e:
        return jsonify({'error': f'Update incident failed. Details: {str(e)}'}), 500
    
@incidents_bp.route('/incidents/<incident_id>/close', methods=['PUT'])
def close_incident(incident_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        
        data = CloseIncident(incident_id, user["id"], user["name"], user["role_type"]).execute()
        MonitorService().enqueue_event(user, "CLOSE-INCIDENT", f"INCIDENT_ID={str(data.id)}")

        return jsonify({
            "id": data.id,
            "type": data.type,
            "description": data.description,
            "contact": json.loads(data.contact) if data.contact else None,
            "user_issuer_id": data.user_issuer_id,
            "user_issuer_name": data.user_issuer_name,
            "status": data.status,
            "closed_by_id": data.closed_by_id,
            "closed_by_type": data.closed_by_type,
            "closed_by_name": data.closed_by_name,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 200

    except ValueError as e:
        if str(e) == "Incident not found":
            return jsonify({"error": "Incident not found"}), 404
        return jsonify({"error": f"Update incident failed. Details: {str(e)}"}), 400
        
    except Exception as e:
        return jsonify({'error': f'Update incident failed. Details: {str(e)}'}), 500

@incidents_bp.route('/incidents/<incident_id>/claim', methods=['PUT'])
def claim_incident(incident_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        
        user_id = user["id"]
        
        data = ClaimIncident(incident_id, user_id, user["name"], user["role_type"]).execute()
        MonitorService().enqueue_event(user, "CLAIM-INCIDENT", f"INCIDENT_ID={str(data.id)}")

        return jsonify({
            "id": data.id,
            "type": data.type,
            "description": data.description,
            "contact": json.loads(data.contact),
            "user_issuer_id": data.user_issuer_id,
            "user_issuer_name": data.user_issuer_name,
            "publication_channel_id": data.publication_channel_id,
            "assigned_to_id": data.assigned_to_id,
            "assigned_to_name": data.assigned_to_name,
            "assigned_to_type": data.assigned_to_type,
            "sla": data.sla,
            "status": data.status,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 200

    except ValueError as e:
        if str(e) == "Incident not found":
            return jsonify({"error": "Incident not found"}), 404
        return jsonify({"error": f"Update incident failed. Details: {str(e)}"}), 400
        
    except Exception as e:
        return jsonify({'error': f'Update incident failed. Details: {str(e)}'}), 500
    
@incidents_bp.route('/incidents/<incident_id>/attachments', methods=['GET'])
def get_all_attachments(incident_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401

    try:
        user = decode_user(auth_header)
        if not user: 
            return jsonify({"error": "Unauthorized"}), 401

        attachments = GetAllAttachments(incident_id).execute()
        result = [
            {
                "id": attachment.id,
                "file_name": attachment.file_name,
                "file_uri": attachment.file_uri,
                "content_type": attachment.content_type,
                "user_attacher_id": attachment.user_attacher_id,
                "user_attacher_name": attachment.user_attacher_name,
                "createdAt": attachment.createdAt,
                "updatedAt": attachment.updatedAt
            }
            for attachment in attachments
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve attachments. Details: {str(e)}"}), 500

@incidents_bp.route('/incidents/<incident_id>/attachments/<attachment_id>', methods=['GET'])
def get_attachment(incident_id, attachment_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401

    try:
        user = decode_user(auth_header)
        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        attachment = GetAttachment(incident_id, attachment_id).execute()
        if not attachment:
            return jsonify({"error": "Attachment not found"}), 404

        result = {
            "id": attachment.id,
            "file_name": attachment.file_name,
            "file_uri": attachment.file_uri,
            "content_type": attachment.content_type,
            "user_attacher_id": attachment.user_attacher_id,
            "user_attacher_name": attachment.user_attacher_name,
            "created_at": attachment.createdAt.isoformat(),
            "updated_at": attachment.updatedAt.isoformat()
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve attachment. Details: {str(e)}"}), 500

@incidents_bp.route('/incidents/<incident_id>/feedback', methods=['GET'])
def get_feedback(incident_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401

    try:
        user = decode_user(auth_header)
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        feedback = ExistsFeedback(incident_id).execute()
        if not feedback:
            return jsonify({"error": "Feedback not found"}), 404

        return jsonify({
            "id": feedback.id,
            "incident_id": feedback.incident_id,
            "support_rating": feedback.support_rating,
            "ease_of_contact": feedback.ease_of_contact,
            "resolution_time": feedback.resolution_time,
            "support_staff_attitude": feedback.support_staff_attitude,
            "additional_comments": feedback.additional_comments,
            "created_at": feedback.createdAt.isoformat(),
            "updated_at": feedback.updatedAt.isoformat()
        }), 200

    except Exception as e:
        return jsonify({"error": f"Failed to get feedback. Details: {str(e)}"}), 500
    
@incidents_bp.route('/incidents/<incident_id>/feedback', methods=['POST'])
def create_feedback(incident_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization header missing"}), 401

    try:
        user = decode_user(auth_header)
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        
        data = request.get_json()
        
        support_rating = int(data.get('support_rating', 0))
        ease_of_contact = int(data.get('ease_of_contact', 0))
        resolution_time = int(data.get('resolution_time', 0))
        support_staff_attitude = int(data.get('support_staff_attitude', 0))
        additional_comments = data.get('additional_comments')

        if ExistsFeedback(incident_id).execute():
            return "The feedback incident already exists", 400

        feedback = CreateFeedback(user["id"], incident_id, support_rating, ease_of_contact, \
                                          resolution_time, support_staff_attitude, additional_comments).execute()
        
        MonitorService().enqueue_event(user, "CREATE-FEEDBACK", f"FEEDBACK_ID={str(feedback.id)}")

        return jsonify(
            {
                "id": feedback.id,
                "incident_id": feedback.incident_id,
                "support_rating": feedback.support_rating,
                "ease_of_contact": feedback.ease_of_contact,
                "resolution_time": feedback.resolution_time,
                "support_staff_attitude": feedback.support_staff_attitude,
                "additional_comments": feedback.additional_comments,
                "created_at": feedback.createdAt.isoformat(),
                "updated_at": feedback.updatedAt.isoformat()
            }
        ), 201
    except Exception as e:
        return jsonify({"error": f"Failed to create feedback incident feedback. Details: {str(e)}"}), 500