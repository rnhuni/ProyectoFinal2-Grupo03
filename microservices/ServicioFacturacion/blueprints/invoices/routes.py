import json
import uuid
from flask import Blueprint, request, jsonify
from ServicioFacturacion.commands.period_exists import ExistsPeriod
from ServicioFacturacion.commands.invoice_create import CreateInvoice


invoices_bp = Blueprint('invoices', __name__)

@invoices_bp.route('/invoices', methods=['GET'])
def get_all_invoices():
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
        return jsonify({"error": f"Failed to retrieve invoices. Details: {str(e)}"}), 500
    

@invoices_bp.route('/invoices', methods=['POST'])
def create_invoice():
    try:
        data = request.get_json()
        invoice_id = data.get('id')
        description = data.get('description')
        period_id = data.get('periodId')
        date = data.get('date')
        amount = data.get('amount')
        status = data.get('status')

        if not invoice_id or not period_id or not date or\
           not amount or not status:
            return "Invalid parameters", 400
        
        if not ExistsPeriod(id=period_id).execute():
            return f"Period not found", 404
        
        invoice = CreateInvoice(invoice_id, description, period_id, date, amount, status).execute()

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