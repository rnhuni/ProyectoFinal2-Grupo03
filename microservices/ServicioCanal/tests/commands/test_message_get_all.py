import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.message import Message
from ServicioCanal.commands.message_get_all import GetAllMessages

class TestGetAllMessages:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_message_1 = MagicMock()
        self.mock_message_2 = MagicMock()

    def test_get_all_messages_success(self):
        session_id = "session123"

        self.mock_message_1.id = 1
        self.mock_message_1.session_id = session_id
        self.mock_message_1.source_id = "source1"
        self.mock_message_1.body = "Message 1 body"

        self.mock_message_2.id = 2
        self.mock_message_2.session_id = session_id
        self.mock_message_2.source_id = "source2"
        self.mock_message_2.body = "Message 2 body"

        self.mock_query.return_value.filter_by.return_value.all.return_value = [self.mock_message_1, self.mock_message_2]

        command = GetAllMessages(session_id)
        messages = command.execute()

        self.mock_query.assert_called_once_with(Message)
        self.mock_query.return_value.filter_by.assert_called_once_with(session_id=session_id)
        self.mock_query.return_value.filter_by.return_value.all.assert_called_once()

        assert len(messages) == 2
        assert messages[0] == self.mock_message_1
        assert messages[1] == self.mock_message_2

    def test_get_all_messages_no_messages(self):
        session_id = "session123"

        self.mock_query.return_value.filter_by.return_value.all.return_value = []

        command = GetAllMessages(session_id)
        messages = command.execute()

        self.mock_query.assert_called_once_with(Message)
        self.mock_query.return_value.filter_by.assert_called_once_with(session_id=session_id)
        self.mock_query.return_value.filter_by.return_value.all.assert_called_once()

        assert messages == []

    def test_get_all_messages_invalid_session_id(self):
        with pytest.raises(Exception, match="Database error"):
            self.mock_query.return_value.filter_by.side_effect = Exception("Database error")
            GetAllMessages("invalid_session").execute()

        self.mock_query.assert_called_once_with(Message)
        self.mock_query.return_value.filter_by.assert_called_once_with(session_id="invalid_session")
