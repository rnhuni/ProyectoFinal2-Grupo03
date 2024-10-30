import json
import uuid
from flask import Blueprint, request, jsonify

periods_bp = Blueprint('periods', __name__)

@periods_bp.route('/periods', methods=['GET'])
def getAll_periods():
    #auth_header = request.headers.get('Authorization')
    
    try:
        #user = decode_user(auth_header)

        return jsonify([
            {
                "id": "3675d547-d115-4437-87b8-890c52b1f819",
                "periodStatus": "current_period",
                "periodDate": "2024-10-01",
                "subscriptionClientId": "4675d547-d115-4437-87b8-890c52b1f819",
                "subscriptionBaseId": "plan-premium-master",
                "subscriptionBaseName": "Plan Premium Master",
                "invoiceId": "0000d547-d115-4437-87b8-890c52b1f819",
                "invoiceDate": "2024-10-24 19:35:55.357",
                "invoiceStatus": "paid",
                "invoiceAmount": 120.00,
                "paymentId": "0000e547-d115-4437-87b8-890c52b1f819",
                "paymentDate": "2024-10-24 19:35:55.357",
                "paimentAmount": 120.00
            },
            {
                "id": "007dab05-e81b-4379-83f6-c4259580b7a4",
                "periodStatus" : "expired",
                "periodDate": "2024-09-01",
                "subscriptionClientId": "5675d547-d115-4437-87b8-890c52b1f819",
                "subscriptionBaseId": "plan-pro-engage",
                "subscriptionBaseName": "Plan Pro Engage",
                "invoiceDate": "2024-10-24 19:35:55.357",
                "invoiceId": "0000f547-d115-4437-87b8-890c52b1f819",
                "invoiceStatus": "paid",
                "invoiceAmount": 120.00,
                "paymentId": "0000e547-d115-4437-87b8-890c52b1f819",
                "paymentDate": "2024-10-24 19:35:55.357",
                "paimentAmount": 120.00               
            },
            {
                "id": "007dab05-e81b-4379-83f6-c4259580b7a4",
                "periodStatus": "expired",
                "periodDate": "2024-08-01",
                "subscriptionClientId": "6675d547-d115-4437-87b8-890c52b1f819",
                "subscriptionBaseId": "plan-basico-connect",
                "subscriptionBaseName": "Plan Básico Connect",                
                "invoiceId": "0000e547-d115-4437-87b8-890c52b1f819",
                "invoiceStatus": "paid",
                "invoiceDate": "2024-10-24 19:35:55.357",
                "invoiceAmount": 120.00,
                "paymentId": "0000e547-d115-4437-87b8-890c52b1f819",
                "paymentDate": "2024-10-24 19:35:55.357",
                "paimentAmount": 120.00
            }
        ]), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve periods. Details: {str(e)}"}), 500
    

@periods_bp.route('/periods/active', methods=['GET'])
def getCurrent_periods():
    try:        
        return jsonify(
            {
                "id": "3675d547-d115-4437-87b8-890c52b1f819",
                "periodStatus": "current_period",
                "periodDate": "2024-10-01",
                "subscriptionClientId": "4675d547-d115-4437-87b8-890c52b1f819",
                "subscriptionBaseId": "plan-premium-master",
                "subscriptionBaseName": "Plan Premium Master",
                "invoiceId": "0000d547-d115-4437-87b8-890c52b1f819",
                "invoiceDate": "2024-10-24 19:35:55.357",
                "invoiceStatus": "paid",
                "invoiceAmount": 120.00,
                "paymentId": "0000e547-d115-4437-87b8-890c52b1f819",
                "paymentDate": "2024-10-24 19:35:55.357",
                "paimentAmount": 120.00
            }), 200
    except Exception as e:
        return jsonify({'error': f'"Failed to retrieve current periods. Details: {str(e)}'}), 500