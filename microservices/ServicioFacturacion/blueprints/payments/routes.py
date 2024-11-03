import json
import uuid
from flask import Blueprint, request, jsonify
from ServicioFacturacion.commands.period_exists import ExistsPeriod
from ServicioFacturacion.commands.payment_create import CreatePayment
from ServicioFacturacion.commands.payment_get_all import GetAllPayments
from ServicioFacturacion.commands.payment_get import GetPayment
from ServicioFacturacion.commands.payment_update import UpdatePayment

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/payments', methods=['GET'])
def get_all_payments():
    try:
        payments = GetAllPayments().execute()

        payments_list = [
            {
                "id": str(payment.id),
                "description": payment.description,
                "periodId": str(payment.period_id),
                "date": payment.date,
                "amount": float(payment.amount),
                "status": payment.status
            } for payment in payments
        ]

        return jsonify(payments_list), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve payments. Details: {str(e)}'}), 500    

@payments_bp.route('/payments/<payment_id>', methods=['GET'])
def get_payment(payment_id):
    try:
        payment = GetPayment(payment_id).execute()

        if not payment:
            return jsonify({'error': 'Payment not found'}), 404

        payment_data = {
            "id": str(payment.id),
            "description": payment.description,
            "periodId": str(payment.period_id),
            "date": payment.date,
            "amount": float(payment.amount),
            "status": payment.status
        }

        return jsonify(payment_data), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve payment. Details: {str(e)}'}), 500
        
@payments_bp.route('/payments', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        payment_id = str(uuid.uuid4())
        description = data.get('description')
        period_id = data.get('periodId')
        date = data.get('date')
        amount = data.get('amount')
        status = data.get('status')

        if not payment_id or not period_id or not date or\
           not amount or not status:
            return "Invalid parameters", 400
        
        if not ExistsPeriod(id=period_id).execute():
            return "Period not found", 404
        
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

@payments_bp.route('/payments/<payment_id>', methods=['PUT'])
def update_payment(payment_id):
    try:
        data = request.get_json()
        description = data.get('description')
        period_id = data.get('periodId')
        date = data.get('date')
        amount = data.get('amount')
        status = data.get('status')

        if not any([description, period_id, date, amount, status]):
            return jsonify({"error": "No fields to update"}), 400

        existing_payment = GetPayment(payment_id).execute()
        if not existing_payment:
            return jsonify({"error": "Payment not found"}), 404

        updated_payment = UpdatePayment(
            payment_id=payment_id,
            description=description,
            period_id=period_id,
            date=date,
            amount=amount,
            status=status
        ).execute()

        payment_data = {
            "id": str(updated_payment.id),
            "description": updated_payment.description,
            "periodId": str(updated_payment.period_id),
            "date": updated_payment.date,
            "amount": float(updated_payment.amount),
            "status": updated_payment.status
        }

        return jsonify(payment_data), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({'error': f'Failed to update payment. Details: {str(e)}'}), 500