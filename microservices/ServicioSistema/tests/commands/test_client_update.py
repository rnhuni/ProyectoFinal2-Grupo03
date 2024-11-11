import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.client import Client
from ServicioSistema.commands.client_update import UpdateClient

class TestUpdateClient():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_update_client_success(self):
        mock_client = MagicMock(spec=Client)
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_client

        update_data = {
            "client_id": "client-1",
            "plan_id": "plan-1"
        }

        updated_client = UpdateClient(**update_data).execute()

        self.mock_query.assert_called_once_with(Client)
        self.mock_commit.assert_called_once()
        assert updated_client.active_subscription_plan_id == update_data['plan_id']

    def test_update_client_not_found(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        update_data = {
            "client_id": "non-existent-client",
            "plan_id": "plan-1"
        }

        with pytest.raises(ValueError, match="Client not found"):
            UpdateClient(**update_data).execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()

    def test_update_client_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateClient(None, "plan-1").execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateClient("client-1", None).execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateClient("", "plan-1").execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_not_called()

    def test_update_client_failure_on_commit(self):
        mock_client = MagicMock(spec=Client)
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_client

        self.mock_commit.side_effect = Exception("Commit failed")

        update_data = {
            "client_id": "client-1",
            "plan_id": "plan-1"
        }

        with pytest.raises(Exception, match="Commit failed"):
            UpdateClient(**update_data).execute()

        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()
