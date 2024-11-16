from flask import Blueprint, request, jsonify
from ServicioCanal.utils import decode_user
from datetime import datetime

from ServicioMonitoreoNegocio.commands.log_get_by_filters import GetLogs

logs_bp = Blueprint('logs_bp', __name__)

@logs_bp.route('/logs', methods=['GET'])
def get_all_logs():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)
        #TODO: check agent
        source_id = request.args.get('source_id')
        event_type = request.args.get('event_type')
        
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        order = request.args.get('order', 'desc')

        start_date = None
        end_date = None

        if start_date_str:
            start_date = datetime.fromisoformat(start_date_str)
        if end_date_str:
            end_date = datetime.fromisoformat(end_date_str)

        logs = GetLogs(
            source_id=source_id, 
            event_type=event_type, 
            start_date=start_date, 
            end_date=end_date,
            order=order
        ).execute()

        result = []
        for log in logs:
            data = {
                "id": log.id,
                "source_id": log.source_id,
                "source_name": log.source_name,
                "source_type": log.source_type,
                "event_type": log.event_type,
                "event_content": log.event_content,
                "created_at": log.createdAt.isoformat()
            }
            result.append(data)

        return jsonify(result), 200       
    except Exception as e:
        return jsonify({'error': f'Error retrieving logs. Details: {str(e)}'}), 500