
import pytest
from flask import Flask
from unittest.mock import patch, MagicMock
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
    mock_client.createdAt = "2024-01-01T00:00:00Z"
    mock_client.updatedAt = "2024-01-02T00:00:00Z"

    mocker.patch('ServicioSistema.commands.client_get_all.GetAllClients.execute', return_value=[mock_client])

    response = client.get('/api/clients')

    assert response.status_code == 200
    assert response.json == [{
        "id": "client-1",
        "name": "Client 1",
        "description": "Description for Client 1",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z"
    }]

def test_get_all_clients_error(client, mocker):
    mocker.patch('ServicioSistema.commands.client_get_all.GetAllClients.execute', side_effect=Exception("Database error"))

    response = client.get('/api/clients')

    assert response.status_code == 500
    assert "Error retrieving clients" in response.json['error']
