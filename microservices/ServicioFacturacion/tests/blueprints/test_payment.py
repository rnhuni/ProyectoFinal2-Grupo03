import pytest
import uuid
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioFacturacion.blueprints.payments.routes import payments_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(payments_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_payment_success(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_exists.ExistsPeriod.execute', return_value=True)
    
    mock_payment = MagicMock()
    mock_payment.id = str(uuid.uuid4())
    mock_payment.description = "Test payment description"
    mock_payment.period_id = "period-123"
    mock_payment.date = "2024-01-01"
    mock_payment.amount = 100.0
    mock_payment.status = "COMPLETED"
    mocker.patch('ServicioFacturacion.commands.payment_create.CreatePayment.execute', return_value=mock_payment)

    data = {
        "description": "Test payment description",
        "periodId": "period-123",
        "date": "2024-01-01",
        "amount": 100.0,
        "status": "COMPLETED"
    }

    response = client.post('/api/payments', json=data)

    assert response.status_code == 200
    assert response.json == {
        "id": mock_payment.id,
        "description": mock_payment.description,
        "periodId": mock_payment.period_id,
        "date": mock_payment.date,
        "amount": mock_payment.amount,
        "status": mock_payment.status
    }

def test_create_payment_invalid_params(client):
    data = {
        "description": "Test payment description",
        "date": "2024-01-01",
        "amount": 100.0
    }

    response = client.post('/api/payments', json=data)

    assert response.status_code == 400
    assert response.get_data(as_text=True) == "Invalid parameters"

def test_create_payment_period_not_found(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_exists.ExistsPeriod.execute', return_value=False)

    data = {
        "description": "Test payment description",
        "periodId": "nonexistent-period",
        "date": "2024-01-01",
        "amount": 100.0,
        "status": "COMPLETED"
    }

    response = client.post('/api/payments', json=data)

    assert response.status_code == 404
    assert response.get_data(as_text=True) == "Period not found"

def test_create_payment_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_exists.ExistsPeriod.execute', return_value=True)
    mocker.patch('ServicioFacturacion.commands.payment_create.CreatePayment.execute', side_effect=Exception("Database error"))

    data = {
        "description": "Test payment description",
        "periodId": "period-123",
        "date": "2024-01-01",
        "amount": 100.0,
        "status": "COMPLETED"
    }

    response = client.post('/api/payments', json=data)

    assert response.status_code == 500
    assert 'Create period failed. Details: Database error' in response.json['error']

def test_get_all_payments_success(client, mocker):
    mock_payment = MagicMock()
    mock_payment.id = str(uuid.uuid4())
    mock_payment.description = "Test payment description"
    mock_payment.period_id = "period-123"
    mock_payment.date = "2024-01-01"
    mock_payment.amount = 100.0
    mock_payment.status = "COMPLETED"
    mocker.patch('ServicioFacturacion.commands.payment_get_all.GetAllPayments.execute', return_value=[mock_payment])

    response = client.get('/api/payments')

    assert response.status_code == 200
    assert response.json == [
        {
            "id": mock_payment.id,
            "description": mock_payment.description,
            "periodId": mock_payment.period_id,
            "date": mock_payment.date,
            "amount": mock_payment.amount,
            "status": mock_payment.status
        }
    ]

def test_get_all_payments_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.payment_get_all.GetAllPayments.execute', side_effect=Exception("Database error"))

    response = client.get('/api/payments')

    assert response.status_code == 500
    assert 'Failed to retrieve payments. Details: Database error' in response.json['error']

def test_get_payment_success(client, mocker):
    mock_payment = MagicMock()
    mock_payment.id = str(uuid.uuid4())
    mock_payment.description = "Test payment description"
    mock_payment.period_id = "period-123"
    mock_payment.date = "2024-01-01"
    mock_payment.amount = 100.0
    mock_payment.status = "COMPLETED"
    mocker.patch('ServicioFacturacion.commands.payment_get.GetPayment.execute', return_value=mock_payment)

    response = client.get(f'/api/payments/{mock_payment.id}')

    assert response.status_code == 200
    assert response.json == {
        "id": mock_payment.id,
        "description": mock_payment.description,
        "periodId": mock_payment.period_id,
        "date": mock_payment.date,
        "amount": mock_payment.amount,
        "status": mock_payment.status
    }

def test_get_payment_not_found(client, mocker):
    mocker.patch('ServicioFacturacion.commands.payment_get.GetPayment.execute', return_value=None)

    response = client.get('/api/payments/nonexistent-payment-id')

    assert response.status_code == 404
    assert response.json == {'error': 'Payment not found'}

def test_get_payment_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.payment_get.GetPayment.execute', side_effect=Exception("Database error"))

    response = client.get('/api/payments/some-payment-id')

    assert response.status_code == 500
    assert 'Failed to retrieve payment. Details: Database error' in response.json['error']

def test_update_payment_success(client, mocker):
    mock_payment = MagicMock()
    mock_payment.id = "existing-payment-id"
    mock_payment.description = "Old description"
    mock_payment.period_id = "period-123"
    mock_payment.date = "2024-01-01"
    mock_payment.amount = 100.0
    mock_payment.status = "COMPLETED"
    mocker.patch('ServicioFacturacion.commands.payment_get.GetPayment.execute', return_value=mock_payment)

    updated_payment = MagicMock()
    updated_payment.id = mock_payment.id
    updated_payment.description = "Updated description"
    updated_payment.period_id = "period-123"
    updated_payment.date = "2024-01-02"
    updated_payment.amount = 200.0
    updated_payment.status = "PAID"
    mocker.patch('ServicioFacturacion.commands.payment_update.UpdatePayment.execute', return_value=updated_payment)

    data = {
        "description": "Updated description",
        "date": "2024-01-02",
        "amount": 200.0,
        "status": "PAID"
    }

    response = client.put(f'/api/payments/{mock_payment.id}', json=data)

    assert response.status_code == 200
    assert response.json == {
        "id": updated_payment.id,
        "description": updated_payment.description,
        "periodId": updated_payment.period_id,
        "date": updated_payment.date,
        "amount": updated_payment.amount,
        "status": updated_payment.status
    }

def test_update_payment_no_fields_to_update(client):
    data = {}
    response = client.put('/api/payments/existing-payment-id', json=data)
    assert response.status_code == 400
    assert response.json == {"error": "No fields to update"}

def test_update_payment_not_found(client, mocker):
    mocker.patch('ServicioFacturacion.commands.payment_get.GetPayment.execute', return_value=None)

    data = {
        "description": "Updated description",
        "date": "2024-01-02",
        "amount": 200.0,
        "status": "PAID"
    }

    response = client.put('/api/payments/nonexistent-payment-id', json=data)

    assert response.status_code == 404
    assert response.json == {"error": "Payment not found"}

def test_update_payment_exception(client, mocker):
    mock_payment = MagicMock()
    mock_payment.id = "existing-payment-id"
    mocker.patch('ServicioFacturacion.commands.payment_get.GetPayment.execute', return_value=mock_payment)
    mocker.patch('ServicioFacturacion.commands.payment_update.UpdatePayment.execute', side_effect=Exception("Database error"))

    data = {
        "description": "Updated description",
        "date": "2024-01-02",
        "amount": 200.0,
        "status": "PAID"
    }

    response = client.put(f'/api/payments/{mock_payment.id}', json=data)

    assert response.status_code == 500
    assert 'Failed to update payment. Details: Database error' in response.json['error']

def test_update_payment_value_error(client, mocker):
    mock_payment = MagicMock()
    mock_payment.id = "existing-payment-id"
    mocker.patch('ServicioFacturacion.commands.payment_get.GetPayment.execute', return_value=mock_payment)
    
    mocker.patch('ServicioFacturacion.commands.payment_update.UpdatePayment.execute', side_effect=ValueError("Some value error"))

    data = {
        "description": "Updated description",
        "date": "2024-01-02",
        "amount": 200.0,
        "status": "PAID"
    }

    response = client.put(f'/api/payments/{mock_payment.id}', json=data)

    assert response.status_code == 404
    assert response.json == {"error": "Some value error"}
