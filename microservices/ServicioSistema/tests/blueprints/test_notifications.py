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

def test_create_notification_success(client, mocker):
    mock_notification = MagicMock()
    mock_notification.id = "notif-1"
    mock_notification.name = "Notification 1"
    mock_notification.service = "Service 1"
    mock_notification.show_by_default = True
    mock_notification.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_notification.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.notification_create.CreateNotification.execute', return_value=mock_notification)

    json_data = {
        "name": "Notification 1",
        "service": "Service 1",
        "show_by_default": True
    }

    response = client.post('/api/notifications', json=json_data)

    assert response.status_code == 201
    assert response.json == {
        "id": "notif-1",
        "name": "Notification 1",
        "service": "Service 1",
        "show_by_default": True,
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_create_notification_invalid_parameters(client):
    json_data = {
        "name": "",
        "service": "Service 1",
        "show_by_default": True
    }

    response = client.post('/api/notifications', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Invalid parameters"

def test_get_all_notifications_success(client, mocker):
    mock_notification_1 = MagicMock()
    mock_notification_1.id = "notif-1"
    mock_notification_1.name = "Notification 1"
    mock_notification_1.service = "Service 1"
    mock_notification_1.show_by_default = True
    mock_notification_1.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_notification_1.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mock_notification_2 = MagicMock()
    mock_notification_2.id = "notif-2"
    mock_notification_2.name = "Notification 2"
    mock_notification_2.service = "Service 2"
    mock_notification_2.show_by_default = False
    mock_notification_2.createdAt = datetime(2024, 2, 1, 0, 0, 0)
    mock_notification_2.updatedAt = datetime(2024, 2, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.notification_get_all.GetAllNotifications.execute', return_value=[mock_notification_1, mock_notification_2])

    response = client.get('/api/notifications')

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "notif-1",
            "name": "Notification 1",
            "service": "Service 1",
            "show_by_default": True,
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-01T00:00:00"
        },
        {
            "id": "notif-2",
            "name": "Notification 2",
            "service": "Service 2",
            "show_by_default": False,
            "created_at": "2024-02-01T00:00:00",
            "updated_at": "2024-02-01T00:00:00"
        }
    ]

def test_get_all_notifications_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.notification_get_all.GetAllNotifications.execute', side_effect=Exception("Database error"))

    response = client.get('/api/notifications')

    assert response.status_code == 500
    assert "Failed to retrieve notifications. Details: Database error" in response.json['error']

def test_get_notification_success(client, mocker):
    mock_notification = MagicMock()
    mock_notification.id = "notif-1"
    mock_notification.name = "Notification 1"
    mock_notification.service = "Service 1"
    mock_notification.show_by_default = True
    mock_notification.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_notification.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.notification_get.GetNotification.execute', return_value=mock_notification)

    response = client.get('/api/notifications/notif-1')

    assert response.status_code == 200
    assert response.json == {
        "id": "notif-1",
        "name": "Notification 1",
        "service": "Service 1",
        "show_by_default": True,
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_get_notification_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.notification_get.GetNotification.execute', return_value=None)

    response = client.get('/api/notifications/non-existent-id')

    assert response.status_code == 404
    assert response.data.decode('utf-8') == "Notification not found"

def test_put_notification_success(client, mocker):
    mock_notification = MagicMock()
    mock_notification.id = "notif-1"
    mock_notification.name = "Updated Notification"
    mock_notification.service = "Updated Service"
    mock_notification.show_by_default = False
    mock_notification.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_notification.updatedAt = datetime(2024, 1, 2, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.notification_get.GetNotification.execute', return_value=mock_notification)
    mocker.patch('ServicioSistema.commands.notification_update.UpdateNotification.execute', return_value=mock_notification)

    json_data = {
        "name": "Updated Notification",
        "service": "Updated Service",
        "show_by_default": False
    }

    response = client.put('/api/notifications/notif-1', json=json_data)

    assert response.status_code == 200
    assert response.json == {
        "id": "notif-1",
        "name": "Updated Notification",
        "service": "Updated Service",
        "show_by_default": False,
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-02T00:00:00"
    }

def test_put_notification_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.notification_get.GetNotification.execute', return_value=None)

    json_data = {
        "name": "Updated Notification",
        "service": "Updated Service",
        "show_by_default": False
    }

    response = client.put('/api/notifications/non-existent-id', json=json_data)

    assert response.status_code == 404
    assert response.data.decode('utf-8') == "Notification not found"

def test_put_notification_invalid_parameters(client, mocker):
    mocker.patch('ServicioSistema.commands.notification_get.GetNotification.execute', return_value=MagicMock())

    json_data = {
        "name": "",
        "service": "Updated Service",
        "show_by_default": False
    }

    response = client.put('/api/notifications/notif-1', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Invalid parameters"

def test_put_notification_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.notification_get.GetNotification.execute', side_effect=Exception("Unexpected error"))

    json_data = {
        "name": "Updated Notification",
        "service": "Updated Service",
        "show_by_default": False
    }

    response = client.put('/api/notifications/notif-1', json=json_data)

    assert response.status_code == 500
    assert "Failed to update notification. Details: Unexpected error" in response.json['error']

def test_create_notification_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.notification_create.CreateNotification.execute', side_effect=Exception("Unexpected creation error"))

    json_data = {
        "name": "Notification Test",
        "service": "Service Test",
        "show_by_default": True
    }

    response = client.post('/api/notifications', json=json_data)

    assert response.status_code == 500
    assert "Error creating notification. Details: Unexpected creation error" in response.json['error']

def test_get_notification_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.notification_get.GetNotification.execute', side_effect=Exception("Unexpected retrieval error"))

    response = client.get('/api/notifications/notif-1')

    assert response.status_code == 500
    assert "Failed to retrieve notification. Details: Unexpected retrieval error" in response.json['error']

def test_put_notification_value_error(client, mocker):
    mock_notification = MagicMock()
    mocker.patch('ServicioSistema.commands.notification_get.GetNotification.execute', return_value=mock_notification)

    mocker.patch('ServicioSistema.commands.notification_update.UpdateNotification.execute', side_effect=ValueError("Invalid notification data"))

    json_data = {
        "name": "Updated Notification",
        "service": "Updated Service",
        "show_by_default": False
    }

    response = client.put('/api/notifications/notif-1', json=json_data)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Invalid notification data"
