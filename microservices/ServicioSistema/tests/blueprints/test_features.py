import pytest
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioSistema.blueprints.features.routes import features_bp
from datetime import datetime

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(features_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_get_all_features_success(client, mocker):
    mock_feature = MagicMock()
    mock_feature.id = "feature-1"
    mock_feature.name = "Feature 1"
    mock_feature.description = "Description for Feature 1"
    mock_feature.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_feature.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.features_get_all.GetAllFeatures.execute', return_value=[mock_feature])

    response = client.get('/api/features')

    assert response.status_code == 200
    assert response.json == [{
        "id": "feature-1",
        "name": "Feature 1",
        "description": "Description for Feature 1",
        'price': 1.0,
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }]

def test_get_all_features_error(client, mocker):
    mocker.patch('ServicioSistema.commands.features_get_all.GetAllFeatures.execute', side_effect=Exception("Database error"))

    response = client.get('/api/features')

    assert response.status_code == 500
    assert "Error retrieving features" in response.json['error']
