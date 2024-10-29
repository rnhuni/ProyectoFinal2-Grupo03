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
    
    assert response.status_code == 500

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
    
    assert response.status_code == 500

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

def test_get_all_incidents_success(client, mocker):
    # Crear un incidente simulado usando MagicMock
    mock_incident = MagicMock()
    mock_incident.id = "incident123"
    mock_incident.type = "type1"
    mock_incident.description = "Test description"
    mock_incident.contact = json.dumps({"email": "test@example.com"})
    mock_incident.user_issuer_id = "user123"
    mock_incident.user_issuer_name = "John Doe"
    mock_incident.createdAt = "2024-01-01T00:00:00Z"
    mock_incident.updatedAt = "2024-01-01T00:00:00Z"
    mock_incident.attachments = []

    # Usar una lista de mocks en lugar de diccionarios
    mocker.patch('ServicioIncidente.commands.incident_get_all.GetAllIncidents.execute', return_value=[mock_incident])

    # Realizar la solicitud
    response = client.get('/api/incidents')

    # Comprobar la respuesta
    assert response.status_code == 200
    assert response.json == [
        {
            "id": mock_incident.id,
            "type": mock_incident.type,
            "description": mock_incident.description,
            "contact": {"email": "test@example.com"},
            "user_issuer_id": mock_incident.user_issuer_id,
            "user_issuer_name": mock_incident.user_issuer_name,
            "createdAt": mock_incident.createdAt,
            "updatedAt": mock_incident.updatedAt,
            "attachments": mock_incident.attachments
        }
    ]

def test_get_all_incidents_exception(client, mocker):
    # Simula una excepción en GetAllIncidents para ver cómo se maneja el error
    mocker.patch('ServicioIncidente.commands.incident_get_all.GetAllIncidents.execute', side_effect=Exception("Database error"))

    response = client.get('/api/incidents')

    assert response.status_code == 500
    assert 'Get all incidents failed. Details: Database error' in response.json['error']

def test_get_incident_not_found(client, mocker):
    # Simula que el incidente no existe
    mocker.patch('ServicioIncidente.commands.incident_get.GetIncident.execute', return_value=None)

    response = client.get('/api/incidents/incident123')

    assert response.status_code == 404
    assert response.get_data(as_text=True) == "Incident not found"

def test_get_incident_exception(client, mocker):
    # Simula una excepción al obtener un incidente específico
    mocker.patch('ServicioIncidente.commands.incident_get.GetIncident.execute', side_effect=Exception("Database error"))

    response = client.get('/api/incidents/incident123')

    assert response.status_code == 500
    assert 'Get incident failed. Details: Database error' in response.json['error']

def test_update_incident_invalid_description(client, mocker):
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
        'description': ''  # Descripción vacía, que es inválida
    }
    response = client.put('/api/incidents/incident123', json=data, headers=headers)

    assert response.status_code == 400

def test_get_incident_with_empty_contact(client, mocker):
    # Crear un incidente simulado usando MagicMock
    mock_incident = MagicMock()
    mock_incident.id = "incident123"
    mock_incident.type = "type1"
    mock_incident.description = "Test description"
    mock_incident.contact = None  # Contacto vacío para cubrir la línea 124
    mock_incident.user_issuer_id = "user123"
    mock_incident.user_issuer_name = "John Doe"
    mock_incident.createdAt = "2024-01-01T00:00:00Z"
    mock_incident.updatedAt = "2024-01-01T00:00:00Z"
    mock_incident.attachments = []

    # Parchear el método GetIncident para que devuelva el incidente simulado
    mocker.patch('ServicioIncidente.commands.incident_get.GetIncident.execute', return_value=mock_incident)

    # Realizar la solicitud
    response = client.get('/api/incidents/incident123')

    # Comprobar la respuesta
    assert response.status_code == 200
    assert response.json == {
        "id": mock_incident.id,
        "type": mock_incident.type,
        "description": mock_incident.description,
        "contact": None,  # Validar que el contacto es None en la respuesta
        "user_issuer_id": mock_incident.user_issuer_id,
        "user_issuer_name": mock_incident.user_issuer_name,
        "createdAt": mock_incident.createdAt,
        "updatedAt": mock_incident.updatedAt,
        "attachments": []
    }

