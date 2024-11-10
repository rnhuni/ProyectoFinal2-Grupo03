from datetime import datetime
import pytest
import uuid
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.users.routes import users_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(users_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_user_success(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock())
    mocker.patch('ServicioSistema.commands.client_get.GetClient.execute', return_value=MagicMock(active_subscription_plan=MagicMock(features=["feature1", "feature2"])))
    
    mock_user = MagicMock()
    mock_user.id = "user-id"
    mock_user.name = "Test User"
    mock_user.email = "test@example.com"
    mock_user.role_id = "role-id"
    mock_user.features = ["feature1", "feature2"]
    mock_user.status = "active"
    mock_user.client_id = "client-id"
    mock_user.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_user.updatedAt = datetime(2024, 1, 1, 0, 0, 0)
    
    mocker.patch('ServicioSistema.commands.user_create.CreateUser.execute', return_value=mock_user)

    json_data = {
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 201
    assert response.json == {
        "id": "user-id",
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "role-id",
        "features": ["feature1", "feature2"],
        "status": "active",
        "client_id": "client-id",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_create_user_missing_name(client):
    json_data = {
        "email": "test@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Name is required"

def test_create_user_email_in_use(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=True)

    json_data = {
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Email is already in use"

def test_create_user_role_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=None)

    json_data = {
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "non-existent-role",
        "client_id": "client-id"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Role 'non-existent-role' does not exist"

def test_create_user_client_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock())
    mocker.patch('ServicioSistema.commands.client_get.GetClient.execute', return_value=None)

    json_data = {
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "role-id",
        "client_id": "non-existent-client"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Client 'non-existent-client' does not exist"

def test_get_user_success(client, mocker):
    mock_user = MagicMock()
    mock_user.id = "user-id"
    mock_user.name = "Test User"
    mock_user.email = "test@example.com"
    mock_user.cognito_id = "cognito-id"
    mock_user.role_id = "role-id"
    
    mock_user.role = MagicMock()
    mock_user.role.name = "Admin"
    
    mock_user.client = MagicMock()
    mock_user.client.name = "Test Client"
    
    mock_user.client_id = "client-id"
    mock_user.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_user.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)

    response = client.get('/api/users/user-id')

    assert response.status_code == 200
    assert response.json == {
        "id": "user-id",
        "name": "Test User",
        "email": "test@example.com",
        "cognito_id": "cognito-id",
        "role_id": "role-id",
        "role_name": "Admin",
        "client_id": "client-id",
        "client_name": "Test Client",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }


def test_get_user_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=None)

    response = client.get('/api/users/non-existent-user')

    assert response.status_code == 404
    assert response.data.decode('utf-8') == "User not found"

def test_get_all_users_success(client, mocker):
    mock_user_1 = MagicMock()
    mock_user_1.id = "user-1"
    mock_user_1.name = "User 1"
    mock_user_1.email = "user1@example.com"
    mock_user_1.cognito_id = "cognito-1"
    mock_user_1.role_id = "role-1"
    mock_user_1.client_id = "client-1"
    mock_user_1.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_user_1.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mock_user_1.role = type('Role', (object,), {"name": "Admin"})()
    mock_user_1.client = type('Client', (object,), {"name": "Client 1"})()

    mock_user_2 = MagicMock()
    mock_user_2.id = "user-2"
    mock_user_2.name = "User 2"
    mock_user_2.email = "user2@example.com"
    mock_user_2.cognito_id = "cognito-2"
    mock_user_2.role_id = "role-2"
    mock_user_2.client_id = "client-2"
    mock_user_2.createdAt = datetime(2024, 2, 1, 0, 0, 0)
    mock_user_2.updatedAt = datetime(2024, 2, 1, 0, 0, 0)

    mock_user_2.role = type('Role', (object,), {"name": "Editor"})()
    mock_user_2.client = type('Client', (object,), {"name": "Client 2"})()

    mocker.patch('ServicioSistema.commands.user_get_all.GetAllUsers.execute', return_value=[mock_user_1, mock_user_2])

    response = client.get('/api/users')

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "user-1",
            "name": "User 1",
            "email": "user1@example.com",
            "cognito_id": "cognito-1",
            "role_id": "role-1",
            "role_name": "Admin",
            "client_id": "client-1",
            "client_name": "Client 1",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00"
        },
        {
            "id": "user-2",
            "name": "User 2",
            "email": "user2@example.com",
            "cognito_id": "cognito-2",
            "role_id": "role-2",
            "role_name": "Editor",
            "client_id": "client-2",
            "client_name": "Client 2",
            "created_at": "2024-02-01T00:00:00",
            "updated_at": "2024-02-01T00:00:00"
        }
    ]


def test_get_all_users_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get_all.GetAllUsers.execute', side_effect=Exception("Database error"))

    response = client.get('/api/users')

    assert response.status_code == 500
    assert "Failed to retrieve users" in response.json['error']

def test_edit_user_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=None)

    json_data = {
        "name": "Updated User",
        "email": "updated@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.put('/api/users/non-existent-user', json=json_data)

    assert response.status_code == 404
    assert response.data.decode('utf-8') == "User with id 'non-existent-user' not found"


def test_edit_user_success(client, mocker):
    mock_user = MagicMock()
    mock_user.id = "user-id"
    mock_user.name = "Updated User"
    mock_user.email = "updated@example.com"
    mock_user.cognito_id = "cognito-id"
    mock_user.role_id = "role-id"
    mock_user.client_id = "client-id"
    mock_user.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_user.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mock_user.role = type('Role', (object,), {"name": "Admin"})()
    mock_user.client = type('Client', (object,), {"name": "Test Client"})()

    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=type('Role', (object,), {"id": "role-id"})())
    mocker.patch('ServicioSistema.commands.client_exists.ExistsClient.execute', return_value=True)
    mocker.patch('ServicioSistema.commands.user_update.UpdateUser.execute', return_value=mock_user)

    json_data = {
        "name": "Updated User",
        "email": "updated@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 200
    assert response.json == {
        "id": "user-id",
        "name": "Updated User",
        "email": "updated@example.com",
        "cognito_id": "cognito-id",
        "role_id": "role-id",
        "client_id": "client-id",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_create_user_empty_email(client):
    json_data = {
        "name": "Test User",
        "email": "",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Email is required"

def test_create_user_empty_role_id(client):
    json_data = {
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "",
        "client_id": "client-id"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Role ID is required"

def test_create_user_empty_client_id(client):
    json_data = {
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "role-id",
        "client_id": ""
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Client ID is required"

def test_create_user_client_without_subscription_plan(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock())
    
    mock_client = MagicMock()
    mock_client.active_subscription_plan = None
    mocker.patch('ServicioSistema.commands.client_get.GetClient.execute', return_value=mock_client)

    json_data = {
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Client 'client-id' does not active subscription_plan"

def test_create_user_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock())
    
    mock_client = MagicMock()
    mock_client.active_subscription_plan = MagicMock(features=["feature1", "feature2"])
    mocker.patch('ServicioSistema.commands.client_get.GetClient.execute', return_value=mock_client)
    
    mocker.patch('ServicioSistema.commands.user_create.CreateUser.execute', side_effect=Exception("Unexpected error"))

    json_data = {
        "name": "Test User",
        "email": "test@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 500
    assert "Create user failed. Details: Unexpected error" in response.json['error']

def test_get_user_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', side_effect=Exception("Unexpected retrieval error"))

    response = client.get('/api/users/user-id')

    assert response.status_code == 500
    assert "Failed to retrieve user. Details: Unexpected retrieval error" in response.json['error']

def test_edit_user_missing_name(client):
    json_data = {
        "name": "",
        "email": "updated@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Name is required"

def test_edit_user_missing_email(client):
    json_data = {
        "name": "Updated User",
        "email": "",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Email is required"

def test_edit_user_missing_role_id(client):
    json_data = {
        "name": "Updated User",
        "email": "updated@example.com",
        "role_id": "",
        "client_id": "client-id"
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Role ID is required"

def test_edit_user_missing_client_id(client):
    json_data = {
        "name": "Updated User",
        "email": "updated@example.com",
        "role_id": "role-id",
        "client_id": ""
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Client ID is required"

def test_edit_user_email_already_in_use(client, mocker):
    mock_user = MagicMock()
    mock_user.email = "existing@example.com"
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=True)

    json_data = {
        "name": "Updated User",
        "email": "new@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Email is already in use"

def test_edit_user_role_not_found(client, mocker):
    mock_user = MagicMock()
    mock_user.email = "user@example.com"
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=None)

    json_data = {
        "name": "Updated User",
        "email": "user@example.com",
        "role_id": "non-existent-role",
        "client_id": "client-id"
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Role 'non-existent-role' does not exist"

def test_edit_user_client_not_found(client, mocker):
    mock_user = MagicMock()
    mock_user.email = "user@example.com"
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)
    mocker.patch('ServicioSistema.commands.user_exists_by_email.ExistsUserByEmail.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock())
    mocker.patch('ServicioSistema.commands.client_exists.ExistsClient.execute', return_value=False)

    json_data = {
        "name": "Updated User",
        "email": "user@example.com",
        "role_id": "role-id",
        "client_id": "non-existent-client"
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Client 'non-existent-client' does not exist"

def test_edit_user_value_error(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', side_effect=ValueError("User not found"))

    json_data = {
        "name": "Updated User",
        "email": "updated@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.put('/api/users/non-existent-user', json=json_data)

    assert response.status_code == 404

    assert response.data.decode('utf-8') == "User not found"

def test_edit_user_generic_exception(client, mocker):
    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', side_effect=Exception("Unexpected error during update"))

    json_data = {
        "name": "Updated User",
        "email": "updated@example.com",
        "role_id": "role-id",
        "client_id": "client-id"
    }

    response = client.put('/api/users/user-id', json=json_data)

    assert response.status_code == 500
    assert "Failed to update user. Details: Unexpected error during update" in response.json['error']
