import pytest
from unittest.mock import MagicMock, patch
from ServicioSistema.commands.client_get import GetClient
from ServicioSistema.models.client import Client
from ServicioSistema.models.model import session

class TestGetClient:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_client_success(self, mocker):
        test_client_id = "client-1"
        
        mock_client = MagicMock(spec=Client)
        mock_client.id = test_client_id
        mock_client.name = "Test Client"
        self.mock_query.return_value.get.return_value = mock_client

        command = GetClient(test_client_id)
        client = command.execute()

        assert client.id == test_client_id
        assert client.name == "Test Client"
        self.mock_query.return_value.get.assert_called_once_with(test_client_id)

    def test_get_client_not_found(self, mocker):
        test_client_id = "client-1"
        self.mock_query.return_value.get.return_value = None

        command = GetClient(test_client_id)
        client = command.execute()

        assert client is None
        self.mock_query.return_value.get.assert_called_once_with(test_client_id)

    def test_get_client_no_id_provided(self):
        command = GetClient(None)

        with pytest.raises(ValueError, match="Client ID is required"):
            command.execute()

        self.mock_query.assert_not_called()
