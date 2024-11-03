import pytest
import jwt
import uuid
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioFacturacion.blueprints.periods.routes import periods_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(periods_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def generate_headers():
    token_payload = {
        "sub": "user123",
        "name": "Test User",
        "email": "test@example.com",
        "custom:client": "client-1"
    }
    token = jwt.encode(token_payload, "secret", algorithm="HS256")
    headers = {'Authorization': f'Bearer {token}'}
    return headers

def test_get_current_periods_success(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.blueprints.periods.routes.decode_user', return_value=mock_user)

    mock_period = MagicMock()
    mock_period.id = str(uuid.uuid4())
    mock_period.status = "active"
    mock_period.date = "2024-10-01"
    mock_period.active_subscription = MagicMock()
    mock_period.active_subscription.client_id = "client-1"
    mock_period.active_subscription.base_id = "plan-premium"
    mock_period.active_subscription.base_name = "Plan Premium"
    mock_period.invoice = None
    mock_period.payment = None

    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=[mock_period])

    response = client.get('/api/periods/active', headers=headers)

    assert response.status_code == 200
    assert len(response.json) == 1
    assert response.json[0]["id"] == mock_period.id
    assert response.json[0]["subscriptionBaseId"] == "plan-premium"
    assert response.json[0]["subscriptionBaseName"] == "Plan Premium"


def test_get_current_periods_unauthorized(client, mocker):
    mocker.patch('ServicioFacturacion.blueprints.periods.routes.decode_user', return_value=None)

    response = client.get('/api/periods/active')

    assert response.status_code == 401
    assert response.json == {"error": "Unauthorized"}

def test_get_current_periods_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', side_effect=Exception("Database error"))
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.blueprints.periods.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    response = client.get('/api/periods/active', headers=headers)

    assert response.status_code == 500
    assert 'Failed to retrieve active periods. Details: Database error' in response.json['error']

def test_get_all_periods_success(client, mocker):
    mock_period = MagicMock()
    mock_period.id = str(uuid.uuid4())
    mock_period.status = "active"
    mock_period.date = "2024-10-01"
    mock_period.client_id = "client-1"
    mock_period.active_subscription.base_id = "plan-premium"
    mock_period.active_subscription.base_name = "Plan Premium"
    mock_period.invoice.id = "invoice-123"
    mock_period.invoice.date = "2024-10-15"
    mock_period.invoice.status = "paid"
    mock_period.invoice.amount = 120.0
    mock_period.payment.id = "payment-123"
    mock_period.payment.date = "2024-10-16"
    mock_period.payment.amount = 120.0

    mocker.patch('ServicioFacturacion.commands.period_get_all.GetAllPeriods.execute', return_value=[mock_period])

    response = client.get('/api/periods')
    assert response.status_code == 200
    assert len(response.json) == 1

def test_get_all_periods_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_get_all.GetAllPeriods.execute', side_effect=Exception("DB error"))
    response = client.get('/api/periods')
    assert response.status_code == 500
    assert "Failed to retrieve periods" in response.json['error']

def test_get_current_periods_unauthorized(client, mocker):
    mocker.patch('ServicioFacturacion.blueprints.periods.routes.decode_user', return_value=None)
    response = client.get('/api/periods/active')
    assert response.status_code == 401
    assert response.json == {"error": "Unauthorized"}

def test_get_current_periods_exception(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', side_effect=Exception("DB error"))
    mocker.patch('ServicioFacturacion.blueprints.periods.routes.decode_user', return_value={"client": "client-1"})
    response = client.get('/api/periods/active', headers=headers)
    assert response.status_code == 500
    assert "Failed to retrieve active periods" in response.json['error']

def test_create_period_success(client, mocker):
    mock_period = MagicMock()
    mock_period.id = str(uuid.uuid4())
    mock_period.status = "active"
    mock_period.date = "2024-10-01"
    
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=True)
    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=None)
    mocker.patch('ServicioFacturacion.commands.period_create.CreatePeriod.execute', return_value=mock_period)

    data = {
        "clientId": "client-1",
        "periodDate": "2024-10-01",
        "activeSubscriptionId": "sub-123",
        "status": "active"
    }
    response = client.post('/api/periods', json=data)
    assert response.status_code == 200

def test_create_period_invalid_params(client):
    data = {}
    response = client.post('/api/periods', json=data)
    assert response.status_code == 400
    assert response.get_data(as_text=True) == "Invalid parameters"

def test_create_period_subscription_not_found(client, mocker):
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=None)
    data = {
        "clientId": "client-1",
        "periodDate": "2024-10-01",
        "activeSubscriptionId": "sub-123",
        "status": "active"
    }
    response = client.post('/api/periods', json=data)
    assert response.status_code == 404
    assert response.get_data(as_text=True) == "Active subscription not found"

