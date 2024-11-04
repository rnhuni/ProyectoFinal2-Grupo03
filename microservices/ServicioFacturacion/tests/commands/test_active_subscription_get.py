import pytest
from unittest.mock import patch, MagicMock
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.active_subscription import ActiveSubscription
from ServicioFacturacion.commands.active_subscription_get import GetActiveSubscription

class TestGetActiveSubscription:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_active_subscription_by_id(self):
        mock_subscription = MagicMock(spec=ActiveSubscription)
        self.mock_query.return_value.get.return_value = mock_subscription

        command = GetActiveSubscription(id="test-id")
        result = command.execute()

        self.mock_query.assert_called_once_with(ActiveSubscription)
        self.mock_query.return_value.get.assert_called_once_with("test-id")
        assert result == mock_subscription

    def test_get_active_subscription_by_client_id_and_status(self):
        mock_subscription = MagicMock(spec=ActiveSubscription)
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_subscription

        command = GetActiveSubscription(client_id="client-1", status="active")
        result = command.execute()

        self.mock_query.assert_called_once_with(ActiveSubscription)
        self.mock_query.return_value.filter_by.assert_called_once_with(client_id="client-1", status="active")
        self.mock_query.return_value.filter_by.return_value.first.assert_called_once()
        assert result == mock_subscription

    def test_get_active_subscription_invalid_data(self):
        command = GetActiveSubscription()
        with pytest.raises(ValueError, match="Invalid data provided"):
            command.execute()

        self.mock_query.assert_not_called()

    def test_get_active_subscription_does_not_exist_by_id(self):
        self.mock_query.return_value.get.return_value = None

        command = GetActiveSubscription(id="nonexistent-id")
        result = command.execute()

        self.mock_query.assert_called_once_with(ActiveSubscription)
        self.mock_query.return_value.get.assert_called_once_with("nonexistent-id")
        assert result is None

    def test_get_active_subscription_does_not_exist_by_client_id_and_status(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        command = GetActiveSubscription(client_id="client-1", status="inactive")
        result = command.execute()

        self.mock_query.assert_called_once_with(ActiveSubscription)
        self.mock_query.return_value.filter_by.assert_called_once_with(client_id="client-1", status="inactive")
        self.mock_query.return_value.filter_by.return_value.first.assert_called_once()
        assert result is None