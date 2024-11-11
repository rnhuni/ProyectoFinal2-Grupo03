from flask import Blueprint, request, jsonify
from ServicioSistema.commands.features_get_all import GetAllFeatures

features_bp = Blueprint('features_bp', __name__)

@features_bp.route('/features', methods=['GET'])
def get_all_features():
    try:
        features = GetAllFeatures().execute()

        return jsonify([{
            "id": perm.id,
            "name": perm.name,
            "description": perm.description,
            "price": float(perm.price),
            "created_at": perm.createdAt.isoformat(),
            "updated_at": perm.updatedAt.isoformat()
        } for perm in features]), 200
    except Exception as e:
        return jsonify({'error': f'Error retrieving features. Details: {str(e)}'}), 500