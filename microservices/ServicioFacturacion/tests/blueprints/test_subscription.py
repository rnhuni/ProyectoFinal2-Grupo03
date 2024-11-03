import pytest
import jwt
import uuid
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioFacturacion.blueprints.subscriptions.routes import subscriptions_bp  # Ajusta según tu estructura

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(subscriptions_bp, url_prefix='/api')
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

def test_get_active_all_subscriptions_success(client, mocker):
    mock_subscription = MagicMock()
    mock_subscription.id = str(uuid.uuid4())
    mock_subscription.base_name = "Basic Plan"
    mock_subscription.description = "A basic subscription"
    mock_subscription.status = "active"
    mock_subscription.price = 10.0
    mock_subscription.features = [
    ]

    mocker.patch('ServicioFacturacion.commands.active_subscription_get_all.GetAllSubscriptions.execute', return_value=[mock_subscription])

    response = client.get('/api/subscriptions/base')
    data = response.json

    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['name'] == "Basic Plan"

def test_get_active_all_subscriptions_success(client, mocker):
    mock_subscription = MagicMock()
    mock_subscription.id = str(uuid.uuid4())
    mock_subscription.base_name = "Basic Plan"
    mock_subscription.description = "A basic subscription"
    mock_subscription.status = "active"
    mock_subscription.price = 10.0
    mock_subscription.features = [
    ]

    mocker.patch('ServicioFacturacion.commands.active_subscription_get_all.GetAllSubscriptions.execute', return_value=[])

    response = client.get('/api/subscriptions/base')
    data = response.json

    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['name'] == "Basic Plan"

def test_get_active_all_subscriptions_success(client, mocker):
    mock_subscription = MagicMock()
    mock_subscription.id = str(uuid.uuid4())
    mock_subscription.base_name = "Basic Plan"
    mock_subscription.description = "A basic subscription"
    mock_subscription.status = "active"
    mock_subscription.price = 10.0
    mock_subscription.features = [
    ]

    mocker.patch('ServicioFacturacion.commands.active_subscription_get_all.GetAllSubscriptions.execute', return_value=[mock_subscription])

    response = client.get('/api/subscriptions/base')
    data = response.json

    assert response.status_code == 200
    assert len(data) == 1
    assert data[0]['name'] == "Basic Plan"


def test_get_active_subscription_success(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)

    mock_active_subscription = MagicMock()
    mock_active_subscription.id = str(uuid.uuid4())
    mock_active_subscription.base_id = "base_1"
    mock_active_subscription.base_name = "Premium Plan"
    mock_active_subscription.description = "A premium subscription"
    mock_active_subscription.status = "active"
    mock_active_subscription.price = 20.0
    mock_active_subscription.notify_by_email = True
    mock_active_subscription.features = []

    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=mock_active_subscription)

    response = client.get('/api/subscriptions/active', headers=headers)
    data = response.json

    assert response.status_code == 200
    assert data['baseName'] == "Premium Plan"

def test_get_active_subscription_unauthorized(client, mocker):
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=None)

    response = client.get('/api/subscriptions/active')
    data = response.json

    assert response.status_code == 500
    assert data == {'error': 'Failed to retrieve active subscriptions. Details: Invalid token format'}

def test_get_active_subscription_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', side_effect=Exception("Database error"))
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)

    headers = generate_headers()
    response = client.get('/api/subscriptions/active', headers=headers)

    assert response.status_code == 500

def test_get_subscriptions_history_success(client, mocker):
    response = client.get('/api/subscriptions/active/history')
    data = response.json

    assert response.status_code == 200
    assert isinstance(data, list)

def test_get_active_subscription_invalid_token_format(client):
    response = client.get('/api/subscriptions/active', headers={'Authorization': ''})
    assert response.status_code == 500

def test_get_active_subscription_no_active_found(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=None)

    response = client.get('/api/subscriptions/active', headers=headers)
    assert response.status_code == 404

