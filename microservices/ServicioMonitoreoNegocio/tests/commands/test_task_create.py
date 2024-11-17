import pytest
from unittest.mock import MagicMock, patch
from ServicioMonitoreoNegocio.models.model import session
from ServicioMonitoreoNegocio.models.task import Task
from ServicioMonitoreoNegocio.commands.task_create import CreateTask

class TestCreateTask:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_task_success(self):
        test_filters = '{"source_id": "123", "event_type": "ERROR"}'

        command = CreateTask(test_filters)
        task_created = command.execute()

        self.mock_add.assert_called_once_with(task_created)
        self.mock_commit.assert_called_once()

        assert isinstance(task_created, Task)
        assert task_created.filters == test_filters
        assert task_created.status == "PENDING"

    def test_create_task_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateTask("").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_task_database_error(self):
        test_filters = '{"source_id": "123", "event_type": "ERROR"}'

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateTask(test_filters).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
