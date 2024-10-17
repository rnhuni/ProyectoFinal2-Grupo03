import pytest
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.roles.routes import roles_bp
from ServicioSistema.commands.role_create import CreateRole
from ServicioSistema.commands.role_exists import ExistsRole
from ServicioSistema.commands.permission_exists import ExistsPermission
from ServicioSistema.utils import build_role_id

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(roles_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_role_success(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)
    
    # Crear un mock que simula un objeto serializable
    mock_role = MagicMock()
    mock_role.id = "role-id"
    mock_role.name = "Admin"
    mock_role.createdAt = "2024-01-01"
    mock_role.updatedAt = "2024-01-01"

    mocker.patch('ServicioSistema.commands.role_create.CreateRole.execute', return_value=mock_role)
    mocker.patch('ServicioSistema.utils.build_role_id', return_value="role-id")

    json_data = {
        "name": "Admin",
        "permissions": [
            {"id": "permission-1", "scopes": ["read", "write"]},
            {"id": "permission-2", "scopes": ["read"]}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 201
    assert response.json == {
        "id": "role-id",
        "name": "Admin",
        "createdAt": "2024-01-01",
        "updatedAt": "2024-01-01"
    }

def test_create_role_already_exists(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)

    json_data = {
        "name": "Admin",
        "permissions": []
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Role already exists"

def test_create_role_permission_not_exist(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=False)

    json_data = {
        "name": "Admin",
        "permissions": [
            {"id": "invalid-permission", "scopes": ["read"]}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Permission 'invalid-permission' does not exist"

def test_create_role_permission_missing_scopes(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)

    json_data = {
        "name": "Admin",
        "permissions": [
            {"id": "permission-1", "scopes": []}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Permission 'permission-1' does not have accessLevel list values"

def test_create_role_missing_permissions(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)

    json_data = {
        "name": "Admin",
        "permissions": []
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"permissions is required"

def test_create_role_invalid_name(client):
    json_data = {
        "name": "",
        "permissions": [
            {"id": "permission-1", "scopes": ["read", "write"]}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Name is required"

def test_create_role_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', side_effect=Exception("Some internal error"))

    json_data = {
        "name": "Admin",
        "permissions": [
            {"id": "permission-1", "scopes": ["read", "write"]}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 500
    assert "Create permission failed" in response.json['error']
