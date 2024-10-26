import pytest
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.roles.routes import roles_bp
from ServicioSistema.commands.role_create import CreateRole
from ServicioSistema.commands.role_exists import ExistsRole
from ServicioSistema.commands.role_get import GetRole
from ServicioSistema.commands.role_get_all import GetAllRoles
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
    
    mock_role = MagicMock()
    mock_role.id = "role-id"
    mock_role.name = "Admin"
    mock_role.createdAt = "2024-01-01"
    mock_role.updatedAt = "2024-01-01"

    mocker.patch('ServicioSistema.commands.role_create.CreateRole.execute', return_value=mock_role)
    mocker.patch('ServicioSistema.utils.build_role_id', return_value="role-id")

    json_data = {
        "name": "Admin2",
        "permissions": [
            {"id": "permission-1", "actions": ["read", "write"]},
            {"id": "permission-2", "actions": ["read"]}
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
        "name": "Admin2",
        "permissions": [
            {"id": "invalid-permission", "actions": ["read"]}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Permission 'invalid-permission' does not exist"

def test_create_role_permission_missing_actions(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)

    json_data = {
        "name": "Admin2",
        "permissions": [
            {"id": "permission-1", "actions": []}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Permission 'permission-1' does not have accessLevel list values"

def test_create_role_missing_permissions(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)

    json_data = {
        "name": "Admin2",
        "permissions": []
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"permissions is required"

def test_create_role_invalid_name(client):
    json_data = {
        "name": "",
        "permissions": [
            {"id": "permission-1", "actions": ["read", "write"]}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Name is required"

def test_create_role_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', side_effect=Exception("Some internal error"))

    json_data = {
        "name": "Admin2",
        "permissions": [
            {"id": "permission-1", "actions": ["read", "write"]}
        ]
    }

    response = client.post('/api/roles', json=json_data)

    assert response.status_code == 500
    assert "Create role failed" in response.json['error']

def test_get_role_success(client, mocker):
    mock_role = MagicMock()
    mock_role.id = "role-id"
    mock_role.name = "Admin"
    mock_role.createdAt = "2024-01-01"
    mock_role.updatedAt = "2024-01-01"

    mock_permission_1 = MagicMock()
    mock_permission_1.permission.id = "permission-1"
    mock_permission_1.permission.name = "Permission 1"
    mock_permission_1.permission.resource = "Service 1"
    mock_permission_1.action = "read"

    mock_permission_2 = MagicMock()
    mock_permission_2.permission.id = "permission-2"
    mock_permission_2.permission.name = "Permission 2"
    mock_permission_2.permission.resource = "Service 2"
    mock_permission_2.action = "write"

    mock_role.permissions = [mock_permission_1, mock_permission_2]

    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=mock_role)

    response = client.get('/api/roles/role-id')

    assert response.status_code == 200
    assert response.json == {
        "id": "role-id",
        "name": "Admin",
        "permissions": [
            {
                "id": "permission-1",
                "actions": ["read"]
            },
            {
                "id": "permission-2",
                "actions": ["write"]
            }
        ],
        "createdAt": "2024-01-01",
        "updatedAt": "2024-01-01"
    }

def test_get_role_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=None)

    response = client.get('/api/roles/invalid-id')

    assert response.status_code == 404
    assert response.data == b"Role not found"

def test_get_role_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', side_effect=Exception("Some internal error"))

    response = client.get('/api/roles/role-id')

    assert response.status_code == 500
    assert "Error retrieving role" in response.json['error']

def test_get_all_roles_success(client, mocker):
    mock_role_1 = MagicMock()
    mock_role_1.id = "role-1"
    mock_role_1.name = "Admin"
    mock_role_1.createdAt = "2024-01-01"
    mock_role_1.updatedAt = "2024-01-01"

    mock_permission_1 = MagicMock()
    mock_permission_1.permission.id = "permission-1"
    mock_permission_1.permission.name = "Permission 1"
    mock_permission_1.permission.resource = "Service 1"
    mock_permission_1.action = "read"

    mock_role_1.permissions = [mock_permission_1]

    mock_role_2 = MagicMock()
    mock_role_2.id = "role-2"
    mock_role_2.name = "Editor"
    mock_role_2.createdAt = "2024-01-01"
    mock_role_2.updatedAt = "2024-01-01"

    mock_permission_2 = MagicMock()
    mock_permission_2.permission.id = "permission-2"
    mock_permission_2.permission.name = "Permission 2"
    mock_permission_2.permission.resource = "Service 2"
    mock_permission_2.action = "write"

    mock_role_2.permissions = [mock_permission_2]

    mocker.patch('ServicioSistema.commands.role_get_all.GetAllRoles.execute', return_value=[mock_role_1, mock_role_2])

    response = client.get('/api/roles')

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "role-1",
            "name": "Admin",
            "permissions": [
                {
                    "id": "permission-1",
                    "actions": ["read"]
                }
            ],
            "createdAt": "2024-01-01",
            "updatedAt": "2024-01-01"
        },
        {
            "id": "role-2",
            "name": "Editor",
            "permissions": [
                {
                    "id": "permission-2",
                    "actions": ["write"]
                }
            ],
            "createdAt": "2024-01-01",
            "updatedAt": "2024-01-01"
        }
    ]

def test_get_all_roles_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.role_get_all.GetAllRoles.execute', side_effect=Exception("Some internal error"))

    response = client.get('/api/roles')

    assert response.status_code == 500
    assert "Error retrieving roles" in response.json['error']

def test_update_role_success(client, mocker):
    # Mock para verificar si el rol existe
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock(id="role-name-3", name="Role name 3"))

    # Mock para verificar si el nuevo nombre de rol ya existe
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)

    # Mock para validar que los permisos existen
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=True)

    # Mock para actualizar el rol
    mock_updated_role = MagicMock()
    mock_updated_role.id = "role-name-3"
    mock_updated_role.name = "Updated Role Name 3"
    mock_updated_role.updatedAt = "2024-10-19"
    
    mocker.patch('ServicioSistema.commands.role_update.UpdateRole.execute', return_value=mock_updated_role)

    # Datos para la solicitud PUT
    json_data = {
        "name": "Updated Role Name 3",
        "permissions": [
            {"id": "pem-incidents-service-levels", "actions": ["read", "write"]},
            {"id": "pem-incidents-permission-name", "actions": ["read", "update"]}
        ]
    }

    # Realizar la solicitud PUT
    response = client.put('/api/roles/role-name-3', json=json_data)

    # Verificar el código de estado y los datos devueltos
    assert response.status_code == 200
    assert response.json == {
        "id": "role-name-3",
        "name": "Updated Role Name 3",
        "permissions": json_data["permissions"],
        "updatedAt": "2024-10-19"
    }

def test_update_role_not_found(client, mocker):
    # Mock para simular que el rol no existe
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=None)

    # Datos para la solicitud PUT
    json_data = {
        "name": "Updated Role Name 3",
        "permissions": [
            {"id": "pem-incidents-service-levels", "actions": ["read", "write"]}
        ]
    }

    # Realizar la solicitud PUT
    response = client.put('/api/roles/non-existent-role', json=json_data)

    # Verificar el código de estado y el mensaje devuelto
    assert response.status_code == 404
    assert response.data == b"Role not found"

