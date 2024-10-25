import pytest
from unittest.mock import MagicMock, patch
from ServicioSistema.commands.client_get_all import GetAllClients
from ServicioSistema.models.client import Client
from ServicioSistema.models.model import session

class TestGetAllClients:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_all_clients_success(self, mocker):
        mock_client_1 = MagicMock(spec=Client)
        mock_client_1.id = "client-1"
        mock_client_1.name = "Client 1"

        mock_client_2 = MagicMock(spec=Client)
        mock_client_2.id = "client-2"
        mock_client_2.name = "Client 2"

        self.mock_query.return_value.all.return_value = [mock_client_1, mock_client_2]

        command = GetAllClients()
        clients = command.execute()

        assert len(clients) == 2
        assert clients[0].id == "client-1"
        assert clients[1].id == "client-2"
        self.mock_query.return_value.all.assert_called_once()

    def test_get_all_clients_empty(self, mocker):
        self.mock_query.return_value.all.return_value = []

        command = GetAllClients()
        clients = command.execute()

        assert clients == []
        self.mock_query.return_value.all.assert_called_once()
