import pytest
import jwt
import json
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioIncidente.blueprints.incidents.routes import incidents_bp
from datetime import datetime

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(incidents_bp, url_prefix='/api')
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

def test_create_incident_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.services.monitor_service.MonitorService.enqueue_event', return_value="")
    mock_incident = MagicMock(
        id="TKT-230101-123456789", type="incident_type", description="Incident description",
        contact='""', user_issuer_id="user123", user_issuer_name="Test User",
        createdAt=datetime(2024, 1, 1, 0, 0, 0), updatedAt=datetime(2024, 1, 1, 0, 0, 0)
    )
    mocker.patch('ServicioIncidente.commands.incident_create.CreateIncident.execute', return_value=mock_incident)
    
    headers = generate_headers()
    data = {'type': 'incident_type', 'description': 'Incident description'}
    
    response = client.post('/api/incidents', json=data, headers=headers)
    assert response.status_code == 201

def test_create_incident_invalid_params(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    response = client.post('/api/incidents', json={}, headers=headers)
    assert response.status_code == 400

def test_create_incident_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_create.CreateIncident.execute', side_effect=Exception("Database error"))
    
    headers = generate_headers()
    data = {'type': 'incident_type', 'description': 'Incident description'}
    
    response = client.post('/api/incidents', json=data, headers=headers)
    assert response.status_code == 500
    assert 'Create incident failed. Details: Database error' in response.json['error']

def test_create_attachment_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=True)
    mocker.patch('ServicioIncidente.commands.attachment_exists.ExistsAttachment.execute', return_value=False)
    mocker.patch('ServicioIncidente.services.monitor_service.MonitorService.enqueue_event', return_value="")
    
    mock_attachment = MagicMock(
        id="attachment123", file_name="file.jpg", file_uri="http://example.com/file.jpg",
        content_type="image/jpeg", user_attacher_id="user123", user_attacher_name="Test User",
        createdAt=datetime(2024, 1, 1, 0, 0, 0), updatedAt=datetime(2024, 1, 1, 0, 0, 0)
    )
    mocker.patch('ServicioIncidente.commands.attachment_create.CreateAttachment.execute', return_value=mock_attachment)
    
    headers = generate_headers()
    data = {
        'media_id': 'attachment123',
        'media_name': 'file.jpg',
        'media_uri': 'http://example.com/file.jpg',
        'content_type': 'image/jpeg'
    }
    incident_id = 'incident123'
    
    response = client.put(f'/api/incidents/{incident_id}/attachments', json=data, headers=headers)
    assert response.status_code == 201

def test_create_attachment_invalid_params(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    incident_id = 'incident123'
    response = client.put(f'/api/incidents/{incident_id}/attachments', json={}, headers=headers)
    assert response.status_code == 400

def test_create_attachment_incident_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=False)
    
    headers = generate_headers()
    data = {
        'media_id': 'attachment123',
        'media_name': 'file.jpg',
        'media_uri': 'http://example.com/file.jpg',
        'content_type': 'image/jpeg'
    }
    incident_id = 'incident123'
    
    response = client.put(f'/api/incidents/{incident_id}/attachments', json=data, headers=headers)
    assert response.status_code == 404
    assert response.get_data(as_text=True) == "Incident not found"

def test_create_attachment_media_id_exists(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=True)
    mocker.patch('ServicioIncidente.commands.attachment_exists.ExistsAttachment.execute', return_value=True)
    
    headers = generate_headers()
    data = {
        'media_id': 'attachment123',
        'media_name': 'file.jpg',
        'media_uri': 'http://example.com/file.jpg',
        'content_type': 'image/jpeg'
    }
    incident_id = 'incident123'
    
    response = client.put(f'/api/incidents/{incident_id}/attachments', json=data, headers=headers)
    assert response.status_code == 400
    assert response.get_data(as_text=True) == "Media id already exists"

def test_create_attachment_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=True)
    mocker.patch('ServicioIncidente.commands.attachment_exists.ExistsAttachment.execute', return_value=False)
    mocker.patch('ServicioIncidente.commands.attachment_create.CreateAttachment.execute', side_effect=Exception("Database error"))
    
    headers = generate_headers()
    data = {
        'media_id': 'attachment123',
        'media_name': 'file.jpg',
        'media_uri': 'http://example.com/file.jpg',
        'content_type': 'image/jpeg'
    }
    incident_id = 'incident123'
    
    response = client.put(f'/api/incidents/{incident_id}/attachments', json=data, headers=headers)
    assert response.status_code == 500
    assert 'Create attachment failed. Details: Database error' in response.json['error']