def test_update_incident_invalid_contact_format(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value={
        "id": "user123",
        "name": "Test User"
    })
    
    data = {
        'contact': 'invalid_contact_format'  # Contacto en formato incorrecto (debe ser un diccionario)
    }
    
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json == {"error": "Invalid contact format, must be a dictionary"}

def test_update_incident_not_found(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value={
        "id": "user123",
        "name": "Test User"
    })
    # Simular que el incidente no existe lanzando un ValueError con el mensaje esperado
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', side_effect=ValueError("Incident not found"))
    
    data = {
        'type': 'new_type',
        'description': 'Updated description'
    }
    
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    
    assert response.status_code == 404
    assert response.json == {"error": "Incident not found"}

def test_update_incident_value_error(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value={
        "id": "user123",
        "name": "Test User"
    })
    # Simular otro tipo de ValueError que no sea "Incident not found"
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', side_effect=ValueError("Some other error"))
    
    data = {
        'type': 'new_type',
        'description': 'Updated description'
    }
    
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json == {"error": "Update incident failed. Details: Some other error"}

def test_update_incident_generic_exception(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value={
        "id": "user123",
        "name": "Test User"
    })
    # Simular una excepción genérica al ejecutar la actualización
    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', side_effect=Exception("Unexpected error"))
    
    data = {
        'type': 'new_type',
        'description': 'Updated description'
    }
    
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    
    assert response.status_code == 500
    assert response.json == {"error": "Update incident failed. Details: Unexpected error"}

def test_update_incident_invalid_type(client, mocker):
    headers = generate_headers()
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value={
        "id": "user123",
        "name": "Test User"
    })
    
    data = {
        'type': '',  # Tipo inválido (cadena vacía)
        'description': 'Valid description'
    }
    
    response = client.put('/api/incidents/incident123', json=data, headers=headers)
    
    assert response.status_code == 400
    assert response.json == {"error": "Invalid type parameter"}

def test_get_all_attachments_success(client, mocker):
    # Mockear usuario autenticado
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    # Mockear adjuntos simulados
    attachment_1 = MagicMock(id="attachment123", file_name="file1.jpg", file_uri="http://example.com/file1.jpg",
                             content_type="image/jpeg", user_attacher_id="user123", user_attacher_name="Test User",
                             createdAt="2024-01-01T00:00:00Z", updatedAt="2024-01-01T00:00:00Z")
    attachment_2 = MagicMock(id="attachment124", file_name="file2.jpg", file_uri="http://example.com/file2.jpg",
                             content_type="image/jpeg", user_attacher_id="user123", user_attacher_name="Test User",
                             createdAt="2024-01-02T00:00:00Z", updatedAt="2024-01-02T00:00:00Z")

    mocker.patch('ServicioIncidente.commands.attachment_get_all.GetAllAttachments.execute', return_value=[attachment_1, attachment_2])

    headers = generate_headers()
    incident_id = 'incident123'
    
    response = client.get(f'/api/incidents/{incident_id}/attachments', headers=headers)
    
    assert response.status_code == 200
    assert response.json == [
        {
            "id": attachment_1.id,
            "file_name": attachment_1.file_name,
            "file_uri": attachment_1.file_uri,
            "content_type": attachment_1.content_type,
            "user_attacher_id": attachment_1.user_attacher_id,
            "user_attacher_name": attachment_1.user_attacher_name,
            "createdAt": attachment_1.createdAt,
            "updatedAt": attachment_1.updatedAt
        },
        {
            "id": attachment_2.id,
            "file_name": attachment_2.file_name,
            "file_uri": attachment_2.file_uri,
            "content_type": attachment_2.content_type,
            "user_attacher_id": attachment_2.user_attacher_id,
            "user_attacher_name": attachment_2.user_attacher_name,
            "createdAt": attachment_2.createdAt,
            "updatedAt": attachment_2.updatedAt
        }
    ]