def test_update_role_permission_not_exist(client, mocker):
    # Mock para simular que el rol existe
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock(id="role-name-3", name="Role name 3"))

    # Mock para verificar si el nuevo nombre de rol ya existe
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)

    # Mock para simular que los permisos no existen
    mocker.patch('ServicioSistema.commands.permission_exists.ExistsPermission.execute', return_value=False)

    # Datos para la solicitud PUT
    json_data = {
        "name": "Updated Role Name 3",
        "permissions": [
            {"id": "invalid-permission", "actions": ["read"]}
        ]
    }

    # Realizar la solicitud PUT
    response = client.put('/api/roles/role-name-3', json=json_data)

    # Verificar el código de estado y el mensaje devuelto
    assert response.status_code == 400
    assert response.data == b"Permission 'invalid-permission' does not exist"

def test_update_role_internal_error(client, mocker):
    # Mock para simular un error interno
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', side_effect=Exception("Some internal error"))

    # Datos para la solicitud PUT
    json_data = {
        "name": "Updated Role Name 3",
        "permissions": [
            {"id": "pem-incidents-service-levels", "actions": ["read", "write"]}
        ]
    }

    # Realizar la solicitud PUT
    response = client.put('/api/roles/role-name-3', json=json_data)

    # Verificar el código de estado y el mensaje devuelto
    assert response.status_code == 500
    assert "Update role failed" in response.json['error']

def test_edit_role_name_required(client, mocker):
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=True)  # Simula que el rol existe
    
    # Simula que el nuevo nombre está vacío
    json_data = {
        "name": "",
        "permissions": [
            {"id": "permission-1", "actions": ["read", "write"]}
        ]
    }

    response = client.put('/api/roles/role-id', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Name is required"

def test_edit_role_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=None)  # Simula que el rol no existe

    json_data = {
        "name": "New Role Name",
        "permissions": [
            {"id": "permission-1", "actions": ["read", "write"]}
        ]
    }

    response = client.put('/api/roles/role-id', json=json_data)

    assert response.status_code == 404
    assert response.data == b"Role not found"


def test_edit_role_name_exists(client, mocker):
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=True)  # Simula que el rol existe
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)  # Simula que el nombre ya existe

    json_data = {
        "name": "Existing Role Name",
        "permissions": [
            {"id": "permission-1", "actions": ["read", "write"]}
        ]
    }

    response = client.put('/api/roles/role-id', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Role with this name already exists"