def test_get_all_incidents_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mock_incident = MagicMock(
        id="incident123", type="type1", description="Test description",
        contact=json.dumps({"email": "test@example.com"}), user_issuer_id="user123",
        user_issuer_name="John Doe", createdAt=datetime(2024, 1, 1, 0, 0, 0),
        updatedAt=datetime(2024, 1, 1, 0, 0, 0), attachments=[]
    )
    mocker.patch('ServicioIncidente.commands.incident_get_all.GetAllIncidents.execute', return_value=[mock_incident])
    response = client.get('/api/incidents', headers=headers)
    assert response.status_code == 200

def test_get_all_incidents_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_get_all.GetAllIncidents.execute', side_effect=Exception("Database error"))
    response = client.get('/api/incidents', headers=headers)
    assert response.status_code == 500
    assert 'Get all incidents failed. Details: Database error' in response.json['error']

def test_get_incident_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_get.GetIncident.execute', return_value=None)
    response = client.get('/api/incidents/incident123', headers=headers)
    assert response.status_code == 404
    assert response.get_data(as_text=True) == "Incident not found"

def test_get_incident_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_get.GetIncident.execute', side_effect=Exception("Database error"))
    response = client.get('/api/incidents/incident123', headers=headers)
    assert response.status_code == 500
    assert 'Get incident failed. Details: Database error' in response.json['error']

def test_get_incidents_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mock_incident = MagicMock(
        id="incident123", type="type1", description="Test description",
        contact=json.dumps({"email": "test@example.com"}), user_issuer_id="user123",
        user_issuer_name="John Doe", createdAt=datetime(2024, 1, 1, 0, 0, 0),
        updatedAt=datetime(2024, 1, 1, 0, 0, 0), attachments=[]
    )
    mocker.patch('ServicioIncidente.commands.incident_get.GetIncident.execute', return_value=mock_incident)
    response = client.get('/api/incidents/incident123', headers=headers)
    assert response.status_code == 200

def test_update_incident_invalid_description(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    data = {'description': ''}
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 400

def test_update_incident_invalid_contact_format(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    data = {'contact': 'invalid_contact_format'}
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 400

def test_update_incident_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', side_effect=ValueError("Incident not found"))
    data = {'type': 'new_type', 'description': 'Updated description'}
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 400

def test_update_incident_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    mock_incident = MagicMock(
        id="incident123", type="type1", description="Test description",
        contact="{\"email\": \"test@example.com\"}", user_issuer_id="user123",
        user_issuer_name="John Doe", createdAt=datetime(2024, 1, 1, 0, 0, 0),
        updatedAt=datetime(2024, 1, 1, 0, 0, 0), attachments=[]
    )

    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', return_value=mock_incident)
    data = {'type': 'new_type', 'description': 'Updated description', 'contact':'{"email": "test@example.com"}'},
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 500

def test_update_incident_generic_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', side_effect=Exception("Unexpected error"))
    data = {'type': 'new_type', 'description': 'Updated description'}
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 500

def test_create_incident_missing_fields(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    data = {"description": "Incident description"}
    response = client.post('/api/incidents', json=data, headers=headers)
    assert response.status_code == 400

def test_create_incident_invalid_contact_format(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    data = {
        "type": "incident_type",
        "description": "Incident description",
        "contact": "invalid_format"
    }
    response = client.post('/api/incidents', json=data, headers=headers)
    assert response.status_code == 500

def test_create_incident_db_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_create.CreateIncident.execute', side_effect=Exception("DB error"))
    data = {"type": "incident_type", "description": "Incident description"}
    response = client.post('/api/incidents', json=data, headers=headers)
    assert response.status_code == 500

def test_create_attachment_incident_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=False)
    data = {
        "media_id": "attachment123",
        "media_name": "file.jpg",
        "media_uri": "http://example.com/file.jpg",
        "content_type": "image/jpeg"
    }
    response = client.put('/api/incidents/incident123/attachments', json=data, headers=headers)
    assert response.status_code == 404

def test_create_attachment_media_id_exists(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=True)
    mocker.patch('ServicioIncidente.commands.attachment_exists.ExistsAttachment.execute', return_value=True)
    data = {
        "media_id": "attachment123",
        "media_name": "file.jpg",
        "media_uri": "http://example.com/file.jpg",
        "content_type": "image/jpeg"
    }
    response = client.put('/api/incidents/incident123/attachments', json=data, headers=headers)
    assert response.status_code == 400

def test_get_all_incidents_db_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_get_all.GetAllIncidents.execute', side_effect=Exception("DB error"))
    response = client.get('/api/incidents')
    assert response.status_code == 500

def test_update_incident_invalid_type_description(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    data = {
        "type": "",
        "description": ""
    }
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 400

def test_update_incident_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', side_effect=ValueError("Incident not found"))
    data = {"type": "new_type", "description": "Updated description"}
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 404

def test_update_incident_unexpected_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', side_effect=Exception("Unexpected error"))
    data = {"type": "new_type", "description": "Updated description"}
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 500

def test_get_all_attachments_missing_authorization(client):
    incident_id = 'incident123'
    response = client.get(f'/api/incidents/{incident_id}/attachments')
    assert response.status_code == 401

def test_get_all_attachments_unauthorized(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=None)
    incident_id = 'incident123'
    response = client.get(f'/api/incidents/{incident_id}/attachments', headers=headers)
    assert response.status_code == 401

def test_get_all_attachments_db_error(client, mocker):
    headers = generate_headers()
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.attachment_get_all.GetAllAttachments.execute', side_effect=Exception("DB error"))
    incident_id = 'incident123'
    response = client.get(f'/api/incidents/{incident_id}/attachments', headers=headers)
    assert response.status_code == 500

def test_get_attachment_missing_authorization(client):

    incident_id = 'incident123'
    attachment_id = 'attachment123'
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}')
    assert response.status_code == 401

def test_get_attachment_unauthorized(client, mocker):

    headers = generate_headers()
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=None)
    incident_id = 'incident123'
    attachment_id = 'attachment123'
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)
    assert response.status_code == 401

def test_get_attachment_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.attachment_get.GetAttachment.execute', return_value=None)
    incident_id = 'incident123'
    attachment_id = 'nonexistent_attachment'
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)
    assert response.status_code == 404