def test_update_period_success(client, mocker):
    mock_period = MagicMock()
    mock_period.id = str(uuid.uuid4())
    mock_period.status = "updated_status"
    mock_period.date = "2024-10-02"
    
    mock_period.active_subscription = MagicMock()
    mock_period.active_subscription.client_id = "client-1"
    mock_period.active_subscription.base_id = "base-123"
    mock_period.active_subscription.base_name = "Base Subscription"
    
    mock_period.invoice = None
    mock_period.payment = None

    mock_active_subscription = MagicMock()
    mock_active_subscription.id = "sub-123"
    mock_active_subscription.client_id = "client-1"
    mock_active_subscription.base_id = "base-123"
    mock_active_subscription.base_name = "Base Subscription"

    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=mock_period)
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=mock_active_subscription)
    mocker.patch('ServicioFacturacion.commands.period_update.UpdatePeriod.execute', return_value=mock_period)

    data = {
        "status": "updated_status",
        "activeSubscriptionId": mock_active_subscription.id
    }

    response = client.put(f'/api/periods/{mock_period.id}', json=data)

    assert response.status_code == 200
    assert response.json["id"] == str(mock_period.id)
    assert response.json["periodStatus"] == "updated_status"
    assert response.json["subscriptionBaseId"] == "base-123"
    assert response.json["subscriptionBaseName"] == "Base Subscription"

def test_update_period_invalid_parameters(client):
    data = {}
    response = client.put('/api/periods/nonexistent-id', json=data)
    assert response.status_code == 400
    assert response.json == {"error": "No fields to update or missing required fields"}

def test_update_period_not_found(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=None)
    data = {
        "status": "active",
        "activeSubscriptionId": "sub-123"
    }
    response = client.put('/api/periods/nonexistent-id', json=data)
    assert response.status_code == 404
    assert response.json == {"error": "Period not found"}

def test_get_current_periods_no_active_periods(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.blueprints.periods.routes.decode_user', return_value=mock_user)
    
    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=[])

    response = client.get('/api/periods/active', headers=headers)
    assert response.status_code == 404
    assert response.json == {"message": "No active periods found"}

def test_create_period_exception(client, mocker):
    headers = generate_headers()
    
    mocker.patch('ServicioFacturacion.commands.period_create.CreatePeriod.execute', side_effect=Exception("Could not locate a bind configured on mapper mapped class ActiveSubscription->active_subscription, SQL expression or this Session."))
    
    data = {
        "clientId": "client-1",
        "periodDate": "2024-10-01",
        "activeSubscriptionId": "sub-123",
        "status": "active"
    }

    response = client.post('/api/periods', json=data, headers=headers)
    assert response.status_code == 500

def test_create_period_subscription_not_found(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=None)

    data = {
        "clientId": "client-1",
        "periodDate": "2024-10-01",
        "activeSubscriptionId": "sub-123",
        "status": "active"
    }

    response = client.post('/api/periods', json=data, headers=headers)
    assert response.status_code == 404
    assert response.get_data(as_text=True) == "Active subscription not found"

def test_update_period_subscription_not_found(client, mocker):
    headers = generate_headers()
    mock_period = MagicMock()
    mock_period.id = str(uuid.uuid4())

    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=mock_period)
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=None)

    data = {
        "status": "updated_status",
        "activeSubscriptionId": "sub-123"
    }

    response = client.put(f'/api/periods/{mock_period.id}', json=data, headers=headers)
    assert response.status_code == 404
    assert response.json == {"error": "Active subscription not found"}

def test_update_period_exception(client, mocker):
    headers = generate_headers()
    mock_period = MagicMock()
    mock_period.id = str(uuid.uuid4())
    
    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=mock_period)
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=MagicMock())
    mocker.patch('ServicioFacturacion.commands.period_update.UpdatePeriod.execute', side_effect=Exception("Database error"))

    data = {
        "status": "updated_status",
        "activeSubscriptionId": "sub-123"
    }

    response = client.put(f'/api/periods/{mock_period.id}', json=data, headers=headers)
    assert response.status_code == 500
    assert 'Failed to update period. Details: Database error' in response.json['error']

def test_create_period_update_existing_period(client, mocker):
    mock_period = MagicMock()
    mock_period.id = str(uuid.uuid4())
    mock_period.status = "active"
    mock_period.date = "2024-10-01"
    
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=True)
    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=mock_period)
    mock_update = mocker.patch('ServicioFacturacion.commands.period_update.UpdatePeriod.execute', return_value=mock_period)

    data = {
        "clientId": "client-1",
        "periodDate": "2024-10-01",
        "activeSubscriptionId": "sub-123",
        "status": "active"
    }

    response = client.post('/api/periods', json=data)

    assert response.status_code == 200
    assert response.json["id"] == mock_period.id
    assert mock_update.called

def test_update_period_value_error(client, mocker):
    mock_period = MagicMock()
    mock_period.id = str(uuid.uuid4())
    
    mocker.patch('ServicioFacturacion.commands.period_get.GetPeriod.execute', return_value=mock_period)
    
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', side_effect=ValueError("Invalid subscription"))

    data = {
        "status": "active",
        "activeSubscriptionId": "sub-123"
    }

    response = client.put(f'/api/periods/{mock_period.id}', json=data)

    assert response.status_code == 400
    assert response.json == {"error": "Invalid subscription"}