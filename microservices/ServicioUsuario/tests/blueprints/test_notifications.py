import pytest
from flask import Flask
from unittest.mock import MagicMock
from ServicioUsuario.blueprints.notifications.routes import notifications_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(notifications_bp)
    with app.test_client() as client:
        yield client

def test_get_all_notifications_success(client):
    response = client.get('/notifications')

    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 3  # Verifica que hay 3 notificaciones
    assert response.json[0]["id"] == "a4b2c1d4-5f6e-4d7f-8e9f-0123456789ab"
    assert response.json[1]["name"] == "notificacion 2"
    assert response.json[2]["service"] == "servicio 3"
    assert response.json[2]["show_by_default"] is False

def test_put_notification_success(client):
    notification_id = "a4b2c1d4-5f6e-4d7f-8e9f-0123456789ab"
    show = "true"
    response = client.put(f'/notifications/{notification_id}/show/{show}')
    
    assert response.status_code == 200
    assert response.data.decode() == notification_id  # Verifica que el id se retorna correctamente

