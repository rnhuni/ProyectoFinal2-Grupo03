import pytest
import jwt
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioCanal.blueprints.templates.routes import templates_bp
from datetime import datetime

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(templates_bp, url_prefix='/api')
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

def test_get_all_templates_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    mock_template = MagicMock()
    mock_template.id = 1
    mock_template.content_type = "text/html"
    mock_template.body = "<p>Template content</p>"
    mock_template.auto_trigger = False
    mock_template.status = "ENABLED"
    mock_template.trigger_event = "on_event"
    mock_template.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_template.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    
    mocker.patch('ServicioCanal.commands.template_get_all.GetAllTemplates.execute', return_value=[mock_template])

    headers = generate_headers()
    response = client.get('/api/templates', headers=headers)

    assert response.status_code == 200
    assert response.json == [
        {
            "id": "1",
            "content_type": "text/html",
            "body": "<p>Template content</p>",
            "auto_trigger": False,
            "status": "ENABLED",
            "trigger_event": "on_event",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-02T00:00:00"
        }
    ]

def test_get_all_templates_exception(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.template_get_all.GetAllTemplates.execute', side_effect=Exception("DB error"))

    headers = generate_headers()
    response = client.get('/api/templates', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving templates" in response.json['error']

def test_get_template_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    mock_template = MagicMock()
    mock_template.id = 1
    mock_template.content_type = "text/html"
    mock_template.body = "<p>Template content</p>"
    mock_template.auto_trigger = False
    mock_template.status = "ENABLED"
    mock_template.trigger_event = "on_event"
    mock_template.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_template.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    
    mocker.patch('ServicioCanal.commands.template_get.GetTemplate.execute', return_value=mock_template)

    headers = generate_headers()
    response = client.get('/api/templates/1', headers=headers)

    assert response.status_code == 200
    assert response.json == {
        "id": "1",
        "content_type": "text/html",
        "body": "<p>Template content</p>",
        "auto_trigger": False,
        "status": "ENABLED",
        "trigger_event": "on_event",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-02T00:00:00"
    }

def test_get_template_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioCanal.commands.template_get.GetTemplate.execute', return_value=None)

    headers = generate_headers()
    response = client.get('/api/templates/1', headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Template not found"}

def test_get_template_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.template_get.GetTemplate.execute', side_effect=Exception("Database connection failed"))

    headers = generate_headers()
    response = client.get('/api/templates/1', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving template" in response.json['error']

def test_create_template_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    mock_template = MagicMock()
    mock_template.id = 1
    mock_template.content_type = "text/html"
    mock_template.body = "<p>Template content</p>"
    mock_template.auto_trigger = False
    mock_template.status = "ENABLED"
    mock_template.trigger_event = "on_event"
    mock_template.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_template.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    mocker.patch('ServicioCanal.commands.template_create.CreateTemplate.execute', return_value=mock_template)

    headers = generate_headers()
    data = {
        "name": "Test Template",
        "content_type": "text/html",
        "body": "<p>Template content</p>",
        "auto_trigger": False,
        "status": "ENABLED",
        "trigger_event": "on_event"
    }
    response = client.post('/api/templates', json=data, headers=headers)

    assert response.status_code == 201
    assert response.json == [
        {
            "id": "1",
            "content_type": "text/html",
            "body": "<p>Template content</p>",
            "auto_trigger": False,
            "status": "ENABLED",
            "trigger_event": "on_event",
            "created_at": "2024-01-01T00:00:00",
            "updated_at": "2024-01-02T00:00:00"
        }
    ]

def test_create_template_invalid_parameters(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    data = {
        "content_type": "text/html",
        "body": "<p>Template content</p>"
    }
    response = client.post('/api/templates', json=data, headers=headers)

    assert response.status_code == 400
    assert response.json == {"error": "Missing required fields: 'name'"}

def test_create_template_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioCanal.commands.template_create.CreateTemplate.execute', side_effect=Exception("Database error"))

    headers = generate_headers()
    data = {
        "name": "Test Template",
        "content_type": "text/html",
        "body": "<p>Template content</p>",
        "auto_trigger": False,
        "status": "ENABLED",
        "trigger_event": "on_event"
    }
    response = client.post('/api/templates', json=data, headers=headers)

    assert response.status_code == 500
    assert "Error creating template" in response.json['error']

def test_create_template_invalid_json_payload(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    response = client.post('/api/templates', json='', headers=headers)

    assert response.status_code == 400
    assert response.json == {"error": "Invalid JSON payload"}

def test_create_template_missing_parameters(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    headers = generate_headers()

    data_missing_name = {
        "content_type": "text/html",
        "body": "<p>Template content</p>",
        "auto_trigger": False,
        "status": "ENABLED",
        "trigger_event": "on_event"
    }
    response_missing_name = client.post('/api/templates', json=data_missing_name, headers=headers)
    assert response_missing_name.status_code == 400
    assert response_missing_name.json == {"error": "Missing required fields: 'name'"}

    data_missing_body = {
        "name": "Test Template",
        "content_type": "text/html",
        "auto_trigger": False,
        "status": "ENABLED",
        "trigger_event": "on_event"
    }
    response_missing_body = client.post('/api/templates', json=data_missing_body, headers=headers)
    assert response_missing_body.status_code == 400
    assert response_missing_body.json == {"error": "Invalid parameters"}

    data_missing_content_type = {
        "name": "Test Template",
        "body": "<p>Template content</p>",
        "auto_trigger": False,
        "status": "ENABLED",
        "trigger_event": "on_event"
    }
    response_missing_content_type = client.post('/api/templates', json=data_missing_content_type, headers=headers)
    assert response_missing_content_type.status_code == 400
    assert response_missing_content_type.json == {"error": "Invalid parameters"}

def test_edit_template_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    mock_template = MagicMock()
    mock_template.id = 1
    mock_template.content_type = "text/html"
    mock_template.body = "<p>Old content</p>"
    mock_template.auto_trigger = False
    mock_template.status = "DISABLED"
    mock_template.trigger_event = "on_event"
    mock_template.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_template.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    mocker.patch('ServicioCanal.commands.template_get.GetTemplate.execute', return_value=mock_template)

    updated_template = MagicMock()
    updated_template.id = 1
    updated_template.content_type = "text/html"
    updated_template.body = "<p>Updated content</p>"
    updated_template.auto_trigger = True
    updated_template.status = "ENABLED"
    updated_template.trigger_event = "on_new_event"
    updated_template.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    updated_template.updatedAt = datetime(2024, 1, 3, 0, 0, 0)
    mocker.patch('ServicioCanal.commands.template_update.UpdateTemplate.execute', return_value=updated_template)

    headers = generate_headers()
    data = {
        "name": "Updated Template",
        "content_type": "text/html",
        "body": "<p>Updated content</p>",
        "auto_trigger": True,
        "status": "ENABLED",
        "trigger_event": "on_new_event"
    }
    response = client.put('/api/templates/1', json=data, headers=headers)

    assert response.status_code == 200
    assert response.json == {
        "id": "1",
        "content_type": "text/html",
        "body": "<p>Updated content</p>",
        "auto_trigger": True,
        "status": "ENABLED",
        "trigger_event": "on_new_event",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-03T00:00:00"
    }

def test_edit_template_missing_parameters(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    headers = generate_headers()
    data = {
        "name": "Updated Template",
        "body": "<p>Updated content</p>"
    }
    response = client.put('/api/templates/1', json=data, headers=headers)

    assert response.status_code == 400
    assert response.json == {"error": "Invalid parameters"}

def test_edit_template_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioCanal.commands.template_get.GetTemplate.execute', return_value=None)

    headers = generate_headers()
    data = {
        "name": "Updated Template",
        "content_type": "text/html",
        "body": "<p>Updated content</p>",
        "auto_trigger": True,
        "status": "ENABLED",
        "trigger_event": "on_new_event"
    }
    response = client.put('/api/templates/1', json=data, headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Session not found"}

def test_edit_template_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioCanal.blueprints.templates.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioCanal.commands.template_get.GetTemplate.execute', side_effect=Exception("Database error"))

    headers = generate_headers()
    data = {
        "name": "Updated Template",
        "content_type": "text/html",
        "body": "<p>Updated content</p>",
        "auto_trigger": True,
        "status": "ENABLED",
        "trigger_event": "on_new_event"
    }
    response = client.put('/api/templates/1', json=data, headers=headers)

    assert response.status_code == 500
    assert "Error updating template" in response.json['error']
