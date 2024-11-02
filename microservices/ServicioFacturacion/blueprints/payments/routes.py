import json
import uuid
from flask import Blueprint, request, jsonify
from ServicioFacturacion.commands.period_exists import ExistsPeriod
from ServicioFacturacion.commands.payment_create import CreatePayment

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/payments', methods=['GET'])
def get_all_payments():
    try:
        return jsonify([
            {
                "id": str(uuid.uuid4()),
                "description": "lore ipsum",
                "periodId": "3675d547-d115-4437-87b8-890c52b1f819",
                "date": "2024-01-01",
                "amount": 150.00,
                "status": "paid"
            },
            {
                "id": str(uuid.uuid4()),
                "description": "lore ipsum",
                "periodId": "4675d547-d115-4437-87b8-890c52b1f819",
                "date": "2024-01-01",
                "amount": 150.00,
                "status": "paid"
            },
            {
                "id": str(uuid.uuid4()),
                "description": "lore ipsum",
                "periodId": "5675d547-d115-4437-87b8-890c52b1f819",
                "date": "2024-01-01",
                "amount": 150.00,
                "status": "paid"
            }
        ]), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve payments. Details: {str(e)}"}), 500
    

@payments_bp.route('/payments', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        payment_id = data.get('id')
        description = data.get('description')
        period_id = data.get('periodId')
        date = data.get('date')
        amount = data.get('amount')
        status = data.get('status')

        if not payment_id or not period_id or not date or\
           not amount or not status:
            return "Invalid parameters", 400
        
        if not ExistsPeriod(id=period_id).execute():
            return f"Period not found", 404
        
        invoice = CreatePayment(payment_id, description, period_id, date, amount, status).execute()

        return jsonify({
                "id": invoice.id,
                "description": invoice.description,
                "periodId": invoice.period_id,
                "date": invoice.date,
                "amount": invoice.amount,
                "status": invoice.status
            }), 200
    except Exception as e:
        return jsonify({'error': f'"Create period failed. Details: {str(e)}'}), 500