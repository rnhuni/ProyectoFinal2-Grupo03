import json
from flask import Blueprint, request, jsonify
from ServicioReporte.utils import decode_user
from datetime import datetime

from ServicioReporte.commands.task_create import CreateTask
from ServicioReporte.commands.task_get import GetTask
from ServicioReporte.services.task_service import TaskService

reports_bp = Blueprint('reports_bp', __name__)
    
@reports_bp.route('/reports/log', methods=['POST'])
def create_report():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        #TODO: check agent
        data = request.get_json()
        source_id = data.get('source_id')
        event_type = data.get('event_type')
        start_date_str = data.get('start_date')
        end_date_str = data.get('end_date')

        order = request.args.get('order', 'desc')

        filters = json.dumps({
            "source_id": source_id, 
            "event_type": event_type, 
            "start_date":start_date_str, 
            "end_date": end_date_str,
            "order": order
        })

        task = CreateTask(filters).execute()
        TaskService().enqueue_task(str(task.id))

        return jsonify({
            "id": str(task.id),
            "filters": task.filters,
            "status": task.status,
            "created_at": task.createdAt.isoformat()
        }), 201       
    except Exception as e:
        return jsonify({'error': f'Error retrieving logs. Details: {str(e)}'}), 500
    
@reports_bp.route('/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        #TODO: check agent
        task = GetTask(report_id).execute()
        if not task:
            return "Task not found", 404
        
        download_url = ""
        if task.status == "COMPLETED":
            expiration = 3600
            download_url = TaskService().generate_download_url(task.key, expiration)
        
        return jsonify({
            "id": str(task.id),
            "filters": task.filters,
            "status": task.status,
            "download_url": download_url,
            "created_at": task.createdAt.isoformat(),
            "updated_at": task.updatedAt.isoformat()
        }), 201       
    except Exception as e:
        return jsonify({'error': f'Error retrieving logs. Details: {str(e)}'}), 500