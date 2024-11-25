import pytest
from unittest.mock import patch, MagicMock
from ServicioCanal.models.model import session
from ServicioCanal.models.session import Session
from ServicioCanal.commands.session_get import GetSession

class TestGetSession:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_filter_by = self.mock_query.return_value.filter_by

    def test_get_session_success(self):
        test_session_id = 1
        mock_session_instance = MagicMock()
        
        self.mock_filter_by.return_value.first.return_value = mock_session_instance

        command = GetSession(test_session_id)
        result = command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_filter_by.assert_called_once_with(id=test_session_id)
        assert result == mock_session_instance

    def test_get_session_not_found(self):
        test_session_id = 1
        
        self.mock_filter_by.return_value.first.return_value = None

        command = GetSession(test_session_id)
        result = command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_filter_by.assert_called_once_with(id=test_session_id)
        assert result is None

    def test_get_session_query_error(self):
        test_session_id = 1

        self.mock_filter_by.side_effect = Exception("Database query error")

        command = GetSession(test_session_id)
        with pytest.raises(Exception, match="Database query error"):
            command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_filter_by.assert_called_once_with(id=test_session_id)
