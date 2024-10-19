import pytest
from flask import Flask, jsonify
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.permissions.routes import permissions_bp
from ServicioSistema.commands.permission_create import CreatePermission
from ServicioSistema.commands.permission_exists import ExistsPermission
from ServicioSistema.commands.permission_get import GetPermission
from ServicioSistema.commands.permission_get_all import GetAllPermissions
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
    mock_permission.resource = "TestService"
    mock_permission.createdAt = "2024-01-01"
    mock_permission.updatedAt = "2024-01-01"

    mocker.patch('ServicioSistema.commands.permission_create.CreatePermission.execute', return_value=mock_permission)
    mocker.patch('ServicioSistema.utils.build_permission_id', return_value="permission-id")

    json_data = {
        "name": "Test",
        "resource": "TestService",
        "description": "Permission description"
    }

    response = client.post('/api/permissions', json=json_data)

    assert response.status_code == 201
    assert response.json == {
        "id": "permission-id",
        "name": "Test",
        "resource": "TestService",
        "createdAt": "2024-01-01",
        "updatedAt": "2024-01-01"
    }

def test_create_permission_already_exists(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)

    json_data = {
        "name": "Test",
        "resource": "TestService",
        "description": "Permission description"
    }

    response = client.post('/api/permissions', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Already exists"

def test_create_permission_invalid_parameters(client):
    json_data = {
        "name": "",
        "resource": "TestService",
        "description": "Permission description"
    }

    response = client.post('/api/permissions', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Invalid parameters"

def test_create_permission_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', side_effect=Exception("Some internal error"))

    json_data = {
        "name": "Test",
        "resource": "TestService",
        "description": "Permission description"
    }

    response = client.post('/api/permissions', json=json_data)

    assert response.status_code == 500
    assert "Create permission failed" in response.json['error']

def test_get_permission_success(client, mocker):
    mock_permission = MagicMock()
    mock_permission.id = "permission-id"
    mock_permission.name = "Test"
    mock_permission.resource = "TestService"
    mock_permission.description = "Permission description"
    mock_permission.createdAt = "2024-01-01"
    mock_permission.updatedAt = "2024-01-01"

    mocker.patch('ServicioSistema.commands.permission_get.GetPermission.execute', return_value=mock_permission)

    response = client.get('/api/permissions/permission-id')

    assert response.status_code == 200
    assert response.json == {
        "id": "permission-id",
        "name": "Test",
        "resource": "TestService",
        "description": "Permission description",
        "createdAt": "2024-01-01",
        "updatedAt": "2024-01-01"
    }

def test_get_permission_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_get.GetPermission.execute', return_value=None)

    response = client.get('/api/permissions/invalid-id')

    assert response.status_code == 404
    assert response.data == b"Permission does not exist"

def test_get_permission_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_get.GetPermission.execute', side_effect=Exception("Some internal error"))

    response = client.get('/api/permissions/permission-id')

    assert response.status_code == 500
    assert "Error retrieving permission" in response.json['error']

def test_get_all_permissions_success(client, mocker):
    mock_permission1 = MagicMock()
    mock_permission1.id = "permission-id-1"
    mock_permission1.name = "Test 1"
    mock_permission1.resource = "TestService"
    mock_permission1.description = "Permission description 1"
    mock_permission1.createdAt = "2024-01-01"
    mock_permission1.updatedAt = "2024-01-01"

    mock_permission2 = MagicMock()
    mock_permission2.id = "permission-id-2"
    mock_permission2.name = "Test 2"
    mock_permission2.resource = "TestService"
    mock_permission2.description = "Permission description 2"
    mock_permission2.createdAt = "2024-01-01"
    mock_permission2.updatedAt = "2024-01-01"

    mocker.patch('ServicioSistema.commands.permission_get_all.GetAllPermissions.execute', return_value=[mock_permission1, mock_permission2])

    response = client.get('/api/permissions')

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "permission-id-1",
            "name": "Test 1",
            "resource": "TestService",
            "description": "Permission description 1",
            "createdAt": "2024-01-01",
            "updatedAt": "2024-01-01"
        },
        {
            "id": "permission-id-2",
            "name": "Test 2",
            "resource": "TestService",
            "description": "Permission description 2",
            "createdAt": "2024-01-01",
            "updatedAt": "2024-01-01"
        }
    ]

def test_get_all_permissions_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_get_all.GetAllPermissions.execute', side_effect=Exception("Some internal error"))

    response = client.get('/api/permissions')

    assert response.status_code == 500
    assert "Error retrieving permissions" in response.json['error']
