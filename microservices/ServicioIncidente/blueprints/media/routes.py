import json
import uuid
from flask import Blueprint, request, jsonify
from ServicioIncidente.services.s3 import S3Service

media_bp = Blueprint('media_bp', __name__)

@media_bp.route('/media/upload-url', methods=['POST'])
def create_upload_url():
    object_name = str(uuid.uuid4())
    expiration = 3600
    try:
        data = request.get_json()
        content_type = data.get('content_type')
        file_name = data.get('file_name')

        if not file_name or not content_type:
            return "Invalid parameters", 400

        uri = S3Service().generate_upload_url(object_name, file_name, content_type, expiration)

        return {
            "media_id": object_name,
            "media_name": file_name,
            "content_type":content_type,
            "upload_url": uri
        }
    except Exception as e:
        return jsonify({'error': f'Create upload url failed. Details: {str(e)}'}), 500
    

@media_bp.route('/media/download-url', methods=['POST'])
def create_download_url():
    expiration = 3600
    try:
        data = request.get_json()
        object_name = data.get('media_id')

        if not object_name:
            return "Invalid parameters", 400

        return S3Service().generate_download_url(object_name, expiration), 200
    except Exception as e:
        return jsonify({'error': f'Create upload url failed. Details: {str(e)}'}), 500