import pytest
from unittest.mock import MagicMock, patch
from sqlalchemy.orm.query import Query
from ServicioCanal.models.model import session
from ServicioCanal.models.session import Session
from ServicioCanal.commands.session_get_all_with_filters import GetAllSessionsByFilters

class TestGetAllSessionsByFilters:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_query_instance = self.mock_query.return_value
        self.mock_query_instance.filter.return_value = self.mock_query_instance
        self.mock_query_instance.order_by.return_value = self.mock_query_instance
        self.mock_query_instance.all.return_value = []

    def test_get_all_sessions_with_all_filters(self):
        mock_sessions = [MagicMock(spec=Session), MagicMock(spec=Session)]
        self.mock_query_instance.all.return_value = mock_sessions

        command = GetAllSessionsByFilters(
            channel="channel123",
            assigned_to="agent123",
            opened_by="user456",
            status="open",
            topic="support",
            topic_refid="ref789",
            order="asc",
            start_date="2023-11-01T00:00:00",
            end_date="2023-11-15T00:00:00"
        )
        sessions = command.execute()

        assert sessions == mock_sessions
        self.mock_query.assert_called_once_with(Session)
        self.mock_query_instance.filter.assert_called()
        self.mock_query_instance.order_by.assert_called_once()

    def test_get_all_sessions_with_partial_filters(self):
        mock_sessions = [MagicMock(spec=Session)]
        self.mock_query_instance.all.return_value = mock_sessions

        command = GetAllSessionsByFilters(
            channel="channel123",
            assigned_to=None,
            opened_by="user456",
            status=None,
            topic="support",
            topic_refid=None,
            order="desc",
            start_date=None,
            end_date=None
        )
        sessions = command.execute()

        assert sessions == mock_sessions
        self.mock_query.assert_called_once_with(Session)
        self.mock_query_instance.filter.assert_called()
        self.mock_query_instance.order_by.assert_called_once()

    def test_get_all_sessions_no_filters(self):
        mock_sessions = []
        self.mock_query_instance.all.return_value = mock_sessions

        command = GetAllSessionsByFilters()
        sessions = command.execute()

        assert sessions == mock_sessions
        self.mock_query.assert_called_once_with(Session)
        self.mock_query_instance.filter.assert_not_called()
        self.mock_query_instance.order_by.assert_called_once()

    def test_get_all_sessions_database_error(self):
        self.mock_query_instance.all.side_effect = Exception("Database error")

        command = GetAllSessionsByFilters()
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_query_instance.filter.assert_not_called()
