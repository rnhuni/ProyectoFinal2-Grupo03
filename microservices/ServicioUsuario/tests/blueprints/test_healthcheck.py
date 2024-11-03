import pytest
from flask import Flask
from ServicioUsuario.blueprints.healthcheck.routes import healthcheck_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(healthcheck_bp, url_prefix='/healthcheck')
    with app.test_client() as client:
        yield client

def test_healthcheck_success(client):
    response = client.get('/healthcheck/')
    
    assert response.status_code == 200
    assert response.json == {'status': 'ok'}
