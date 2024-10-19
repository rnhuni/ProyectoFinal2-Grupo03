import pytest
from flask import Flask, jsonify
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.users.routes import users_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(users_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

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

def test_edit_user_success(client, mocker):
    mock_user_attributes = {
        'email': 'updateduser@example.com',
        'name': 'Updated User'
    }

    json_data = {
        "username": "user-1",
        "attributes": mock_user_attributes
    }

    response = client.put('/api/users', json=json_data)

    assert response.status_code == 200
    assert response.json['message'] == "Usuario user-1 actualizado exitosamente."
