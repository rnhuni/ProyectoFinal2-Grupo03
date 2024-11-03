import pytest
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.period_get import GetPeriod

class TestGetPeriod:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_period_query = self.mock_query.return_value.filter_by.return_value

    def test_get_period_by_id(self):
        period_id = "test-id"
        mock_period = MagicMock(spec=Period)
        self.mock_query.return_value.get.return_value = mock_period

        command = GetPeriod(id=period_id)
        result = command.execute()

        assert result == mock_period
        self.mock_query.assert_called_once_with(Period)
        self.mock_query.return_value.get.assert_called_once_with(period_id)

    def test_get_period_by_client_id_and_date(self):
        client_id = "client-1"
        period_date = "2024-01-01"
        mock_period = MagicMock(spec=Period)
        self.mock_period_query.first.return_value = mock_period

        command = GetPeriod(client_id=client_id, period_date=period_date)
        result = command.execute()

        assert result == mock_period
        self.mock_query.assert_called_once_with(Period)
        self.mock_query.return_value.filter_by.assert_called_once_with(client_id=client_id, date=period_date)
        self.mock_period_query.first.assert_called_once()

    def test_get_period_by_client_id_and_status(self):
        client_id = "client-1"
        status = "active"
        mock_periods = [MagicMock(spec=Period), MagicMock(spec=Period)]
        self.mock_period_query.all.return_value = mock_periods

        command = GetPeriod(client_id=client_id, status=status)
        result = command.execute()

        assert result == mock_periods
        self.mock_query.assert_called_once_with(Period)
        self.mock_query.return_value.filter_by.assert_called_once_with(client_id=client_id, status=status)
        self.mock_period_query.all.assert_called_once()

    def test_get_period_invalid_data(self):
        command = GetPeriod()

        with pytest.raises(ValueError, match="Invalid data provided"):
            command.execute()