import json
import uuid
from flask import Blueprint, request, jsonify
from ServicioFacturacion.commands.active_subscription_get import GetActiveSubscription
from ServicioFacturacion.commands.period_create import CreatePeriod
from ServicioFacturacion.commands.period_update import UpdatePeriod
from ServicioFacturacion.commands.period_exists import ExistsPeriod
from ServicioFacturacion.commands.period_get import GetPeriod
from ServicioFacturacion.commands.period_get_all import GetAllPeriods
from ServicioFacturacion.utils import decode_user

periods_bp = Blueprint('periods', __name__)

@periods_bp.route('/periods', methods=['GET'])
def get_all_periods():
    try:
        periods = GetAllPeriods().execute()

        periods_list = [
            {
                "id": str(period.id),
                "periodStatus": period.status,
                "periodDate": period.date,
                "subscriptionClientId": str(period.client_id),
                "subscriptionBaseId": period.active_subscription.base_id if period.active_subscription else None,
                "subscriptionBaseName": period.active_subscription.base_name if period.active_subscription else None,
                "invoiceId": str(period.invoice.id) if period.invoice else None,
                "invoiceDate": period.invoice.date if period.invoice else None,
                "invoiceStatus": period.invoice.status if period.invoice else None,
                "invoiceAmount": float(period.invoice.amount) if period.invoice else None,
                "paymentId": str(period.payment.id) if period.payment else None,
                "paymentDate": period.payment.date if period.payment else None,
                "paymentAmount": float(period.payment.amount) if period.payment else None
            }
            for period in periods
        ]

        return jsonify(periods_list), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve periods. Details: {str(e)}'}), 500    

@periods_bp.route('/periods/active', methods=['GET'])
def get_current_periods():
    auth_header = request.headers.get('Authorization')

    try:
        user = decode_user(auth_header)

        if not user:
            return jsonify({"error": "Unauthorized"}), 401

        client_id = user["client"]

        active_periods = GetPeriod(client_id=client_id, status="active").execute()

        if not active_periods:
            return jsonify({"message": "No active periods found"}), 404

        periods_list = [
            {
                "id": str(period.id),
                "periodStatus": period.status,
                "periodDate": period.date,
                "subscriptionClientId": str(period.active_subscription.client_id) if period.active_subscription else None,
                "subscriptionBaseId": period.active_subscription.base_id if period.active_subscription else None,
                "subscriptionBaseName": period.active_subscription.base_name if period.active_subscription else None,
                "invoiceId": str(period.invoice.id) if period.invoice else None,
                "invoiceDate": period.invoice.date if period.invoice else None,
                "invoiceStatus": period.invoice.status if period.invoice else None,
                "invoiceAmount": float(period.invoice.amount) if period.invoice else None,
                "paymentId": str(period.payment.id) if period.payment else None,
                "paymentDate": period.payment.date if period.payment else None,
                "paymentAmount": float(period.payment.amount) if period.payment else None
            }
            for period in active_periods
        ]

        return jsonify(periods_list), 200
    except Exception as e:
        return jsonify({'error': f'Failed to retrieve active periods. Details: {str(e)}'}), 500

@periods_bp.route('/periods', methods=['POST'])
def create_period():
    try:
        data = request.get_json()
        client_id = data.get('clientId')
        period_date = data.get('periodDate')
        active_subscription_id = data.get('activeSubscriptionId')
        status = data.get('status')

        if not client_id or not period_date or not active_subscription_id or\
           not status:
            return "Invalid parameters", 400
        
        subscription = GetActiveSubscription(active_subscription_id).execute()
        if not subscription:
            return "Active subscription not found", 404
        
        period = GetPeriod(client_id=client_id, period_date=period_date).execute()

        if period:            
            period = UpdatePeriod(period, subscription, status).execute()
        else:
            period = CreatePeriod(client_id, period_date, subscription, status).execute()

        return jsonify({
            "id": period.id,
            "periodStatus": period.status,
            "periodDate": period.date
        }), 200
    except Exception as e:
        return jsonify({'error': f'"Create period failed. Details: {str(e)}'}), 500

@periods_bp.route('/periods/<period_id>', methods=['PUT'])
def update_period(period_id):
    try:
        data = request.get_json()
        status = data.get('status')
        active_subscription_id = data.get('activeSubscriptionId')

        if not all([status, active_subscription_id]):
            return jsonify({"error": "No fields to update or missing required fields"}), 400

        period = GetPeriod(id=period_id).execute()
        if not period:
            return jsonify({"error": "Period not found"}), 404

        active_subscription = GetActiveSubscription(active_subscription_id).execute()
        if not active_subscription:
            return jsonify({"error": "Active subscription not found"}), 404

        updated_period = UpdatePeriod(
            period=period,
            active_subscription=active_subscription,
            status=status
        ).execute()

        return jsonify({
            "id": str(updated_period.id),
            "periodStatus": updated_period.status,
            "periodDate": updated_period.date,
            "subscriptionClientId": str(updated_period.active_subscription.client_id) if updated_period.active_subscription else None,
            "subscriptionBaseId": updated_period.active_subscription.base_id if updated_period.active_subscription else None,
            "subscriptionBaseName": updated_period.active_subscription.base_name if updated_period.active_subscription else None
        }), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Failed to update period. Details: {str(e)}'}), 500