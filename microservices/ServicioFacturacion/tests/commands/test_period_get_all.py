import pytest
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.period_get_all import GetAllPeriods

class TestGetAllPeriods:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_period_query = self.mock_query.return_value

    def test_get_all_periods_success(self):
        mock_periods = [MagicMock(spec=Period), MagicMock(spec=Period), MagicMock(spec=Period)]
        self.mock_period_query.all.return_value = mock_periods

        command = GetAllPeriods()
        result = command.execute()

        assert result == mock_periods
        self.mock_query.assert_called_once_with(Period)
        self.mock_period_query.all.assert_called_once()

    def test_get_all_periods_database_error(self):
        self.mock_period_query.all.side_effect = Exception("Database error")

        command = GetAllPeriods()
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_query.assert_called_once_with(Period)
        self.mock_period_query.all.assert_called_once()