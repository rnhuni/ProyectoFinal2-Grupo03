import pytest
from flask import Flask, jsonify
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.permissions.routes import permissions_bp
from ServicioSistema.commands.permission_create import CreatePermission
from ServicioSistema.commands.permission_exists import ExistsPermission
from ServicioSistema.utils import build_permission_id

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(permissions_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_permission_success(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=False)

    mock_permission = MagicMock()
    mock_permission.id = "permission-id"
    mock_permission.name = "Test"
    mock_permission.service = "TestService"
    mock_permission.createdAt = "2024-01-01"
    mock_permission.updatedAt = "2024-01-01"

    mocker.patch('ServicioSistema.commands.permission_create.CreatePermission.execute', return_value=mock_permission)
    mocker.patch('ServicioSistema.utils.build_permission_id', return_value="permission-id")

    json_data = {
        "name": "Test",
        "service": "TestService",
        "description": "Permission description"
    }

    response = client.post('/api/permissions', json=json_data)

    assert response.status_code == 201
    assert response.json == {
        "id": "permission-id",
        "name": "Test",
        "service": "TestService",
        "createdAt": "2024-01-01",
        "updatedAt": "2024-01-01"
    }

def test_create_permission_already_exists(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)

    json_data = {
        "name": "Test",
        "service": "TestService",
        "description": "Permission description"
    }

    response = client.post('/api/permissions', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Already exists"

def test_create_permission_invalid_parameters(client):
    json_data = {
        "name": "",
        "service": "TestService",
        "description": "Permission description"
    }

    response = client.post('/api/permissions', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Invalid parameters"

def test_create_permission_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', side_effect=Exception("Some internal error"))

    json_data = {
        "name": "Test",
        "service": "TestService",
        "description": "Permission description"
    }

    response = client.post('/api/permissions', json=json_data)

    assert response.status_code == 500
    assert "Create permission failed" in response.json['error']
