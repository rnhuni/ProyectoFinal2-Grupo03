import pytest
import jwt
import json
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioIncidente.blueprints.incidents.routes import incidents_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(incidents_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_incident_success(client, mocker):
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    
    mock_incident = MagicMock()
    mock_incident.id = "TKT-230101-123456789"
    mock_incident.type = "incident_type"
    mock_incident.description = "Incident description"
    mock_incident.contact = '""'
    mock_incident.user_issuer_id = "user123"
    mock_incident.user_issuer_name = "Test User"
    mock_incident.createdAt = "2024-01-01T00:00:00Z"
    mock_incident.updatedAt = "2024-01-01T00:00:00Z"
    mocker.patch('ServicioIncidente.commands.incident_create.CreateIncident.execute', return_value=mock_incident)
    
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
    data = {
        'type': 'incident_type',
        'description': 'Incident description'
    }
    
    response = client.post('/api/incidents', json=data, headers=headers)
    
    assert response.status_code == 201
    assert response.json == {
        "id": mock_incident.id,
        "type": mock_incident.type,
        "description": mock_incident.description,
        "contact": json.loads(mock_incident.contact),
        "user_issuer_id": mock_incident.user_issuer_id,
        "user_issuer_name": mock_incident.user_issuer_name,
        "createdAt": mock_incident.createdAt,
        "updatedAt": mock_incident.updatedAt
    }

def test_create_incident_invalid_params(client):
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
    data = {}
    
    response = client.post('/api/incidents', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.get_data(as_text=True) == "Invalid parameters"

def test_create_incident_exception(client, mocker):
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_create.CreateIncident.execute', side_effect=Exception("Database error"))
    
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
    data = {
        'type': 'incident_type',
        'description': 'Incident description'
    }
    
    response = client.post('/api/incidents', json=data, headers=headers)
    
    assert response.status_code == 500
    assert 'Create incident failed. Details: Database error' in response.json['error']

def test_create_attachment_success(client, mocker):
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=True)
    mocker.patch('ServicioIncidente.commands.attachment_exists.ExistsAttachment.execute', return_value=False)
    
    mock_attachment = MagicMock()
    mock_attachment.id = "attachment123"
    mock_attachment.file_name = "file.jpg"
    mock_attachment.file_uri = "http://example.com/file.jpg"
    mock_attachment.content_type = "image/jpeg"
    mock_attachment.user_attacher_id = "user123"
    mock_attachment.user_attacher_name = "Test User"
    mock_attachment.createdAt = "2024-01-01T00:00:00Z"
    mock_attachment.updatedAt = "2024-01-01T00:00:00Z"
    mocker.patch('ServicioIncidente.commands.attachment_create.CreateAttachment.execute', return_value=mock_attachment)
    
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
    data = {
        'media_id': 'attachment123',
        'media_name': 'file.jpg',
        'media_uri': 'http://example.com/file.jpg',
        'content_type': 'image/jpeg'
    }
    incident_id = 'incident123'
    
    response = client.put(f'/api/incidents/{incident_id}/attachments', json=data, headers=headers)
    
    assert response.status_code == 201
    assert response.json == {
        "id": mock_attachment.id,
        "name": mock_attachment.file_name,
        "uri": mock_attachment.file_uri,
        "content_type": mock_attachment.content_type,
        "user_attacher_id": mock_attachment.user_attacher_id,
        "user_attacher_name": mock_attachment.user_attacher_name,
        "createdAt": mock_attachment.createdAt,
        "updatedAt": mock_attachment.updatedAt
    }

def test_create_attachment_invalid_params(client):
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
    data = {}
    incident_id = 'incident123'
    
    response = client.put(f'/api/incidents/{incident_id}/attachments', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.get_data(as_text=True) == "Invalid parameters"

def test_create_attachment_incident_not_found(client, mocker):
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=False)
    
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
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=True)
    mocker.patch('ServicioIncidente.commands.attachment_exists.ExistsAttachment.execute', return_value=True)
    
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
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioIncidente.commands.incident_exists.ExistsIncident.execute', return_value=True)
    mocker.patch('ServicioIncidente.commands.attachment_exists.ExistsAttachment.execute', return_value=False)
    mocker.patch('ServicioIncidente.commands.attachment_create.CreateAttachment.execute', side_effect=Exception("Database error"))
    
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
