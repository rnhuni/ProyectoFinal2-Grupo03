import pytest
from flask import Flask, jsonify
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.permissions.routes import permissions_bp
from ServicioSistema.commands.permission_create import CreatePermission
from ServicioSistema.commands.permission_exists import ExistsPermission
from ServicioSistema.commands.permission_get import GetPermission
from ServicioSistema.commands.permission_get_all import GetAllPermissions
from ServicioSistema.utils import build_permission_id
from datetime import datetime

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
    mock_permission.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_permission.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

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
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
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
    mock_permission.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_permission.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.permission_get.GetPermission.execute', return_value=mock_permission)

    response = client.get('/api/permissions/permission-id')

    assert response.status_code == 200
    assert response.json == {
        "id": "permission-id",
        "name": "Test",
        "resource": "TestService",
        "description": "Permission description",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
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
    mock_permission1.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_permission1.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mock_permission2 = MagicMock()
    mock_permission2.id = "permission-id-2"
    mock_permission2.name = "Test 2"
    mock_permission2.resource = "TestService"
    mock_permission2.description = "Permission description 2"
    mock_permission2.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_permission2.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.permission_get_all.GetAllPermissions.execute', return_value=[mock_permission1, mock_permission2])

    response = client.get('/api/permissions')

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "permission-id-1",
            "name": "Test 1",
            "resource": "TestService",
            "description": "Permission description 1",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00"
        },
        {
            "id": "permission-id-2",
            "name": "Test 2",
            "resource": "TestService",
            "description": "Permission description 2",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00"
        }
    ]

def test_get_all_permissions_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.permission_get_all.GetAllPermissions.execute', side_effect=Exception("Some internal error"))

    response = client.get('/api/permissions')

    assert response.status_code == 500
    assert "Error retrieving permissions" in response.json['error']

def test_edit_permission_success(client, mocker):
    
    mock_permission = MagicMock()
    mock_permission.id = "permission-id"
    mock_permission.name = "Test"
    mock_permission.resource = "TestService"
    mock_permission.description = "Permission description"
    mock_permission.updatedAt = datetime(2024, 1, 1, 0, 0, 0)
    
    mocker.patch('ServicioSistema.commands.permission_get.GetPermission.execute', return_value=mock_permission)
    mocker.patch('ServicioSistema.utils.build_permission_id', return_value="new-permission-id")
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=False)
        
    updated_permission = MagicMock()
    updated_permission.id = "new-permission-id"
    updated_permission.name = "Updated Test"
    updated_permission.resource = "UpdatedTestService"
    updated_permission.description = "Updated description"
    updated_permission.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.permission_update.UpdatePermission.execute', return_value=updated_permission)
    
    json_data = {
        "name": "Updated Test",
        "resource": "UpdatedTestService",
        "description": "Updated description"
    }

    response = client.put('/api/permissions/permission-id', json=json_data)
    
    assert response.status_code == 200
    assert response.json == {
        "id": "new-permission-id",
        "name": "Updated Test",
        "resource": "UpdatedTestService",
        "description": "Updated description",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_edit_permission_not_found(client, mocker):
    
    mocker.patch('ServicioSistema.commands.permission_get.GetPermission.execute', return_value=None)
    
    json_data = {
        "name": "Updated Test",
        "resource": "UpdatedTestService",
        "description": "Updated description"
    }

    response = client.put('/api/permissions/nonexistent-id', json=json_data)
    
    assert response.status_code == 404
    assert response.data == b"Permission not found"

def test_edit_permission_invalid_parameters(client):
    
    json_data = {
        "name": "",
        "resource": "UpdatedTestService",
        "description": "Updated description"
    }

    response = client.put('/api/permissions/permission-id', json=json_data)
    
    assert response.status_code == 400
    assert response.data == b"Invalid parameters"

def test_edit_permission_duplicate_id(client, mocker):
    
    mock_permission = MagicMock()
    mock_permission.id = "permission-id"
    mock_permission.name = "Test"
    mock_permission.resource = "TestService"
    mock_permission.description = "Permission description"
        
    mocker.patch('ServicioSistema.commands.permission_get.GetPermission.execute', return_value=mock_permission)   
    
    mocker.patch('ServicioSistema.utils.build_permission_id', return_value="duplicate-id")
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)

    json_data = {
        "name": "Duplicate Test",
        "resource": "DuplicateTestService",
        "description": "Updated description"
    }

    response = client.put('/api/permissions/permission-id', json=json_data)
    
    assert response.status_code == 400
    assert response.data == b"Permission with this name and resource already exists"

def test_edit_permission_internal_error(client, mocker):
    
    mocker.patch('ServicioSistema.commands.permission_get.GetPermission.execute', side_effect=Exception("Some internal error"))
    
    json_data = {
        "name": "Updated Test",
        "resource": "UpdatedTestService",
        "description": "Updated description"
    }

    response = client.put('/api/permissions/permission-id', json=json_data)
    
    assert response.status_code == 500
    assert "Update permission failed" in response.json['error']