def test_get_attachment_db_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mocker.patch('ServicioIncidente.commands.attachment_get.GetAttachment.execute', side_effect=Exception("DB error"))
    incident_id = 'incident123'
    attachment_id = 'attachment123'
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)
    assert response.status_code == 500

def test_get_all_attachments_success(client, mocker):

    headers = generate_headers()
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mock_attachment_1 = MagicMock(id="attachment123", file_name="file1.jpg", file_uri="http://example.com/file1.jpg",
                                  content_type="image/jpeg", user_attacher_id="user123", user_attacher_name="Test User",
                                  createdAt="2024-01-01T00:00:00Z", updatedAt="2024-01-01T00:00:00Z")
    mock_attachment_2 = MagicMock(id="attachment124", file_name="file2.jpg", file_uri="http://example.com/file2.jpg",
                                  content_type="image/jpeg", user_attacher_id="user123", user_attacher_name="Test User",
                                  createdAt="2024-01-02T00:00:00Z", updatedAt="2024-01-02T00:00:00Z")
    mocker.patch('ServicioIncidente.commands.attachment_get_all.GetAllAttachments.execute', return_value=[mock_attachment_1, mock_attachment_2])
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    incident_id = 'incident123'
    response = client.get(f'/api/incidents/{incident_id}/attachments', headers=headers)

    assert response.status_code == 200
    assert response.json == [
        {
            "id": mock_attachment_1.id,
            "file_name": mock_attachment_1.file_name,
            "file_uri": mock_attachment_1.file_uri,
            "content_type": mock_attachment_1.content_type,
            "user_attacher_id": mock_attachment_1.user_attacher_id,
            "user_attacher_name": mock_attachment_1.user_attacher_name,
            "createdAt": mock_attachment_1.createdAt,
            "updatedAt": mock_attachment_1.updatedAt
        },
        {
            "id": mock_attachment_2.id,
            "file_name": mock_attachment_2.file_name,
            "file_uri": mock_attachment_2.file_uri,
            "content_type": mock_attachment_2.content_type,
            "user_attacher_id": mock_attachment_2.user_attacher_id,
            "user_attacher_name": mock_attachment_2.user_attacher_name,
            "createdAt": mock_attachment_2.createdAt,
            "updatedAt": mock_attachment_2.updatedAt
        }
    ]

def test_get_attachment_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    headers = generate_headers()
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mock_attachment = MagicMock(id="attachment123", file_name="file1.jpg", file_uri="http://example.com/file1.jpg",
                                content_type="image/jpeg", user_attacher_id="user123", user_attacher_name="Test User",
                                createdAt="2024-01-01T00:00:00Z", updatedAt="2024-01-01T00:00:00Z")
    mocker.patch('ServicioIncidente.commands.attachment_get.GetAttachment.execute', return_value=mock_attachment)
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    incident_id = 'incident123'
    attachment_id = 'attachment123'
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)

    assert response.status_code == 500

