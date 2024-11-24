import pytest
from unittest.mock import MagicMock, patch
from ServicioReporte.models.model import session
from ServicioReporte.models.task import Task
from ServicioReporte.commands.task_update import UpdateTask

class TestUpdateTask:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_update_task_success(self):
        mock_task = MagicMock(spec=Task)
        mock_task.status = "PENDING"
        mock_task.key = None
        
        updated_key = "new_key"
        updated_status = "COMPLETED"

        command = UpdateTask(mock_task, updated_key, updated_status)
        updated_task = command.execute()

        self.mock_commit.assert_called_once()
        assert updated_task == mock_task
        assert updated_task.status == updated_status
        assert updated_task.key == updated_key

    def test_update_task_partial_update(self):
        mock_task = MagicMock(spec=Task)
        mock_task.status = "PENDING"
        mock_task.key = "old_key"
        
        updated_status = "IN_PROGRESS"

        command = UpdateTask(mock_task, None, updated_status)
        updated_task = command.execute()

        self.mock_commit.assert_called_once()
        assert updated_task == mock_task
        assert updated_task.status == updated_status
        assert updated_task.key == "old_key"

    def test_update_task_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateTask(None, "key", "COMPLETED").execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_not_called()

    def test_update_task_database_error(self):
        mock_task = MagicMock(spec=Task)
        mock_task.status = "PENDING"
        mock_task.key = None
        
        updated_status = "FAILED"

        self.mock_commit.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            UpdateTask(mock_task, None, updated_status).execute()

        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()
