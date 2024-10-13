from flask import Blueprint

healthcheck_bp = Blueprint('healthcheck_bp', __name__)

@healthcheck_bp.route('/healthcheck', methods=['GET'])
def healthcheck():
    return {'status': 'ok'}, 200
