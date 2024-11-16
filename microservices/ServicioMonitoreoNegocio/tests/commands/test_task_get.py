import pytest
from unittest.mock import MagicMock, patch
from ServicioMonitoreoNegocio.models.model import session
from ServicioMonitoreoNegocio.models.task import Task
from ServicioMonitoreoNegocio.commands.task_get import GetTask

class TestGetTask:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_task_success(self):
        test_task_id = "task123"
        mock_task = MagicMock(spec=Task)
        mock_task.id = test_task_id
        mock_task.filters = '{"source_id": "123", "event_type": "ERROR"}'
        mock_task.status = "PENDING"
        
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_task

        command = GetTask(test_task_id)
        task_fetched = command.execute()

        self.mock_query.assert_called_once_with(Task)
        self.mock_query.return_value.filter_by.assert_called_once_with(id=test_task_id)
        assert task_fetched == mock_task
        assert task_fetched.id == test_task_id
        assert task_fetched.filters == '{"source_id": "123", "event_type": "ERROR"}'
        assert task_fetched.status == "PENDING"

    def test_get_task_not_found(self):
        test_task_id = "nonexistent_task"
        
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        command = GetTask(test_task_id)
        task_fetched = command.execute()

        self.mock_query.assert_called_once_with(Task)
        self.mock_query.return_value.filter_by.assert_called_once_with(id=test_task_id)
        assert task_fetched is None
