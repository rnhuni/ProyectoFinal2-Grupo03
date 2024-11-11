import pytest
import jwt
from datetime import datetime
from unittest.mock import MagicMock
from flask import Flask
from ServicioUsuario.blueprints.notifications.routes import notifications_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(notifications_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def generate_headers():
    token_payload = {
        "sub": "user123",
        "name": "Test User",
        "email": "test@example.com",
        "custom:client": "client-1",
        "custom:role": "role-1",
        "custom:permissions": "pem-menu1-view:view;pem-menu2-edit:edit",
        "custom:features": "feature1;feature2"
    }
    token = jwt.encode(token_payload, "secret", algorithm="HS256")
    headers = {'Authorization': f'Bearer {token}'}
    return headers

def test_get_all_notifications_success(client, mocker):
    headers = generate_headers()
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "test@example.com"
    }
    mocker.patch('ServicioUsuario.blueprints.notifications.routes.decode_user', return_value=mock_user)
    
    base_notifications = [
        {
            "id": "1",
            "name": "notificacion base 1",
            "show_by_default": True,
            "created_at": "2024-11-07T15:34:00",
            "updated_at": "2024-11-07T15:34:00"
        },
        {
            "id": "2",
            "name": "notificacion base 2",
            "show_by_default": False,
            "created_at": "2024-11-07T15:34:00",
            "updated_at": "2024-11-07T15:34:00"
        }
    ]
    
    user_notifications = [
        MagicMock(base_id="1", show=False, createdAt=datetime(2024, 11, 7, 15, 34, 0), updatedAt=datetime(2024, 11, 7, 15, 34, 0))
    ]
    
    mocker.patch('ServicioUsuario.services.system_service.SystemService.get_notifications', return_value=base_notifications)
    mocker.patch('ServicioUsuario.commands.notification_get_all.GetAllNotifications.execute', return_value=user_notifications)

    response = client.get('/api/notifications', headers=headers)
    assert response.status_code == 200
    assert response.json == [
        {
            "id": "1",
            "name": "notificacion base 1",
            "show": False,
            "created_at": "2024-11-07T15:34:00",
            "updated_at": "2024-11-07T15:34:00"
        },
        {
            "id": "2",
            "name": "notificacion base 2",
            "show": False,
            "created_at": "2024-11-07T15:34:00",
            "updated_at": "2024-11-07T15:34:00"
        }
    ]

def test_get_all_notifications_error(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioUsuario.blueprints.notifications.routes.decode_user', side_effect=Exception("Invalid token"))

    response = client.get('/api/notifications', headers=headers)
    assert response.status_code == 500
    assert "Error retrieving notifications" in response.json['error']

def test_put_notification_update_existing(client, mocker):
    headers = generate_headers()
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "test@example.com"
    }
    mocker.patch('ServicioUsuario.blueprints.notifications.routes.decode_user', return_value=mock_user)

    mock_notification = MagicMock()
    mock_notification.base_id = "1"
    mock_notification.name = "notificacion actualizada"
    mock_notification.show = True
    mock_notification.createdAt = datetime(2024, 11, 7, 15, 34, 0)
    mock_notification.updatedAt = datetime(2024, 11, 7, 15, 34, 0)

    mocker.patch('ServicioUsuario.commands.notification_exists.ExistsNotification.execute', return_value=True)
    mocker.patch('ServicioUsuario.commands.notification_update.UpdateNotification.execute', return_value=mock_notification)

    response = client.put('/api/notifications/1/show/true', headers=headers)
    assert response.status_code == 200
    assert response.json == {
        "id": "1",
        "name": "notificacion actualizada",
        "show": True,
        "created_at": "2024-11-07T15:34:00",
        "updated_at": "2024-11-07T15:34:00"
    }

def test_put_notification_create_new(client, mocker):
    headers = generate_headers()
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "test@example.com"
    }
    mocker.patch('ServicioUsuario.blueprints.notifications.routes.decode_user', return_value=mock_user)

    mock_notification = MagicMock()
    mock_notification.base_id = "1"
    mock_notification.name = "notificacion nueva"
    mock_notification.show = True
    mock_notification.createdAt = datetime(2024, 11, 7, 15, 34, 0)
    mock_notification.updatedAt = datetime(2024, 11, 7, 15, 34, 0)

    mocker.patch('ServicioUsuario.commands.notification_exists.ExistsNotification.execute', return_value=False)
    mocker.patch('ServicioUsuario.services.system_service.SystemService.get_notification', return_value={"id": "1", "name": "notificacion nueva"})
    mocker.patch('ServicioUsuario.commands.notification_create.CreateNotification.execute', return_value=mock_notification)

    response = client.put('/api/notifications/1/show/true', headers=headers)
    assert response.status_code == 200
    assert response.json == {
        "id": "1",
        "name": "notificacion nueva",
        "show": True,
        "created_at": "2024-11-07T15:34:00",
        "updated_at": "2024-11-07T15:34:00"
    }

def test_put_notification_not_found(client, mocker):
    headers = generate_headers()
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "test@example.com"
    }
    mocker.patch('ServicioUsuario.blueprints.notifications.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioUsuario.commands.notification_exists.ExistsNotification.execute', return_value=False)
    mocker.patch('ServicioUsuario.services.system_service.SystemService.get_notification', return_value=None)

    response = client.put('/api/notifications/999/show/true', headers=headers)
    assert response.status_code == 404
    assert response.get_data(as_text=True) == "Notification not found"

def test_put_notification_error(client, mocker):
    headers = generate_headers()
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "test@example.com"
    }
    mocker.patch('ServicioUsuario.blueprints.notifications.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioUsuario.commands.notification_exists.ExistsNotification.execute', side_effect=Exception("Database error"))

    response = client.put('/api/notifications/1/show/true', headers=headers)
    assert response.status_code == 500
    assert "Error editting notification" in response.json['error']
