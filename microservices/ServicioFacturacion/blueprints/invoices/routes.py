import json
import uuid
from flask import Blueprint, request, jsonify
from ServicioFacturacion.commands.period_exists import ExistsPeriod
from ServicioFacturacion.commands.invoice_create import CreateInvoice
from ServicioFacturacion.commands.invoice_get_all import GetAllInvoices
from ServicioFacturacion.commands.invoice_get import GetInvoice
from ServicioFacturacion.commands.invoice_update import UpdateInvoice

invoices_bp = Blueprint('invoices', __name__)

@invoices_bp.route('/invoices', methods=['POST'])
def create_invoice():
    try:
        data = request.get_json()
        invoice_id = str(uuid.uuid4())
        description = data.get('description')
        period_id = data.get('periodId')
        date = data.get('date')
        amount = data.get('amount')
        status = data.get('status')

        if not invoice_id or not period_id or not date or\
           not amount or not status:
            return "Invalid parameters", 400
        
        if not ExistsPeriod(id=period_id).execute():
            return "Period not found", 404
        
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

@invoices_bp.route('/invoices', methods=['GET'])
def get_all_invoices():
    try:
        invoices = GetAllInvoices().execute()
        
        invoices_list = [{
            "id": invoice.id,
            "description": invoice.description,
            "periodId": invoice.period_id,
            "date": invoice.date,
            "amount": invoice.amount,
            "status": invoice.status
        } for invoice in invoices]

        return jsonify(invoices_list), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve invoices. Details: {str(e)}'}), 500

@invoices_bp.route('/invoices/<invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    try:
        invoice = GetInvoice(invoice_id).execute()
        
        if invoice is None:
            return jsonify({'error': 'Invoice not found'}), 404

        invoice_data = {
            "id": invoice.id,
            "description": invoice.description,
            "periodId": invoice.period_id,
            "date": invoice.date,
            "amount": invoice.amount,
            "status": invoice.status
        }

        return jsonify(invoice_data), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve invoice. Details: {str(e)}'}), 500
    
@invoices_bp.route('/invoices/<invoice_id>', methods=['PUT'])
def update_invoice(invoice_id):
    try:
        data = request.get_json()
        description = data.get('description')
        period_id = data.get('periodId')
        date = data.get('date')
        amount = data.get('amount')
        status = data.get('status')

        if not any([description, period_id, date, amount, status]):
            return jsonify({"error": "No fields to update"}), 400

        invoice = GetInvoice(invoice_id).execute()
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404

        updated_invoice = UpdateInvoice(
            invoice_id=invoice_id,
            description=description,
            period_id=period_id,
            date=date,
            amount=amount,
            status=status
        ).execute()

        return jsonify({
            "id": updated_invoice.id,
            "description": updated_invoice.description,
            "periodId": updated_invoice.period_id,
            "date": updated_invoice.date,
            "amount": updated_invoice.amount,
            "status": updated_invoice.status
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to update invoice. Details: {str(e)}'}), 500