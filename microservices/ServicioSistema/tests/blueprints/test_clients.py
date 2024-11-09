import pytest
from flask import Flask, json
from unittest.mock import MagicMock
from datetime import datetime
from ServicioSistema.blueprints.clients.routes import clients_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(clients_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_get_all_clients_success(client, mocker):
    mock_client = MagicMock()
    mock_client.id = "client-1"
    mock_client.name = "Client 1"
    mock_client.description = "Description for Client 1"
    mock_client.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_client.updatedAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_client.active_subscription_plan = MagicMock()
    mock_client.active_subscription_plan.id = "sub-123"
    mock_client.active_subscription_plan.name = "Premium"

    mocker.patch('ServicioSistema.commands.client_get_all.GetAllClients.execute', return_value=[mock_client])

    response = client.get('/api/clients')

    assert response.status_code == 200
    assert response.json == [{
        "id": "client-1",
        "name": "Client 1",
        "subscription_plan": {
            "id": "sub-123",
            "name": "Premium"
        },
        "description": "Description for Client 1",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }]

def test_get_all_clients_error(client, mocker):
    mocker.patch('ServicioSistema.commands.client_get_all.GetAllClients.execute', side_effect=Exception("Database error"))

    response = client.get('/api/clients')

    assert response.status_code == 500
    assert "Error retrieving clients" in response.json['error']

def test_update_client_success(client, mocker):
    mock_client = MagicMock()
    mock_client.id = "client-1"
    mock_client.name = "Client 1"
    mock_client.description = "Updated description"
    mock_client.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_client.updatedAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_client.active_subscription_plan = MagicMock()
    mock_client.active_subscription_plan.id = "sub-456"
    mock_client.active_subscription_plan.name = "Standard"

    mocker.patch('ServicioSistema.commands.client_update.UpdateClient.execute', return_value=mock_client)
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=True)

    response = client.put('/api/clients/client-1', json={"subscription_id": "sub-456"})

    assert response.status_code == 200
    assert response.json == {
        "id": "client-1",
        "name": "Client 1",
        "description": "Updated description",
        "subscription_plan": {
            "id": "sub-456",
            "name": "Standard"
        },
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_update_client_missing_parameters(client):
    response = client.put('/api/clients/client-1', json={})
    assert response.status_code == 500

def test_update_client_subscription_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)

    response = client.put('/api/clients/client-1', json={"subscription_id": "invalid-id"})

    assert response.status_code == 404
    assert response.data.decode('utf-8') == "Subscription plan not found"

def test_update_client_error(client, mocker):
    mocker.patch('ServicioSistema.commands.client_update.UpdateClient.execute', side_effect=Exception("Update failed"))
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=True)

    response = client.put('/api/clients/client-1', json={"subscription_id": "sub-456"})

    assert response.status_code == 500
    assert "Update Client failed" in response.json['error']
