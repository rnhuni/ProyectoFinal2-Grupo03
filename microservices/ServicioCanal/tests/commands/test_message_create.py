import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.message import Message
from ServicioCanal.commands.message_create import CreateMessage

class TestCreateMessage:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_message_success(self):
        session_id = "session123"
        source_id = "source456"
        source_name = "Source Name"
        source_type = "system"
        content_type = "text/plain"
        body = "This is a test message."

        command = CreateMessage(session_id, source_id, source_name, source_type, content_type, body)
        message_created = command.execute()

        self.mock_add.assert_called_once_with(message_created)
        self.mock_commit.assert_called_once()

        assert isinstance(message_created, Message)
        assert message_created.session_id == session_id
        assert message_created.source_id == source_id
        assert message_created.source_name == source_name
        assert message_created.source_type == source_type
        assert message_created.content_type == content_type
        assert message_created.body == body

    def test_create_message_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateMessage(None, "source456", "Source Name", "system", "text/plain", "Message body").execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateMessage("session123", None, "Source Name", "system", "text/plain", "Message body").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_message_database_error(self):
        session_id = "session123"
        source_id = "source456"
        source_name = "Source Name"
        source_type = "system"
        content_type = "text/plain"
        body = "This is a test message."

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateMessage(session_id, source_id, source_name, source_type, content_type, body).execute()

        self.mock_rollback.assert_called_once()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
