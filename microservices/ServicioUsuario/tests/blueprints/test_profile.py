import pytest
import jwt
from flask import Flask, Blueprint
from unittest.mock import patch
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

    mocker.patch('jwt.decode', return_value=token_payload)

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
    assert response.status_code == 500