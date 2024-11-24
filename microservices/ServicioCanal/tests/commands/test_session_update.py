import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.session import Session
from ServicioCanal.commands.session_update import UpdateSession


class TestUpdateSession:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
        self.mock_query = mocker.patch.object(session, 'query')

        self.mock_session_instance = MagicMock()
        self.mock_session_instance.id = "session123"
        self.mock_session_instance.status = "OPEN"

    def test_update_session_success(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = self.mock_session_instance

        command = UpdateSession("session123", "CLOSED")
        updated_session = command.execute()

        assert updated_session.status == "CLOSED"
        self.mock_commit.assert_called_once()

    def test_update_session_not_found(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        command = UpdateSession("nonexistent_session", "CLOSED")
        with pytest.raises(ValueError, match="Session not found"):
            command.execute()

        self.mock_commit.assert_not_called()

    def test_update_session_invalid_data(self):
        command = UpdateSession(None, None)
        with pytest.raises(ValueError, match="Invalid data provided"):
            command.execute()

        self.mock_commit.assert_not_called()

    def test_update_session_database_error(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = self.mock_session_instance

        self.mock_commit.side_effect = Exception("Database error")

        command = UpdateSession("session123", "CLOSED")
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_rollback.assert_called_once()
