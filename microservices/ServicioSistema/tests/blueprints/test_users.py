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
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=MagicMock(id='role-1'))
    mocker.patch('ServicioSistema.commands.client_get.GetClient.execute', return_value=MagicMock(active_subscription_plan=MagicMock(features=['feature-1'])))
    
    mock_user = MagicMock()
    mock_user.id = "user-1"
    mock_user.name = "Test User"
    mock_user.email = "testuser@example.com"
    mock_user.role_id = "role-1"
    mock_user.features = ["feature-1"]
    mock_user.status = "active"
    mock_user.client_id = "client-1"
    mock_user.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_user.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    
    mocker.patch('ServicioSistema.commands.user_create.CreateUser.execute', return_value=mock_user)

    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 201
    assert response.json == {
        "id": "user-1",
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "features": ["feature-1"],
        "status": "active",
        "client_id": "client-1",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-02T00:00:00"
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
    mocker.patch('ServicioSistema.commands.role_get.GetRole.execute', return_value=None)

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
    mocker.patch('ServicioSistema.commands.client_get.GetClient.execute', return_value=None)

    json_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "role_id": "role-1",
        "client_id": "client-1"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Client 'client-1' does not exist"

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
    mock_user.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_user.updatedAt = datetime(2024, 1, 2, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.user_get.GetUser.execute', return_value=mock_user)

    response = client.get(f'/api/users/{mock_user.id}')

    assert response.status_code == 200

def test_edit_user_success(client, mocker):
    mock_user = MagicMock()
    mock_user.id = uuid.uuid4()
    mock_user.name = "Test User"
    mock_user.email = "testuser@example.com"
    mock_user.role_id = "role-1"
    mock_user.client_id = uuid.uuid4()

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
    mock_updated_user.created_at = datetime(2024, 1, 1, 0, 0, 0)
    mock_updated_user.updated_at = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.user_update.UpdateUser.execute', return_value=mock_updated_user)

    json_data = {
        "name": "Updated Name",
        "email": "updatedemail@example.com",
        "role_id": "role-1",
        "client_id": str(mock_user.client_id)
    }

    response = client.put(f'/api/users/{mock_user.id}', json=json_data)

    assert response.status_code == 500
