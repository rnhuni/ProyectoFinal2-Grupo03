import pytest
from unittest.mock import MagicMock, patch
from sqlalchemy.orm.query import Query
from ServicioReporte.models.model import session
from ServicioReporte.models.log import Log
from ServicioReporte.commands.log_get_by_filters import GetLogs

class TestGetLogs:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_query_instance = self.mock_query.return_value
        self.mock_query_instance.filter.return_value = self.mock_query_instance
        self.mock_query_instance.order_by.return_value = self.mock_query_instance
        self.mock_query_instance.all.return_value = []

    def test_get_logs_with_all_filters(self):
        mock_logs = [MagicMock(spec=Log), MagicMock(spec=Log)]
        self.mock_query_instance.all.return_value = mock_logs

        command = GetLogs(
            source_id="123",
            event_type="ERROR",
            start_date="2023-11-01T00:00:00",
            end_date="2023-11-02T00:00:00",
            order="asc"
        )
        logs = command.execute()

        assert logs == mock_logs
        self.mock_query.assert_called_once_with(Log)
        self.mock_query_instance.filter.assert_called()
        self.mock_query_instance.order_by.assert_called_once()

    def test_get_logs_with_partial_filters(self):
        mock_logs = [MagicMock(spec=Log)]
        self.mock_query_instance.all.return_value = mock_logs

        command = GetLogs(
            source_id="123",
            event_type=None,
            start_date=None,
            end_date=None,
            order="desc"
        )
        logs = command.execute()

        assert logs == mock_logs
        self.mock_query.assert_called_once_with(Log)
        self.mock_query_instance.filter.assert_called()
        self.mock_query_instance.order_by.assert_called_once()
