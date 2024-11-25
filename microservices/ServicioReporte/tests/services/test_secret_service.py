import pytest
import os
import json
from unittest.mock import patch, MagicMock
from ServicioReporte.services.secret_service import SecretService

class TestSecretService:
    @patch("boto3.client")
    def test_load_secret_to_env_success(self, mock_boto_client):
        mock_secrets_manager = MagicMock()
        mock_boto_client.return_value = mock_secrets_manager

        secret_name = "test-secret"
        region_name = "us-east-1"
        secret_values = json.dumps({
            "DATABASE_USER": "test_user",
            "DATABASE_PASSWORD": "test_password",
            "API_KEY": "test_api_key"
        })

        mock_secrets_manager.get_secret_value.return_value = {
            "SecretString": secret_values
        }

        service = SecretService(secret_name, region_name)
        service.load_secret_to_env()

        # Verify environment variables
        assert os.getenv("DATABASE_USER") == "test_user"
        assert os.getenv("DATABASE_PASSWORD") == "test_password"
        assert os.getenv("API_KEY") == "test_api_key"

        # Verify the boto3 client and get_secret_value calls
        mock_boto_client.assert_called_once_with("secretsmanager", region_name=region_name)
        mock_secrets_manager.get_secret_value.assert_called_once_with(SecretId=secret_name)

    @patch("boto3.client")
    def test_load_secret_to_env_empty_secrets(self, mock_boto_client):
        mock_secrets_manager = MagicMock()
        mock_boto_client.return_value = mock_secrets_manager

        secret_name = "test-secret"
        region_name = "us-east-1"

        mock_secrets_manager.get_secret_value.return_value = {
            "SecretString": None
        }

        service = SecretService(secret_name, region_name)
        service.load_secret_to_env()

        # Verify no environment variables are set
        assert os.getenv("DATABASE_USER") is not None
        assert os.getenv("DATABASE_PASSWORD") is not None

        

  