def test_create_incident_with_attachments(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.services.monitor_service.MonitorService.enqueue_event', return_value="")

    mocker.patch('ServicioIncidente.commands.attachment_exists.ExistsAttachment.execute', return_value=False)
    
    mock_incident = MagicMock(
        id="TKT-230101-123456789", type="incident_type", description="Incident description",
        contact='""', user_issuer_id="user123", user_issuer_name="Test User",
        createdAt=datetime(2024, 1, 1, 0, 0, 0), updatedAt=datetime(2024, 1, 1, 0, 0, 0)
    )
    mocker.patch('ServicioIncidente.commands.incident_create.CreateIncident.execute', return_value=mock_incident)
    
    mock_attachment = MagicMock(
        id="attachment123", file_name="file.jpg", file_uri="http://example.com/file.jpg",
        content_type="image/jpeg", user_attacher_id="user123", user_attacher_name="Test User",
        createdAt=datetime(2024, 1, 1, 0, 0, 0), updatedAt=datetime(2024, 1, 1, 0, 0, 0)
    )
    mocker.patch('ServicioIncidente.commands.attachment_create.CreateAttachment.execute', return_value=mock_attachment)
    
    headers = generate_headers()
    data = {
        'type': 'incident_type',
        'description': 'Incident description',
        'attachments': [
            {
                'id': 'attachment123',
                'content_type': 'image/jpeg',
                'file_uri': 'http://example.com/file.jpg',
                'file_name': 'file.jpg'
            }
        ]
    }

    response = client.post('/api/incidents', json=data, headers=headers)

    assert response.status_code == 201

def test_update_incident_with_contact(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.services.monitor_service.MonitorService.enqueue_event', return_value="")

    mock_incident = MagicMock(
        id="incident123", type="type1", description="Updated description",
        contact='{"phone": "123456789"}', user_issuer_id="user123",
        user_issuer_name="Test User", createdAt=datetime(2024, 1, 1, 0, 0, 0),
        updatedAt=datetime(2024, 1, 1, 0, 0, 0)
    )
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', return_value=mock_incident)

    headers = generate_headers()
    data = {
        "type": "new_type",
        "description": "Updated description",
        "contact": {"phone": "123456789"}
    }

    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 200
    assert response.json['contact'] == {"phone": "123456789"}

def test_update_incident_value_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', side_effect=ValueError("Invalid data"))

    headers = generate_headers()
    data = {
        "type": "new_type",
        "description": "Updated description"
    }

    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    assert response.status_code == 400
    assert "Update incident failed. Details: Invalid data" in response.json['error']

def test_get_attachment_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    mock_attachment = MagicMock(
        id="attachment123",
        file_name="file.jpg",
        file_uri="http://example.com/file.jpg",
        content_type="image/jpeg",
        user_attacher_id="user123",
        user_attacher_name="Test User",
        createdAt=datetime(2024, 1, 1, 0, 0, 0),
        updatedAt=datetime(2024, 1, 1, 0, 0, 0)
    )
    mocker.patch('ServicioIncidente.commands.attachment_get.GetAttachment.execute', return_value=mock_attachment)

    headers = generate_headers()
    incident_id = 'incident123'
    attachment_id = 'attachment123'

    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)

    assert response.status_code == 200
    assert response.json == {
        "id": "attachment123",
        "file_name": "file.jpg",
        "file_uri": "http://example.com/file.jpg",
        "content_type": "image/jpeg",
        "user_attacher_id": "user123",
        "user_attacher_name": "Test User",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_create_feedback_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.services.monitor_service.MonitorService.enqueue_event', return_value="")
    mocker.patch('ServicioIncidente.commands.feedback_exists.ExistsFeedback.execute', return_value=False)

    mock_feedback = MagicMock(
        id="feedback123",
        incident_id="incident123",
        support_rating=5,
        ease_of_contact=4,
        resolution_time=3,
        support_staff_attitude=5,
        additional_comments="Great service",
        createdAt=datetime(2024, 1, 1, 0, 0, 0),
        updatedAt=datetime(2024, 1, 1, 0, 0, 0)
    )
    mocker.patch('ServicioIncidente.commands.feedback_create.CreateFeedback.execute', return_value=mock_feedback)

    headers = generate_headers()
    data = {
        "support_rating": 5,
        "ease_of_contact": 4,
        "resolution_time": 3,
        "support_staff_attitude": 5,
        "additional_comments": "Great service"
    }

    response = client.post('/api/incidents/incident123/feedback', json=data, headers=headers)

    assert response.status_code == 201
    assert response.json == {
        "id": "feedback123",
        "incident_id": "incident123",
        "support_rating": 5,
        "ease_of_contact": 4,
        "resolution_time": 3,
        "support_staff_attitude": 5,
        "additional_comments": "Great service",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_create_feedback_already_exists(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioIncidente.commands.feedback_exists.ExistsFeedback.execute', return_value=True)

    headers = generate_headers()
    data = {
        "support_rating": 5,
        "ease_of_contact": 4,
        "resolution_time": 3,
        "support_staff_attitude": 5,
        "additional_comments": "Great service"
    }

    response = client.post('/api/incidents/incident123/feedback', json=data, headers=headers)

    assert response.status_code == 400
    assert response.get_data(as_text=True) == "The feedback incident already exists"

def test_create_feedback_missing_authorization(client):
    data = {
        "support_rating": 5,
        "ease_of_contact": 4,
        "resolution_time": 3,
        "support_staff_attitude": 5,
        "additional_comments": "Great service"
    }

    response = client.post('/api/incidents/incident123/feedback', json=data)

    assert response.status_code == 401
    assert response.json == {"error": "Authorization header missing"}

def test_create_feedback_unauthorized(client, mocker):
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=None)

    headers = generate_headers()
    data = {
        "support_rating": 5,
        "ease_of_contact": 4,
        "resolution_time": 3,
        "support_staff_attitude": 5,
        "additional_comments": "Great service"
    }

    response = client.post('/api/incidents/incident123/feedback', json=data, headers=headers)

    assert response.status_code == 401
    assert response.json == {"error": "Unauthorized"}

def test_get_feedback_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    mock_feedback = MagicMock(
        id="feedback123",
        incident_id="incident123",
        support_rating=5,
        ease_of_contact=4,
        resolution_time=3,
        support_staff_attitude=5,
        additional_comments="Great service",
        createdAt=datetime(2024, 1, 1, 0, 0, 0),
        updatedAt=datetime(2024, 1, 1, 0, 0, 0)
    )
    mocker.patch('ServicioIncidente.commands.feedback_exists.ExistsFeedback.execute', return_value=mock_feedback)

    headers = generate_headers()
    response = client.get('/api/incidents/incident123/feedback', headers=headers)

    assert response.status_code == 200
    assert response.json == {
        "id": "feedback123",
        "incident_id": "incident123",
        "support_rating": 5,
        "ease_of_contact": 4,
        "resolution_time": 3,
        "support_staff_attitude": 5,
        "additional_comments": "Great service",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_get_feedback_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioIncidente.commands.feedback_exists.ExistsFeedback.execute', return_value=None)

    headers = generate_headers()
    response = client.get('/api/incidents/incident123/feedback', headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Feedback not found"}

def test_get_feedback_missing_authorization(client):
    response = client.get('/api/incidents/incident123/feedback')

    assert response.status_code == 401
    assert response.json == {"error": "Authorization header missing"}

def test_get_feedback_unauthorized(client, mocker):
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=None)

    headers = generate_headers()
    response = client.get('/api/incidents/incident123/feedback', headers=headers)

    assert response.status_code == 401
    assert response.json == {"error": "Unauthorized"}

def test_get_feedback_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioIncidente.commands.feedback_exists.ExistsFeedback.execute', side_effect=Exception("Database error"))

    headers = generate_headers()
    response = client.get('/api/incidents/incident123/feedback', headers=headers)

    assert response.status_code == 500
    assert "Failed to get feedback. Details: Database error" in response.json['error']

def test_create_feedback_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "testuser@example.com"}
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioIncidente.commands.feedback_exists.ExistsFeedback.execute', return_value=False)
    mocker.patch('ServicioIncidente.commands.feedback_create.CreateFeedback.execute', side_effect=Exception("Unexpected error during feedback creation"))

    headers = generate_headers()
    data = {
        "support_rating": 5,
        "ease_of_contact": 4,
        "resolution_time": 3,
        "support_staff_attitude": 5,
        "additional_comments": "Great service"
    }

    response = client.post('/api/incidents/incident123/feedback', json=data, headers=headers)

    assert response.status_code == 500
    assert "Failed to create feedback incident feedback. Details: Unexpected error during feedback creation" in response.json['error']
