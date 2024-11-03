import pytest
from unittest.mock import patch, MagicMock
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.active_subscription import ActiveSubscription
from ServicioFacturacion.commands.active_subscription_get_all import GetAllSubscriptions

class TestGetAllSubscriptions:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_all_subscriptions_success(self):
        mock_subscription1 = MagicMock(spec=ActiveSubscription)
        mock_subscription2 = MagicMock(spec=ActiveSubscription)
        self.mock_query.return_value.all.return_value = [mock_subscription1, mock_subscription2]

        command = GetAllSubscriptions()
        result = command.execute()

        self.mock_query.assert_called_once_with(ActiveSubscription)
        self.mock_query.return_value.all.assert_called_once()
        assert result == [mock_subscription1, mock_subscription2]
        assert len(result) == 2

    def test_get_all_subscriptions_empty(self):
        self.mock_query.return_value.all.return_value = []

        command = GetAllSubscriptions()
        result = command.execute()

        self.mock_query.assert_called_once_with(ActiveSubscription)
        self.mock_query.return_value.all.assert_called_once()
        assert result == []
        assert len(result) == 0