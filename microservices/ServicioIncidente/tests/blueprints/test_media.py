import pytest
from flask import Flask
from unittest.mock import patch, MagicMock, ANY
from ServicioIncidente.blueprints.media.routes import media_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(media_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_upload_url_success(client, mocker):
    mock_generate_upload_url = mocker.patch(
        'ServicioIncidente.services.s3.S3Service.generate_upload_url',
        return_value='http://example.com/upload-url'
    )

    mocker.patch('uuid.uuid4', return_value='123e4567-e89b-12d3-a456-426614174000')

    data = {
        'content_type': 'image/jpeg',
        'file_name': 'test.jpg'
    }

    response = client.post('/api/media/upload-url', json=data)

    assert response.status_code == 200
    assert response.json == {
        "media_id": '123e4567-e89b-12d3-a456-426614174000',
        "media_name": 'test.jpg',
        "content_type": 'image/jpeg',
        "upload_url": 'http://example.com/upload-url'
    }

    mock_generate_upload_url.assert_called_once_with(
        '123e4567-e89b-12d3-a456-426614174000',
        'test.jpg',
        'image/jpeg',
        3600
    )

def test_create_upload_url_invalid_params(client):
    data = {}

    response = client.post('/api/media/upload-url', json=data)

    assert response.status_code == 400
    assert response.get_data(as_text=True) == "Invalid parameters"

def test_create_upload_url_exception(client, mocker):
    mocker.patch(
        'ServicioIncidente.services.s3.S3Service.generate_upload_url',
        side_effect=Exception('S3 error')
    )

    data = {
        'content_type': 'image/jpeg',
        'file_name': 'test.jpg'
    }

    response = client.post('/api/media/upload-url', json=data)

    assert response.status_code == 500
    assert 'Create upload url failed. Details: S3 error' in response.json['error']

def test_create_download_url_success(client, mocker):
    mock_generate_download_url = mocker.patch(
        'ServicioIncidente.services.s3.S3Service.generate_download_url',
        return_value='http://example.com/download-url'
    )

    data = {
        'media_id': '123e4567-e89b-12d3-a456-426614174000'
    }

    response = client.post('/api/media/download-url', json=data)

    assert response.status_code == 200
    assert response.get_data(as_text=True) == 'http://example.com/download-url'

    mock_generate_download_url.assert_called_once_with(
        '123e4567-e89b-12d3-a456-426614174000',
        3600
    )

def test_create_download_url_invalid_params(client):
    data = {}

    response = client.post('/api/media/download-url', json=data)

    assert response.status_code == 400
    assert response.get_data(as_text=True) == "Invalid parameters"

def test_create_download_url_exception(client, mocker):
    mocker.patch(
        'ServicioIncidente.services.s3.S3Service.generate_download_url',
        side_effect=Exception('S3 error')
    )

    data = {
        'media_id': '123e4567-e89b-12d3-a456-426614174000'
    }

    response = client.post('/api/media/download-url', json=data)

    assert response.status_code == 500