def test_get_attachment_success(client, mocker):
    # Mockear usuario autenticado
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    # Mockear un adjunto simulado
    mock_attachment = MagicMock(id="attachment123", file_name="file1.jpg", file_uri="http://example.com/file1.jpg",
                                content_type="image/jpeg", user_attacher_id="user123", user_attacher_name="Test User",
                                createdAt="2024-01-01T00:00:00Z", updatedAt="2024-01-01T00:00:00Z")

    mocker.patch('ServicioIncidente.commands.attachment_get.GetAttachment.execute', return_value=mock_attachment)

    headers = generate_headers()
    incident_id = 'incident123'
    attachment_id = 'attachment123'
    
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)
    
    assert response.status_code == 200
    assert response.json == {
        "id": mock_attachment.id,
        "file_name": mock_attachment.file_name,
        "file_uri": mock_attachment.file_uri,
        "content_type": mock_attachment.content_type,
        "user_attacher_id": mock_attachment.user_attacher_id,
        "user_attacher_name": mock_attachment.user_attacher_name,
        "createdAt": mock_attachment.createdAt,
        "updatedAt": mock_attachment.updatedAt
    }

def test_get_all_attachments_exception(client, mocker):
    # Mockear usuario autenticado
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    # Simular una excepción en GetAllAttachments
    mocker.patch('ServicioIncidente.commands.attachment_get_all.GetAllAttachments.execute', side_effect=Exception("Database error"))

    headers = generate_headers()
    incident_id = 'incident123'
    
    response = client.get(f'/api/incidents/{incident_id}/attachments', headers=headers)
    
    assert response.status_code == 500
    assert 'Failed to retrieve attachments. Details: Database error' in response.json['error']

def test_get_attachment_not_found(client, mocker):
    # Mockear usuario autenticado
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    
    # Simular que el adjunto no existe
    mocker.patch('ServicioIncidente.commands.attachment_get.GetAttachment.execute', return_value=None)

    headers = generate_headers()
    incident_id = 'incident123'
    attachment_id = 'nonexistent_attachment'
    
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)
    
    assert response.status_code == 404
    assert response.json == {"error": "Attachment not found"}

def test_get_attachment_exception(client, mocker):
    # Mockear usuario autenticado
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)
    
    # Simular una excepción en GetAttachment
    mocker.patch('ServicioIncidente.commands.attachment_get.GetAttachment.execute', side_effect=Exception("Database error"))

    headers = generate_headers()
    incident_id = 'incident123'
    attachment_id = 'attachment123'
    
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)
    
    assert response.status_code == 500
    assert 'Failed to retrieve attachment. Details: Database error' in response.json['error']

def test_get_all_attachments_missing_authorization_header(client):
    # No se proporciona el encabezado de autorización
    incident_id = 'incident123'
    response = client.get(f'/api/incidents/{incident_id}/attachments')

    # Validar que el status es 401 y se muestra el mensaje adecuado
    assert response.status_code == 401
    assert response.json == {"error": "Authorization header missing"}

def test_get_all_attachments_unauthorized_user(client, mocker):
    # Simular un encabezado de autorización, pero el usuario no está autorizado
    headers = generate_headers()
    
    # Simular que `decode_user` devuelve None, indicando un usuario no autorizado
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=None)

    incident_id = 'incident123'
    response = client.get(f'/api/incidents/{incident_id}/attachments', headers=headers)

    # Validar que el status es 401 y se muestra el mensaje adecuado
    assert response.status_code == 401
    assert response.json == {"error": "Unauthorized"}

def test_get_attachment_missing_authorization_header(client):
    # No se proporciona el encabezado de autorización
    incident_id = 'incident123'
    attachment_id = 'attachment123'
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}')

    # Validar que el status es 401 y se muestra el mensaje adecuado
    assert response.status_code == 401
    assert response.json == {"error": "Authorization header missing"}

def test_get_attachment_unauthorized_user(client, mocker):
    # Simular un encabezado de autorización, pero el usuario no está autorizado
    headers = generate_headers()
    
    # Simular que `decode_user` devuelve None, indicando un usuario no autorizado
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=None)

    incident_id = 'incident123'
    attachment_id = 'attachment123'
    response = client.get(f'/api/incidents/{incident_id}/attachments/{attachment_id}', headers=headers)

    # Validar que el status es 401 y se muestra el mensaje adecuado
    assert response.status_code == 401
    assert response.json == {"error": "Unauthorized"}

