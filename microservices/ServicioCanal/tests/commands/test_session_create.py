import pytest
from unittest.mock import patch, MagicMock
from ServicioCanal.models.model import session
from ServicioCanal.models.session import Session
from ServicioCanal.commands.session_create import CreateSession

class TestCreateSession:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_session_success(self, mocker):
        test_channel_id = "channel123"
        test_topic = "Test Topic"
        test_topic_refid = "REF-001"
        test_opened_by_id = "user123"
        test_opened_by_name = "Test User"
        test_opened_by_type = "user"

        mock_session_constructor = mocker.patch(
            'ServicioCanal.commands.session_create.Session'
        )
        mock_session_instance = mock_session_constructor.return_value

        command = CreateSession(
            test_channel_id, test_topic, test_topic_refid,
            test_opened_by_id, test_opened_by_name, test_opened_by_type
        )
        result = command.execute()

        self.mock_add.assert_called_once_with(mock_session_instance)
        self.mock_commit.assert_called_once()

        mock_session_constructor.assert_called_once_with(
            test_channel_id, "OPEN", test_topic, test_topic_refid,
            test_opened_by_id, test_opened_by_name, test_opened_by_type
        )

        assert result == mock_session_instance


    def test_create_session_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateSession(None, "Test Topic", "REF-001", "user123", "Test User", "user").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_session_database_error(self):
        test_channel_id = "channel123"
        test_topic = "Test Topic"
        test_topic_refid = "REF-001"
        test_opened_by_id = "user123"
        test_opened_by_name = "Test User"
        test_opened_by_type = "user"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateSession(test_channel_id, test_topic, test_topic_refid, test_opened_by_id, test_opened_by_name, test_opened_by_type).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
