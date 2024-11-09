import pytest
from flask import Flask
from unittest.mock import MagicMock
from datetime import datetime
from ServicioSistema.blueprints.notifications.routes import notifications_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(notifications_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_get_all_notifications(client):
    response = client.get('/api/notifications')
    assert response.status_code == 200
    assert response.json == [
        {
            "id": "a4b2c1d4-5f6e-4d7f-8e9f-0123456789ab",
            "name": "notificacion 1",
            "service": "servicio 1",
            "show_by_default": False,
            "created_at": "2024-11-07 15:34:000",
            "updated_at": "2024-11-07 15:34:000"
        },
        {
            "id": "b4b2c1d4-5f6e-4d7f-8e9f-0123456789ab",
            "name": "notificacion 2",
            "service": "servicio 2",
            "show_by_default": False,
            "created_at": "2024-11-07 15:34:000",
            "updated_at": "2024-11-07 15:34:000"
        },
        {
            "id": "c4b2c1d4-5f6e-4d7f-8e9f-0123456789ab",
            "name": "notificacion 3",
            "service": "servicio 3",
            "show_by_default": False,
            "created_at": "2024-11-07 15:34:000",
            "updated_at": "2024-11-07 15:34:000"
        }
    ]

def test_create_notification_success(client, mocker):
    mock_notification = MagicMock()
    mock_notification.id = "d4b2c1d4-5f6e-4d7f-8e9f-0123456789ab"
    mock_notification.name = "notificacion nueva"
    mock_notification.service = "servicio nuevo"
    mock_notification.show_by_default = True
    mock_notification.createdAt = datetime(2024, 11, 7, 15, 34, 0)
    mock_notification.updatedAt = datetime(2024, 11, 7, 15, 34, 0)

    mocker.patch('ServicioSistema.commands.notification_create.CreateNotification.execute', return_value=mock_notification)

    json_data = {
        "name": "notificacion nueva",
        "service": "servicio nuevo",
        "show_by_default": True
    }

    response = client.post('/api/notifications', json=json_data)

    assert response.status_code == 201
    assert response.json == {
        "id": "d4b2c1d4-5f6e-4d7f-8e9f-0123456789ab",
        "name": "notificacion nueva",
        "service": "servicio nuevo",
        "show_by_default": True,
        "created_at": "2024-11-07T15:34:00",
        "updated_at": "2024-11-07T15:34:00"
    }

def test_create_notification_invalid_parameters(client):
    json_data = {
        "name": "",
        "service": ""
    }
    response = client.post('/api/notifications', json=json_data)
    assert response.status_code == 400
    assert response.data == b"Invalid parameters"

def test_create_notification_error(client, mocker):
    mocker.patch('ServicioSistema.commands.notification_create.CreateNotification.execute', side_effect=Exception("Database error"))

    json_data = {
        "name": "notificacion nueva",
        "service": "servicio nuevo",
        "show_by_default": True
    }

    response = client.post('/api/notifications', json=json_data)

    assert response.status_code == 500
    assert "Error creating notification" in response.json['error']

def test_put_notification_success(client):
    notification_id = "e4b2c1d4-5f6e-4d7f-8e9f-0123456789ab"
    response = client.put(f'/api/notifications/{notification_id}')
    assert response.status_code == 200
    assert response.data.decode() == notification_id
