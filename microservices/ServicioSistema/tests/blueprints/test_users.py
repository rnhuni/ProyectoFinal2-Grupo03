import pytest
from flask import Flask
from ServicioSistema.blueprints.users.routes import users_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(users_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_user_success(client):
    json_data = {
        "username": "testuser",
        "password": "TempPassword123!",
        "email": "test@example.com"
    }

    response = client.post('/api/users', json=json_data)

    assert response.status_code == 201
    assert response.json['message'] == 'Usuario testuser creado exitosamente.'
