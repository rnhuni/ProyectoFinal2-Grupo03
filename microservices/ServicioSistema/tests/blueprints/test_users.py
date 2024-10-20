import pytest
import uuid
from flask import Flask, jsonify
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.users.routes import users_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(users_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_user_success(client, mocker):
    """Prueba para cubrir la creación exitosa del usuario y la respuesta JSON"""
    
    # Mockear que el email no está en uso
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    
    # Mockear que el rol existe
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock(id='role-1'))
    
    # Mockear que el cliente existe
    mocker.patch('ServicioSistema.commands.client_exists.ExistsClient.execute', return_value=True)
    
    # Mockear la creación del usuario
    mock_user = MagicMock()
    mock_user.id = "user-1"
    mock_user.name = "Test User"
    mock_user.email = "testuser@example.com"
    mock_user.role_id = "role-1"
    mock_user.status = "active"
    mock_user.client_id = "client-1"
    mock_user.createdAt = "2024-01-01T00:00:00Z"
    mock_user.updatedAt = "2024-01-02T00:00:00Z"
    
    mocker.patch('ServicioSistema.commands.user_create.CreateUser.execute', return_value=mock_user)

    # Datos de entrada válidos
    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    # Ejecutar la solicitud POST
    response = client.post('/api/users', json=json_data)

    # Verificar que la respuesta es 201 y los datos del usuario están en la respuesta
    assert response.status_code == 201
    assert response.json == {
        "id": "user-1",
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "status": "active",
        "client_id": "client-1",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z"
    }

def test_create_user_email_already_in_use(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=True)

    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Email is already in use"

def test_create_user_role_not_exist(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=False)

    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Role 'role-1' does not exist"

def test_create_user_client_not_exist(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=True)
    mocker.patch('ServicioSistema.commands.client_exists.ExistsClient.execute', return_value=False)

    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Client 'client-1' does not exist"

def test_create_user_missing_parameters(client):
    json_data = {
        "name": "",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Name is required"

def test_create_user_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', side_effect=Exception("Internal Error"))

    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 500
    assert "Create user failed" in response.json['error']

def test_create_user_missing_email(client):
    json_data = {
        "name": "Test User",
        "email": "",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Email is required"

def test_create_user_missing_role_id(client):
    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "",  # Role ID vacío
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Role ID is required"

def test_create_user_missing_client_id(client):
    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": ""
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Client ID is required"

def test_get_user_success(client, mocker):
    mock_user = MagicMock()
    mock_user.id = uuid.uuid4()
    mock_user.name = "Test User"
    mock_user.email = "testuser@example.com"
    mock_user.cognito_id = "cognito-12345"
    mock_user.role_id = "role-1"
    mock_user.role.name = "Admin"
    mock_user.client_id = uuid.uuid4()
    mock_user.client.name = "Test Client"
    mock_user.createdAt = "2024-01-01T00:00:00Z"
    mock_user.updatedAt = "2024-01-02T00:00:00Z"

    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)

    response = client.get(f'/api/users/{mock_user.id}')

    assert response.status_code == 200
    assert response.json == {
        "id": str(mock_user.id),
        "name": "Test User",
        "email": "testuser@example.com",
        "cognito_id": "cognito-12345",
        "role_id": "role-1",
        "role_name": "Admin",
        "client_id": str(mock_user.client_id),
        "client_name": "Test Client",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-02T00:00:00Z"
    }

def test_get_user_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=None)

    response = client.get('/api/users/nonexistent-user')

    assert response.status_code == 404
    assert response.data == b"User not found"

def test_get_user_internal_error(client, mocker):

    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', side_effect=Exception("Database error"))

    response = client.get('/api/users/user-1')

    assert response.status_code == 500
    assert "Failed to retrieve user" in response.json['error']

def test_get_all_users_success(client, mocker):
    mock_user1 = MagicMock()
    mock_user1.id = uuid.uuid4()
    mock_user1.name = "Test User 1"
    mock_user1.email = "testuser1@example.com"
    mock_user1.cognito_id = "cognito-12345"
    mock_user1.role_id = "role-1"
    mock_user1.role.name = "Admin"
    mock_user1.client_id = uuid.uuid4()
    mock_user1.client.name = "Test Client 1"
    mock_user1.createdAt = "2024-01-01T00:00:00Z"
    mock_user1.updatedAt = "2024-01-02T00:00:00Z"

    mock_user2 = MagicMock()
    mock_user2.id = uuid.uuid4()
    mock_user2.name = "Test User 2"
    mock_user2.email = "testuser2@example.com"
    mock_user2.cognito_id = "cognito-67890"
    mock_user2.role_id = "role-2"
    mock_user2.role.name = "User"
    mock_user2.client_id = uuid.uuid4()
    mock_user2.client.name = "Test Client 2"
    mock_user2.createdAt = "2024-02-01T00:00:00Z"
    mock_user2.updatedAt = "2024-02-02T00:00:00Z"

    mocker.patch('ServicioSistema.commands.user_get_all.GetAllUsers.execute', return_value=[mock_user1, mock_user2])

    response = client.get('/api/users')

    assert response.status_code == 200
    assert response.json == [
        {
            "id": str(mock_user1.id),
            "name": "Test User 1",
            "email": "testuser1@example.com",
            "cognito_id": "cognito-12345",
            "role_id": "role-1",
            "role_name": "Admin",
            "client_id": str(mock_user1.client_id),
            "client_name": "Test Client 1",
            "createdAt": "2024-01-01T00:00:00Z",
            "updatedAt": "2024-01-02T00:00:00Z"
        },
        {
            "id": str(mock_user2.id),
            "name": "Test User 2",
            "email": "testuser2@example.com",
            "cognito_id": "cognito-67890",
            "role_id": "role-2",
            "role_name": "User",
            "client_id": str(mock_user2.client_id),
            "client_name": "Test Client 2",
            "createdAt": "2024-02-01T00:00:00Z",
            "updatedAt": "2024-02-02T00:00:00Z"
        }
    ]

