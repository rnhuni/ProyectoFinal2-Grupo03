import pytest
import jwt
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioMonitoreoNegocio.blueprints.logs.routes import logs_bp
from datetime import datetime

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(logs_bp, url_prefix='/api')
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

def test_get_all_logs_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioMonitoreoNegocio.blueprints.logs.routes.decode_user', return_value=mock_user)

    mock_log = MagicMock()
    mock_log.id = 1
    mock_log.source_id = "source123"
    mock_log.source_name = "Test Source"
    mock_log.source_type = "Type"
    mock_log.event_type = "INFO"
    mock_log.event_content = "Test Event"
    mock_log.createdAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioMonitoreoNegocio.commands.log_get_by_filters.GetLogs.execute', return_value=[mock_log])

    headers = generate_headers()
    response = client.get('/api/logs', headers=headers)

    assert response.status_code == 200
    assert response.json == [
        {
            "id": 1,
            "source_id": "source123",
            "source_name": "Test Source",
            "source_type": "Type",
            "event_type": "INFO",
            "event_content": "Test Event",
            "created_at": "2024-01-01T00:00:00"
        }
    ]

def test_get_all_logs_invalid_parameters(client, mocker):
    headers = generate_headers()
    response = client.get('/api/logs?start_date=invalid_date', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving logs" in response.json['error']

def test_get_all_logs_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioMonitoreoNegocio.blueprints.logs.routes.decode_user', return_value=mock_user)
    mocker.patch('ServicioMonitoreoNegocio.commands.log_get_by_filters.GetLogs.execute', side_effect=Exception("Database error"))

    headers = generate_headers()
    response = client.get('/api/logs', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving logs" in response.json['error']

def test_create_report_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioMonitoreoNegocio.blueprints.logs.routes.decode_user', return_value=mock_user)

    mock_task = MagicMock()
    mock_task.id = "task123"
    mock_task.filters = '{"source_id":"source123"}'
    mock_task.status = "PENDING"
    mock_task.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mocker.patch('ServicioMonitoreoNegocio.commands.task_create.CreateTask.execute', return_value=mock_task)

    mocker.patch('ServicioMonitoreoNegocio.services.task_service.TaskService.enqueue_task')

    headers = generate_headers()
    data = {
        "source_id": "source123",
        "event_type": "ERROR",
        "start_date": "2024-01-01T00:00:00",
        "end_date": "2024-01-02T00:00:00"
    }
    response = client.post('/api/logs/report', json=data, headers=headers)

    assert response.status_code == 201
    assert response.json == {
        "id": "task123",
        "filters": '{"source_id":"source123"}',
        "status": "PENDING",
        "created_at": "2024-01-01T00:00:00"
    }

def test_get_report_success(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioMonitoreoNegocio.blueprints.logs.routes.decode_user', return_value=mock_user)

    mock_task = MagicMock()
    mock_task.id = "task123"
    mock_task.filters = '{"source_id":"source123"}'
    mock_task.status = "COMPLETED"
    mock_task.key = "file_key"
    mock_task.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_task.updatedAt = datetime(2024, 1, 2, 0, 0, 0)
    mocker.patch('ServicioMonitoreoNegocio.commands.task_get.GetTask.execute', return_value=mock_task)
    mocker.patch('ServicioMonitoreoNegocio.services.task_service.TaskService.generate_download_url', return_value="http://example.com/download")

    headers = generate_headers()
    response = client.get('/api/logs/report/task123', headers=headers)

    assert response.status_code == 201
    assert response.json == {
        "id": "task123",
        "filters": '{"source_id":"source123"}',
        "status": "COMPLETED",
        "download_url": "http://example.com/download",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-02T00:00:00"
    }

def test_get_report_not_found(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioMonitoreoNegocio.blueprints.logs.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioMonitoreoNegocio.commands.task_get.GetTask.execute', return_value=None)

    headers = generate_headers()
    response = client.get('/api/logs/report/nonexistent', headers=headers)

    assert response.status_code == 404
    assert response.json == {"error": "Task not found"}

def test_get_all_logs_with_dates(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioMonitoreoNegocio.blueprints.logs.routes.decode_user', return_value=mock_user)

    mock_log = MagicMock()
    mock_log.id = 1
    mock_log.source_id = "source123"
    mock_log.source_name = "Test Source"
    mock_log.source_type = "Type"
    mock_log.event_type = "INFO"
    mock_log.event_content = "Test Event"
    mock_log.createdAt = datetime(2024, 1, 1, 12, 0, 0)

    mocker.patch('ServicioMonitoreoNegocio.commands.log_get_by_filters.GetLogs.execute', return_value=[mock_log])

    headers = generate_headers()
    params = {
        "start_date": "2024-01-01T00:00:00",
        "end_date": "2024-01-02T00:00:00",
    }

    response = client.get('/api/logs', headers=headers, query_string=params)

    assert response.status_code == 200
    assert response.json == [
        {
            "id": 1,
            "source_id": "source123",
            "source_name": "Test Source",
            "source_type": "Type",
            "event_type": "INFO",
            "event_content": "Test Event",
            "created_at": "2024-01-01T12:00:00"
        }
    ]

def test_create_report_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioMonitoreoNegocio.blueprints.logs.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioMonitoreoNegocio.commands.task_create.CreateTask.execute', side_effect=Exception("Database connection error"))

    headers = generate_headers()
    data = {
        "source_id": "source123",
        "event_type": "ERROR",
        "start_date": "2024-01-01T00:00:00",
        "end_date": "2024-01-02T00:00:00"
    }

    response = client.post('/api/logs/report', json=data, headers=headers)

    assert response.status_code == 500
    assert "Error retrieving logs" in response.json['error']
    assert "Database connection error" in response.json['error']

def test_get_report_server_error(client, mocker):
    mock_user = {"id": "user123", "name": "Test User", "email": "test@example.com"}
    mocker.patch('ServicioMonitoreoNegocio.blueprints.logs.routes.decode_user', return_value=mock_user)

    mocker.patch('ServicioMonitoreoNegocio.commands.task_get.GetTask.execute', side_effect=Exception("Unexpected error"))

    headers = generate_headers()
    response = client.get('/api/logs/report/task123', headers=headers)

    assert response.status_code == 500
    assert "Error retrieving logs" in response.json['error']
    assert "Unexpected error" in response.json['error']
