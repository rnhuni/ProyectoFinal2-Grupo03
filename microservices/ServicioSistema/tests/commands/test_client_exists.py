import pytest
from unittest.mock import MagicMock, patch
from ServicioSistema.commands.client_exists import ExistsClient
from ServicioSistema.models.client import Client
from ServicioSistema.models.model import session

class TestExistsClient:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
    
    def test_exists_client_success(self, mocker):
        test_client_id = "client-1"
        
        mock_client = MagicMock(spec=Client)
        self.mock_query.return_value.get.return_value = mock_client

        command = ExistsClient(test_client_id)
        result = command.execute()

        assert result is True
        self.mock_query.return_value.get.assert_called_once_with(test_client_id)

    def test_exists_client_not_found(self, mocker):
        test_client_id = "client-1"
        
        self.mock_query.return_value.get.return_value = None

        command = ExistsClient(test_client_id)
        result = command.execute()

        assert result is False
        self.mock_query.return_value.get.assert_called_once_with(test_client_id)

    def test_exists_client_no_id_provided(self):
        command = ExistsClient(None)

        with pytest.raises(ValueError, match="Client ID is required"):
            command.execute()

        self.mock_query.assert_not_called()