def test_get_all_users_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get_all.GetAllUsers.execute', side_effect=Exception("Database error"))

    response = client.get('/api/users')

    assert response.status_code == 500
    assert "Failed to retrieve users" in response.json['error']

def test_edit_user_success(client, mocker):
    mock_user = MagicMock()
    mock_user.id = uuid.uuid4()
    mock_user.name = "Test User"
    mock_user.email = "testuser@example.com"
    mock_user.cognito_id = "cognito-12345"
    mock_user.role_id = "role-1"
    mock_user.client_id = uuid.uuid4()
    mock_user.createdAt = "2024-01-01T00:00:00Z"
    mock_user.updatedAt = "2024-01-02T00:00:00Z"

    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)

    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)

    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock(id='role-1'))

    mocker.patch('ServicioSistema.commands.client_exists.ExistsClient.execute', return_value=True)

    mock_updated_user = MagicMock()
    mock_updated_user.id = str(mock_user.id)
    mock_updated_user.name = "Updated Name"
    mock_updated_user.email = "updatedemail@example.com"
    mock_updated_user.cognito_id = "cognito-12345"
    mock_updated_user.role_id = "role-1"
    mock_updated_user.client_id = str(mock_user.client_id)
    mock_updated_user.createdAt = mock_user.createdAt
    mock_updated_user.updatedAt = "2024-01-02T00:00:00Z"

    mocker.patch('ServicioSistema.commands.user_update.UpdateUser.execute', return_value=mock_updated_user)

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "role-1",
        "client_id": str(mock_user.client_id)
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 200
    assert response.json == {
        "id": str(mock_user.id),
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "cognito_id": "cognito-12345",
        "role_id": "role-1",
        "client_id": str(mock_user.client_id),
        "createdAt": mock_user.createdAt,
        "updatedAt": "2024-01-02T00:00:00Z"
    }

def test_edit_user_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=None)

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "role-1",
        "client_id": str(uuid.uuid4())
    }

    response = client.put('/api/users/nonexistent-user', json=json_data)
    
    assert response.status_code == 404
    assert response.data == b"User with id 'nonexistent-user' not found"

def test_edit_user_email_in_use(client, mocker):
    mock_user = MagicMock(id="user-id")
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=True)

    json_data = {
        "name": "Updated Name",
        "email": "existingemail@example.com",
        "role_id": "role-1",
        "client_id": str(uuid.uuid4())
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Email is already in use"

def test_edit_user_role_not_found(client, mocker):
    mock_user = MagicMock(id="user-id")
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=None)

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "invalid-role",
        "client_id": str(uuid.uuid4())
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Role 'invalid-role' does not exist"

def test_edit_user_client_not_found(client, mocker):
    mock_user = MagicMock(id="user-id")
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock(id='role-1'))
    mocker.patch('ServicioSistema.commands.client_exists.ExistsClient.execute', return_value=False)

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "role-1",
        "client_id": "invalid-client"
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Client 'invalid-client' does not exist"

def test_edit_user_internal_error(client, mocker):
    mock_user = MagicMock(id="user-id")
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock(id='role-1'))
    mocker.patch('ServicioSistema.commands.client_exists.ExistsClient.execute', return_value=True)

    mocker.patch('ServicioSistema.commands.user_update.UpdateUser.execute', side_effect=Exception("Internal Error"))

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "role-1",
        "client_id": str(uuid.uuid4())
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 500
    assert "Failed to update user" in response.json['error']

def test_edit_user_missing_name(client, mocker):
    mock_user = MagicMock(id="user-id")
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)

    json_data = {
        "name": "",
        "email": "updatedemail@example.com",
        "role_id": "role-1",
        "client_id": str(uuid.uuid4())
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Name is required"

def test_edit_user_missing_email(client, mocker):
    mock_user = MagicMock(id="user-id")
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)

    json_data = {
        "name": "Updated Name",
        "email": "",
        "role_id": "role-1",
        "client_id": str(uuid.uuid4())
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Email is required"

def test_edit_user_missing_role_id(client, mocker):
    mock_user = MagicMock(id="user-id")
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "",
        "client_id": str(uuid.uuid4())
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Role ID is required"

def test_edit_user_missing_client_id(client, mocker):
    mock_user = MagicMock(id="user-id")
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "role-1",
        "client_id": ""
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Client ID is required"

def test_edit_user_value_error(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', side_effect=ValueError("User not found"))

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "role-1",
        "client_id": str(uuid.uuid4())
    }

    response = client.put('/api/users/nonexistent-user', json=json_data)

    assert response.status_code == 404
    assert response.data == b"User not found"