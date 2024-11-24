import pytest
from unittest.mock import MagicMock, patch
from ServicioReporte.models.model import session
from ServicioReporte.models.log import Log
from ServicioReporte.commands.log_create import CreateLog

class TestCreateLog:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_log_success(self):
        test_source_id = "source123"
        test_source_name = "Test Source"
        test_source_type = "API"
        test_event_type = "ERROR"
        test_event_content = "An error occurred"

        command = CreateLog(
            test_source_id, test_source_name, test_source_type, test_event_type, test_event_content
        )
        log_created = command.execute()

        self.mock_add.assert_called_once_with(log_created)
        self.mock_commit.assert_called_once()

        assert isinstance(log_created, Log)
        assert log_created.source_id == test_source_id
        assert log_created.source_name == test_source_name
        assert log_created.source_type == test_source_type
        assert log_created.event_type == test_event_type
        assert log_created.event_content == test_event_content

    def test_create_log_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateLog("", "Test Source", "API", "ERROR", "An error occurred").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_log_database_error(self):
        test_source_id = "source123"
        test_source_name = "Test Source"
        test_source_type = "API"
        test_event_type = "ERROR"
        test_event_content = "An error occurred"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateLog(
                test_source_id, test_source_name, test_source_type, test_event_type, test_event_content
            ).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
