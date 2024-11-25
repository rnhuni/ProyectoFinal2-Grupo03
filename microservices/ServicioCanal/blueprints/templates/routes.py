from flask import Blueprint, request, jsonify
from ServicioCanal.utils import decode_user
from ServicioCanal.utils.utils import build_channel_id
import uuid

from ServicioCanal.commands.template_create import CreateTemplate
from ServicioCanal.commands.template_get import GetTemplate
from ServicioCanal.commands.template_get_all import GetAllTemplates
from ServicioCanal.commands.template_update import UpdateTemplate

templates_bp = Blueprint('templates_bp', __name__)

@templates_bp.route('/templates', methods=['GET'])
def get_templates():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        templates = GetAllTemplates().execute()

        result = [{
            "id": str(template.id),
            "content_type": template.content_type,
            "body": template.body,
            "auto_trigger": bool(template.auto_trigger),
            "status": template.status,
            "trigger_event": template.trigger_event,
            "created_at": template.createdAt.isoformat(),
            "updated_at": template.updatedAt.isoformat()
        } for template in templates]

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': f'Error retrieving templates. Details: {str(e)}'}), 500

@templates_bp.route('/templates/<template_id>', methods=['GET'])
def get_template(template_id):
    try:
        template = GetTemplate(template_id).execute()

        if not template:
            return jsonify({'error': 'Template not found'}), 404

        result = {
            "id": str(template.id),
            "content_type": template.content_type,
            "body": template.body,
            "auto_trigger": bool(template.auto_trigger),
            "status": template.status,
            "trigger_event": template.trigger_event,
            "created_at": template.createdAt.isoformat(),
            "updated_at": template.updatedAt.isoformat()
        }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': f'Error retrieving template. Details: {str(e)}'}), 500

@templates_bp.route('/templates', methods=['POST'])
def create_template():
    auth_header = request.headers.get('Authorization')
    
    try:
        user = decode_user(auth_header)
        #TODO: check role

        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        name = data["name"]
        content_type = data.get('content_type')
        body = data.get('body')
        auto_trigger = bool(data.get('auto_trigger', False))
        status = data.get('status', 'DISABLED')
        trigger_event = data.get('trigger_event')
        
        if not name or not body or not content_type:
            return jsonify({"error": "Invalid parameters"}), 400

        data = CreateTemplate(name, content_type, body, auto_trigger, status, trigger_event).execute()
    
        return jsonify([{
            "id": str(data.id),
            "content_type": data.content_type,
            "body": data.body,
            "auto_trigger": bool(data.auto_trigger),
            "status": data.status,
            "trigger_event": data.trigger_event,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }]), 201
    except KeyError as e:
        return jsonify({"error": f"Missing required fields: {str(e)}"}), 400
    except Exception as e:
        return jsonify({'error': f'Error creating template. Details: {str(e)}'}), 500    

@templates_bp.route('/templates/<template_id>', methods=['PUT'])
def edit_template(template_id):
    auth_header = request.headers.get('Authorization')
    
    try:
        user = decode_user(auth_header)
        #TODO: check role
        
        data = request.get_json()
        name = data["name"]
        content_type = data.get('content_type')
        body = data.get('body')
        auto_trigger = data.get('auto_trigger')
        status = data.get('status')
        trigger_event = data.get('trigger_event')

        if not body or not content_type:
            return jsonify({"error": "Invalid parameters"}), 400

        template = GetTemplate(template_id).execute()
        if not template:
            return jsonify({"error": "Session not found"}), 404

        data = UpdateTemplate(template, name, content_type, body, auto_trigger, status, trigger_event).execute()

        return jsonify({
            "id": str(data.id),
            "content_type": data.content_type,
            "body": data.body,
            "auto_trigger": bool(data.auto_trigger),
            "status": data.status,
            "trigger_event": data.trigger_event,
            "created_at": data.createdAt.isoformat(),
            "updated_at": data.updatedAt.isoformat()
        }), 200
    except Exception as e:
        return jsonify({'error': f'Error updating template. Details: {str(e)}'}), 500