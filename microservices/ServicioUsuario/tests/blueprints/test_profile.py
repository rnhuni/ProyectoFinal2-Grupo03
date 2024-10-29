import pytest
import jwt
from flask import Flask
from unittest.mock import MagicMock
from ServicioUsuario.blueprints.profile.routes import profile_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(profile_bp)
    with app.test_client() as client:
        yield client

def test_get_profile_success(client, mocker):
    token_payload = {
        "sub": "user-1",
        "name": "Test User",
        "email": "test@example.com",
        "custom:client": "client-1",
        "custom:role": "role-1",
        "custom:permissions": "pem-menu1-view:view;pem-menu2-edit:edit",
        "custom:features": "feature1;feature2"
    }
    token = jwt.encode(token_payload, "secret", algorithm="HS256")

    mock_jwk_client = mocker.patch('ServicioUsuario.blueprints.profile.routes.PyJWKClient')
    mock_signing_key = MagicMock()
    mock_signing_key.key = "secret"
    mock_jwk_client.return_value.get_signing_key_from_jwt.return_value = mock_signing_key
    mocker.patch('jwt.decode', return_value=token_payload)
    mocker.patch('ServicioUsuario.services.cognito_service.CognitoService.get_user_status', return_value="ACTIVE")

    response = client.get('/profile', headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json["user"]["id"] == "user-1"
    assert response.json["user"]["name"] == "Test User"
    assert response.json["user"]["email"] == "test@example.com"
    assert response.json["views"] == [
        {"id": "menu1", "menu": "view", "actions": ["view"]},
        {"id": "menu2", "menu": "edit", "actions": ["edit"]}
    ]
    assert response.json["features"] == ["feature1", "feature2"]

def test_get_profile_no_token(client):
    response = client.get('/profile')
    assert response.status_code == 400
    assert response.json == {"error": "Token de autorización no encontrado o inválido"}

def test_get_profile_invalid_token_format(client):
    response = client.get('/profile', headers={"Authorization": "Bearer invalid.token"})
    assert response.status_code == 400
    assert response.json == {"error": "Formato de token inválido"}

def test_get_profile_invalid_token(client, mocker):
    mocker.patch('jwt.decode', side_effect=jwt.InvalidTokenError("Token mal formado"))
    response = client.get('/profile', headers={"Authorization": "Bearer invalid.token.ddd.dd"})
    assert response.status_code == 400
    assert response.json == {"error": "Formato de token inválido"}

def test_get_profile_no_permissions_or_features(client, mocker):
    token_payload = {
        "sub": "user-2",
        "name": "User No Permissions",
        "email": "nopermissions@example.com",
        "custom:client": "client-2",
        "custom:role": "role-2",
        "custom:permissions": "",
        "custom:features": ""
    }
    token = jwt.encode(token_payload, "secret", algorithm="HS256")

    mock_jwk_client = mocker.patch('ServicioUsuario.blueprints.profile.routes.PyJWKClient')
    mock_signing_key = MagicMock()
    mock_signing_key.key = "secret"
    mock_jwk_client.return_value.get_signing_key_from_jwt.return_value = mock_signing_key
    mocker.patch('jwt.decode', return_value=token_payload)
    mocker.patch('ServicioUsuario.services.cognito_service.CognitoService.get_user_status', return_value="ACTIVE")

    response = client.get('/profile', headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert response.json["user"]["id"] == "user-2"
    assert response.json["user"]["name"] == "User No Permissions"
    assert response.json["user"]["email"] == "nopermissions@example.com"
    assert response.json["views"] == []

def test_get_profile_unexpected_error(client, mocker):
    mocker.patch('ServicioUsuario.blueprints.profile.routes.PyJWKClient.get_signing_key_from_jwt', side_effect=Exception("Unexpected error"))
    response = client.get('/profile', headers={"Authorization": "Bearer valid.token.structure"})
    assert response.status_code == 500
    assert response.json == {"error": "Error retrieving profile. Details: Unexpected error"}
