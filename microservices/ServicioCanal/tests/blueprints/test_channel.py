import pytest
import jwt
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioCanal.blueprints.channels.routes import channels_bp
from datetime import datetime

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(channels_bp, url_prefix='/api')
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

def test_get_all_channels_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    mock_channel = MagicMock()
    mock_channel.id = 1
    mock_channel.name = "Test Channel"
    mock_channel.description = "Description"
    mock_channel.type = "support"
    mock_channel.platforms = "web;mobile"
    
    mocker.patch('ServicioCanal.commands.channel_get_all.GetAllChannels.execute', return_value=[mock_channel])

    headers = generate_headers()
    response = client.get('/api/channels', headers=headers)

    assert response.status_code == 200
    assert response.json == [
        {
            "id": 1,
            "name": "Test Channel",
            "description": "Description",
            "type": "support",
            "platforms": ["web", "mobile"]
        }
    ]

def test_get_all_channels_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.channel_get_all.GetAllChannels.execute', side_effect=Exception("DB error"))

    headers = generate_headers()
    response = client.get('/api/channels', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving channels" in response.json['error']

def test_get_channel_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    mock_channel = MagicMock()
    mock_channel.id = 1
    mock_channel.name = "Test Channel"
    mock_channel.description = "Description"
    mock_channel.type = "support"
    mock_channel.platforms = "web;mobile"
    
    mocker.patch('ServicioCanal.commands.channel_get.GetChannel.execute', return_value=mock_channel)

    headers = generate_headers()
    response = client.get('/api/channels/1', headers=headers)

    assert response.status_code == 200
    assert response.json == {
        "id": 1,
        "name": "Test Channel",
        "description": "Description",
        "type": "support",
        "platforms": ["web", "mobile"]
    }

def test_get_channel_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioCanal.commands.channel_get.GetChannel.execute', return_value=None)

    headers = generate_headers()
    response = client.get('/api/channels/1', headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Channel not found"}

def test_get_sessions_by_channel_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.channel_exists.ExistsChannel.execute', return_value=True)

    mock_session = MagicMock(
        id=1, channel_id=1, status="OPEN", topic="Incident", topic_refid="REF-001",
        opened_by_id="user123", opened_by_name="Test User", assigned_to_type="agent",
        assigned_to_id="agent123", assigned_to_name="Agent Name",
        created_at=datetime(2024, 1, 1, 0, 0, 0), updated_at=datetime(2024, 1, 2, 0, 0, 0)
    )
    mocker.patch('ServicioCanal.commands.session_get_all.GetAllSessions.execute', return_value=[mock_session])

    headers = generate_headers()
    response = client.get('/api/channels/1/sessions', headers=headers)

    assert response.status_code == 200
    assert sorted(response.json, key=lambda x: x['id']) == sorted([
        {
            "id": 1,
            "channel_id": 1,
            "status": "OPEN",
            "topic": "Incident",
            "topic_refid": "REF-001",
            "opened_by_id": "user123",
            "opened_by_name": "Test User",
            "assigned_to_type": "agent",
            "assigned_to_id": "agent123",
            "assigned_to_name": "Agent Name"
        }
    ], key=lambda x: x['id'])

def test_get_channel_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.channel_get.GetChannel.execute', side_effect=Exception("DB connection failed"))

    headers = generate_headers()
    response = client.get('/api/channels/1', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving channel" in response.json['error']

def test_create_channel_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    mock_channel = MagicMock()
    mock_channel.id = 1
    mock_channel.name = "New Channel"
    mock_channel.description = "New Description"
    mock_channel.type = "support"
    mock_channel.platforms = "web;mobile"
    mock_channel.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_channel.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    mocker.patch('ServicioCanal.commands.channel_create.CreateChannel.execute', return_value=mock_channel)

    headers = generate_headers()
    data = {
        "name": "New Channel",
        "description": "New Description",
        "type": "support",
        "platforms": "web;mobile"
    }
    response = client.post('/api/channels', json=data, headers=headers)

    assert response.status_code == 201
    assert response.json == {
        "id": 1,
        "name": "New Channel",
        "description": "New Description",
        "type": "support",
        "platforms": ["web", "mobile"],
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-02T00:00:00"
    }

def test_create_channel_invalid_parameters(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    data = {
        "name": "Incomplete Channel"
    }
    response = client.post('/api/channels', json=data, headers=headers)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Invalid parameters"

def test_create_channel_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.channel_create.CreateChannel.execute', side_effect=Exception("Database connection error"))

    headers = generate_headers()
    data = {
        "name": "New Channel",
        "description": "New Description",
        "type": "support",
        "platforms": "web;mobile"
    }
    response = client.post('/api/channels', json=data, headers=headers)

    assert response.status_code == 500
    assert "Error creating channel" in response.json['error']

def test_get_sessions_by_channel_no_sessions(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)    
    mocker.patch('ServicioCanal.commands.channel_exists.ExistsChannel.execute', return_value=True)    
    mocker.patch('ServicioCanal.commands.session_get_all.GetAllSessions.execute', return_value=[])

    headers = generate_headers()
    response = client.get('/api/channels/1/sessions', headers=headers)

    assert response.status_code == 200
    assert response.json == []

def test_get_sessions_by_channel_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)    
    mocker.patch('ServicioCanal.commands.channel_exists.ExistsChannel.execute', return_value=True)    
    mocker.patch('ServicioCanal.commands.session_get_all.GetAllSessions.execute', side_effect=Exception("Database connection failed"))

    headers = generate_headers()
    response = client.get('/api/channels/1/sessions', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving sessions" in response.json['error']
    assert "Database connection failed" in response.json['error']

def test_create_session_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioCanal.commands.channel_exists.ExistsChannel.execute', return_value=True)

    mock_session = MagicMock()
    mock_session.id = "session123"
    mock_session.status = "OPEN"
    mock_session.channel_id = "channel123"
    mock_session.topic = "Test Topic"
    mock_session.topic_refid = "REF-001"
    mock_session.opened_by_id = "user123"
    mock_session.opened_by_name = "Test User"
    mock_session.opened_by_type = "user"
    mock_session.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_session.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    mocker.patch('ServicioCanal.commands.session_create.CreateSession.execute', return_value=mock_session)

    mocker.patch('ServicioCanal.services.notification_service.NotificationService.publish_new_session')
    mocker.patch('ServicioCanal.services.monitor_service.MonitorService.enqueue_event', return_value=None)

    headers = generate_headers()
    data = {
        "topic": "Test Topic",
        "topic_refid": "REF-001"
    }
    response = client.post('/api/channels/channel123/sessions', json=data, headers=headers)

    assert response.status_code == 201
    assert response.json == {
        "id": "session123",
        "status": "OPEN",
        "channel_id": "channel123",
        "topic": "Test Topic",
        "topic_refid": "REF-001",
        "opened_by_id": "user123",
        "opened_by_name": "Test User",
        "opened_by_type": "user",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-02T00:00:00"
    }

def test_create_session_invalid_parameters(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    data = {
        "topic_refid": "REF-001"
    }
    response = client.post('/api/channels/channel123/sessions', json=data, headers=headers)

    assert response.status_code == 400
    assert response.data.decode('utf-8') == "Invalid parameters"

def test_create_session_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.channel_exists.ExistsChannel.execute', return_value=True)
    mocker.patch('ServicioCanal.commands.session_create.CreateSession.execute', side_effect=Exception("Database error"))

    headers = generate_headers()
    data = {
        "topic": "Test Topic",
        "topic_refid": "REF-001"
    }
    response = client.post('/api/channels/channel123/sessions', json=data, headers=headers)

    assert response.status_code == 500
    assert "Error creating session" in response.json['error']
    assert "Database error" in response.json['error']

def test_get_sessions_by_channel_channel_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioCanal.commands.channel_exists.ExistsChannel.execute', return_value=False)

    headers = generate_headers()
    response = client.get('/api/channels/1/sessions', headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Channel not found"}

def test_create_session_channel_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "role_type": "user"}
    mocker.patch('ServicioCanal.blueprints.channels.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioCanal.commands.channel_exists.ExistsChannel.execute', return_value=False)

    headers = generate_headers()
    data = {
        "topic": "Test Topic",
        "topic_refid": "REF-001"
    }
    response = client.post('/api/channels/channel123/sessions', json=data, headers=headers)

    assert response.status_code == 404
    assert response.data.decode('utf-8') == "Channel not found"
