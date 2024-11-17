import pytest
import jwt
from flask import Flask
from unittest.mock import patch, MagicMock
from datetime import datetime
from ServicioCanal.blueprints.sessions.routes import sessions_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(sessions_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def generate_headers():
    token_payload = {
        "sub": "user123",
        "name": "Test User",
        "email": "test@example.com",
        "custom:role": "user"
    }
    token = jwt.encode(token_payload, "secret", algorithm="HS256")
    headers = {'Authorization': f'Bearer {token}'}
    return headers

def test_get_session_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)

    mock_session = MagicMock()
    mock_session.id = "session123"
    mock_session.channel_id = "channel123"
    mock_session.status = "OPEN"
    mock_session.topic = "Test Topic"
    mock_session.topic_refid = "REF-001"
    mock_session.opened_by_id = "user123"
    mock_session.opened_by_name = "Test User"
    mock_session.assigned_to_type = "agent"
    mock_session.assigned_to_id = "agent123"
    mock_session.assigned_to_name = "Agent Name"
    mocker.patch('ServicioCanal.commands.session_get.GetSession.execute', return_value=mock_session)

    headers = generate_headers()
    response = client.get('/api/sessions/session123', headers=headers)

    assert response.status_code == 200
    assert response.json == {
        "id": "session123",
        "channel_id": "channel123",
        "status": "OPEN",
        "topic": "Test Topic",
        "topic_refid": "REF-001",
        "opened_by_id": "user123",
        "opened_by_name": "Test User",
        "assigned_to_type": "agent",
        "assigned_to_id": "agent123",
        "assigned_to_name": "Agent Name"
    }

def test_get_session_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=False)

    headers = generate_headers()
    response = client.get('/api/sessions/nonexistent_session', headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Session not found"}

def test_get_messages_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)

    mock_message = MagicMock()
    mock_message.id = "message123"
    mock_message.session_id = "session123"
    mock_message.content_type = "text"
    mock_message.body = "Hello, world!"
    mock_message.source_id = "user123"
    mock_message.source_name = "Test User"
    mock_message.source_type = "user"
    mock_message.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_message.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    mocker.patch('ServicioCanal.commands.message_get_all.GetAllMessages.execute', return_value=[mock_message])

    headers = generate_headers()
    response = client.get('/api/sessions/session123/messages', headers=headers)

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "message123",
            "session_id": "session123",
            "content_type": "text",
            "body": "Hello, world!",
            "source_id": "user123",
            "source_name": "Test User",
            "source_type": "user",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-02T00:00:00"
        }
    ]

def test_get_messages_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=False)

    headers = generate_headers()
    response = client.get('/api/sessions/nonexistent_session/messages', headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Session not found"}

def test_create_message_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)

    mock_message = MagicMock()
    mock_message.id = "message123"
    mock_message.session_id = "session123"
    mock_message.content_type = "text"
    mock_message.body = "Hello, world!"
    mock_message.source_id = "user123"
    mock_message.source_name = "Test User"
    mock_message.source_type = "user"
    mock_message.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_message.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    mocker.patch('ServicioCanal.commands.message_create.CreateMessage.execute', return_value=mock_message)
    mocker.patch('ServicioCanal.services.notification_service.NotificationService.publish_new_message')

    mock_monitor_service = mocker.patch('ServicioCanal.services.monitor_service.MonitorService')
    mock_monitor_service_instance = mock_monitor_service.return_value
    mock_monitor_service_instance.client = MagicMock()
    mock_monitor_service_instance.enqueue_event.return_value = None

    mocker.patch('ServicioCanal.blueprints.sessions.routes.MonitorService', return_value=mock_monitor_service_instance)

    headers = generate_headers()

    data = {
        "content_type": "text",
        "body": "Hello, world!"
    }

    response = client.post('/api/sessions/session123/messages', json=data, headers=headers)

    assert response.status_code == 201
    assert response.json == {
        "id": "message123",
        "session_id": "session123",
        "content_type": "text",
        "body": "Hello, world!",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-02T00:00:00"
    }

def test_create_message_invalid_parameters(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    data = {
        "content_type": "text"
    }
    response = client.post('/api/sessions/session123/messages', json=data, headers=headers)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Invalid parameters"

def test_create_message_session_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=False)

    headers = generate_headers()
    data = {
        "content_type": "text",
        "body": "Hello, world!"
    }
    response = client.post('/api/sessions/nonexistent_session/messages', json=data, headers=headers)

    assert response.status_code == 404
    assert response.data.decode('utf-8') == "Session not found"

def test_create_message_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)
    mocker.patch('ServicioCanal.commands.message_create.CreateMessage.execute', side_effect=Exception("Database error"))

    headers = generate_headers()
    data = {
        "content_type": "text",
        "body": "Hello, world!"
    }
    response = client.post('/api/sessions/session123/messages', json=data, headers=headers)

    assert response.status_code == 500
    assert "Error creating message" in response.json['error']
    assert "Database error" in response.json['error']

def test_get_session_not_found_after_check(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)
    mocker.patch('ServicioCanal.commands.session_get.GetSession.execute', return_value=None)

    headers = generate_headers()
    response = client.get('/api/sessions/nonexistent_session', headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Session not found"}

def test_get_session_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)
    mocker.patch('ServicioCanal.commands.session_get.GetSession.execute', side_effect=Exception("Database connection failed"))

    headers = generate_headers()
    response = client.get('/api/sessions/session123', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving session" in response.json['error']
    assert "Database connection failed" in response.json['error']

def test_get_messages_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)

    mocker.patch('ServicioCanal.commands.message_get_all.GetAllMessages.execute', side_effect=Exception("Database query failed"))

    headers = generate_headers()
    response = client.get('/api/sessions/session123/messages', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving messages" in response.json['error']
    assert "Database query failed" in response.json['error']

def test_close_session_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=False)

    headers = generate_headers()
    response = client.delete('/api/sessions/nonexistent_session', headers=headers)

    assert response.status_code == 404
    assert response.json == {'error': 'Session not found'}

def test_close_session_update_failed(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)
    mocker.patch('ServicioCanal.commands.session_update.UpdateSession.execute', return_value=False)

    headers = generate_headers()
    response = client.delete('/api/sessions/session123', headers=headers)

    assert response.status_code == 500
    assert response.json == {'error': 'Failed to close session'}

def test_close_session_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)
    mocker.patch('ServicioCanal.commands.session_update.UpdateSession.execute', side_effect=Exception("Unexpected database error"))

    headers = generate_headers()
    response = client.delete('/api/sessions/session123', headers=headers)

    assert response.status_code == 500
    assert "Error closing session" in response.json['error']
    assert "Unexpected database error" in response.json['error']

def test_close_session_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.sessions.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.session_exists.ExistsSession.execute', return_value=True)
    mocker.patch('ServicioCanal.commands.session_update.UpdateSession.execute', return_value=True)

    mock_monitor_service = MagicMock()
    mock_monitor_service_instance = mock_monitor_service.return_value
    mock_monitor_service_instance.enqueue_event = MagicMock(return_value=None)
    
    mocker.patch('ServicioCanal.blueprints.sessions.routes.MonitorService', return_value=mock_monitor_service_instance)

    headers = generate_headers()

    response = client.delete('/api/sessions/session123', headers=headers)

    assert response.status_code == 200
    assert response.json == {'message': 'Session session123 has been closed'}

    mock_monitor_service_instance.enqueue_event.assert_called_once_with(
        mock_user, "CLOSE-SESSION", "SESSION_ID=session123"
    )
