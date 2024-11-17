import pytest
from unittest.mock import patch, MagicMock
from ServicioCanal.models.model import session
from ServicioCanal.models.session import Session
from ServicioCanal.commands.session_get_all import GetAllSessions

class TestGetAllSessions:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_filter_by = self.mock_query.return_value.filter_by

    def test_get_all_sessions_success(self):
        test_channel_id = "channel123"
        mock_session_1 = MagicMock()
        mock_session_2 = MagicMock()
        
        self.mock_filter_by.return_value.all.return_value = [mock_session_1, mock_session_2]

        command = GetAllSessions(test_channel_id)
        result = command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_filter_by.assert_called_once_with(channel_id=test_channel_id)
        assert result == [mock_session_1, mock_session_2]

    def test_get_all_sessions_empty(self):
        test_channel_id = "channel123"
        
        self.mock_filter_by.return_value.all.return_value = []

        command = GetAllSessions(test_channel_id)
        result = command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_filter_by.assert_called_once_with(channel_id=test_channel_id)
        assert result == []

    def test_get_all_sessions_query_error(self):
        test_channel_id = "channel123"

        self.mock_filter_by.side_effect = Exception("Database query error")

        command = GetAllSessions(test_channel_id)
        with pytest.raises(Exception, match="Database query error"):
            command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_filter_by.assert_called_once_with(channel_id=test_channel_id)