def test_get_active_subscription_service_error(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', side_effect=Exception("Service unavailable"))

    response = client.get('/api/subscriptions/active', headers=headers)
    assert response.status_code == 500
    assert 'Failed to retrieve active subscriptions. Details: Service unavailable' in response.json['error']

def test_get_active_all_subscriptions_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.active_subscription_get_all.GetAllSubscriptions.execute', side_effect=Exception("Service error"))

    response = client.get('/api/subscriptions/base')
    data = response.json

    assert response.status_code == 500

def test_get_active_subscription_client_id_not_found(client, mocker):
    headers = generate_headers()
    mock_user = {"client": None}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)

    response = client.get('/api/subscriptions/active', headers=headers)
    data = response.json

    assert response.status_code == 500

def test_create_active_subscription_failed(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)

    mock_base_subscription = MagicMock()
    mock_base_subscription.id = "base_1"
    mock_base_subscription.name = "Premium Plan"
    mock_base_subscription.description = "A premium subscription"

    mock_features = [
        {"id": "feature_1", "feature_id": "feature_1", "feature_name": "Feature 1", "feature_price": 5.0},
        {"id": "feature_2", "feature_id": "feature_2", "feature_name": "Feature 2", "feature_price": 10.0}
    ]

    mock_active_subscription = MagicMock()
    mock_active_subscription.id = str(uuid.uuid4())
    mock_active_subscription.base_id = mock_base_subscription.id
    mock_active_subscription.base_name = mock_base_subscription.name
    mock_active_subscription.description = mock_base_subscription.description
    mock_active_subscription.notify_by_email = True
    mock_active_subscription.price = 15.0
    mock_active_subscription.features = mock_features

    mocker.patch('ServicioFacturacion.services.system_service.SystemService.get_subscription', return_value=mock_base_subscription)
    mocker.patch('ServicioFacturacion.services.system_service.SystemService.get_features', return_value=mock_features)
    mocker.patch('ServicioFacturacion.commands.active_subscription_get.GetActiveSubscription.execute', return_value=None)
    mocker.patch('ServicioFacturacion.commands.active_subscription_create.CreateActiveSubscription.execute', return_value=mock_active_subscription)

    response = client.post('/api/subscriptions/active', json={
        "subscriptionBaseId": "base_1",
        "features": ["feature_1", "feature_2"],
        "notifyByEmail": True
    }, headers=headers)

    assert response.status_code == 500

def test_create_active_subscription_unauthorized(client, mocker):
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=None)

    response = client.post('/api/subscriptions/active', json={})

    assert response.status_code == 500

def test_create_active_subscription_client_id_not_found(client, mocker):
    headers = generate_headers()
    mock_user = {"client": None}  # Simula que no hay client_id
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)

    response = client.post('/api/subscriptions/active', json={})

    assert response.status_code == 500

def test_create_active_subscription_invalid_params(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)

    response = client.post('/api/subscriptions/active', json={"subscriptionBaseId": "base_1"})

    assert response.status_code == 500

def test_create_active_subscription_base_not_found(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)

    mocker.patch('ServicioFacturacion.services.system_service.SystemService.get_subscription', return_value=None)

    response = client.post('/api/subscriptions/active', json={
        "subscriptionBaseId": "base_1",
        "features": ["feature_1"]
    }, headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Base subscription not found"}

def test_create_active_subscription_exception(client, mocker):
    headers = generate_headers()
    mock_user = {"client": "client-1"}
    mocker.patch('ServicioFacturacion.utils.decode_user', return_value=mock_user)

    mocker.patch('ServicioFacturacion.services.system_service.SystemService.get_subscription', side_effect=Exception("Service error"))

    response = client.post('/api/subscriptions/active', json={
        "subscriptionBaseId": "base_1",
        "features": ["feature_1"]
    }, headers=headers)

    assert response.status_code == 500
    assert 'Create active subscription failed. Details: Service error' in response.json['error']




