import pytest
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.period_exists import ExistsPeriod

class TestExistsPeriod:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_period_query = self.mock_query.return_value.filter_by.return_value

    def test_exists_period_by_id_found(self):
        period_id = "test-id"
        self.mock_query.return_value.get.return_value = True

        command = ExistsPeriod(id=period_id)
        result = command.execute()

        assert result is True
        self.mock_query.assert_called_once_with(Period)
        self.mock_query.return_value.get.assert_called_once_with(period_id)

    def test_exists_period_by_id_not_found(self):
        period_id = "nonexistent-id"
        self.mock_query.return_value.get.return_value = None

        command = ExistsPeriod(id=period_id)
        result = command.execute()

        assert result is False
        self.mock_query.assert_called_once_with(Period)
        self.mock_query.return_value.get.assert_called_once_with(period_id)

    def test_exists_period_by_client_id_and_date_found(self):
        client_id = "client-1"
        period_date = "2024-01-01"
        self.mock_period_query.first.return_value = True

        command = ExistsPeriod(client_id=client_id, period_date=period_date)
        result = command.execute()

        assert result is True
        self.mock_query.assert_called_once_with(Period)
        self.mock_query.return_value.filter_by.assert_called_once_with(client_id=client_id, date=period_date)
        self.mock_period_query.first.assert_called_once()

    def test_exists_period_by_client_id_and_date_not_found(self):
        client_id = "client-1"
        period_date = "2024-01-01"
        self.mock_period_query.first.return_value = None

        command = ExistsPeriod(client_id=client_id, period_date=period_date)
        result = command.execute()

        assert result is False
        self.mock_query.assert_called_once_with(Period)
        self.mock_query.return_value.filter_by.assert_called_once_with(client_id=client_id, date=period_date)
        self.mock_period_query.first.assert_called_once()

    def test_exists_period_invalid_data(self):
        command = ExistsPeriod()

        with pytest.raises(ValueError, match="Invalid data provided"):
            command.execute()