def test_update_incident_with_contact(client, mocker):
    # Configurar usuario autorizado
    mock_user = {
        "id": "user123",
        "name": "Test User"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    # Mockear el incidente actualizado con un contacto no vacío
    updated_incident = MagicMock()
    updated_incident.id = "incident123"
    updated_incident.type = "type1"
    updated_incident.description = "Updated description"
    updated_incident.contact = '{"phone": "123456789"}'  # Contacto en formato JSON
    updated_incident.user_issuer_id = mock_user["id"]
    updated_incident.user_issuer_name = mock_user["name"]
    updated_incident.createdAt = "2024-01-01T00:00:00Z"
    updated_incident.updatedAt = "2024-01-02T00:00:00Z"

    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', return_value=updated_incident)

    # Realizar la solicitud con un contacto válido
    headers = generate_headers()
    data = {
        'type': 'type1',
        'description': 'Updated description',
        'contact': {'phone': '123456789'}  # Contacto como diccionario
    }

    response = client.put('/api/incidents/incident123', json=data, headers=headers)

    # Verificar respuesta
    assert response.status_code == 200
    assert response.json == {
        "id": updated_incident.id,
        "type": updated_incident.type,
        "description": updated_incident.description,
        "contact": json.loads(updated_incident.contact),  # Se convierte desde JSON
        "user_issuer_id": updated_incident.user_issuer_id,
        "user_issuer_name": updated_incident.user_issuer_name,
        "createdAt": updated_incident.createdAt,
        "updatedAt": updated_incident.updatedAt
    }

def test_update_incident_without_contact(client, mocker):
    # Configurar usuario autorizado
    mock_user = {
        "id": "user123",
        "name": "Test User"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    # Mockear el incidente actualizado con contacto en None
    updated_incident = MagicMock()
    updated_incident.id = "incident123"
    updated_incident.type = "type1"
    updated_incident.description = "Updated description"
    updated_incident.contact = None  # Contacto es None
    updated_incident.user_issuer_id = mock_user["id"]
    updated_incident.user_issuer_name = mock_user["name"]
    updated_incident.createdAt = "2024-01-01T00:00:00Z"
    updated_incident.updatedAt = "2024-01-02T00:00:00Z"

    mocker.patch('ServicioIncidente.commands.incident_update.UpdateIncident.execute', return_value=updated_incident)

    # Realizar la solicitud sin contacto
    headers = generate_headers()
    data = {
        'type': 'type1',
        'description': 'Updated description'
    }

    response = client.put('/api/incidents/incident123', json=data, headers=headers)

    # Verificar respuesta
    assert response.status_code == 200
    assert response.json == {
        "id": updated_incident.id,
        "type": updated_incident.type,
        "description": updated_incident.description,
        "contact": None,  # Contacto es None en la respuesta
        "user_issuer_id": updated_incident.user_issuer_id,
        "user_issuer_name": updated_incident.user_issuer_name,
        "createdAt": updated_incident.createdAt,
        "updatedAt": updated_incident.updatedAt
    }

def test_create_incident_with_non_empty_contact(client, mocker):
    # Mockear usuario autenticado
    mock_user = {
        "id": "user123",
        "name": "Test User",
        "email": "testuser@example.com"
    }
    mocker.patch('ServicioIncidente.blueprints.incidents.routes.decode_user', return_value=mock_user)

    # Mockear el resultado de la creación del incidente
    mock_incident = MagicMock()
    mock_incident.id = "TKT-230101-123456789"
    mock_incident.type = "incident_type"
    mock_incident.description = "Incident description"
    mock_incident.contact = '{"phone": "123456789"}'
    mock_incident.user_issuer_id = "user123"
    mock_incident.user_issuer_name = "Test User"
    mock_incident.createdAt = "2024-01-01T00:00:00Z"
    mock_incident.updatedAt = "2024-01-01T00:00:00Z"
    mocker.patch('ServicioIncidente.commands.incident_create.CreateIncident.execute', return_value=mock_incident)

    headers = generate_headers()
    data = {
        'type': 'incident_type',
        'description': 'Incident description',
        'contact': {'phone': '123456789'}  # Contacto no vacío para activar la línea 31
    }
    
    response = client.post('/api/incidents', json=data, headers=headers)
    
    # Validar respuesta
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
