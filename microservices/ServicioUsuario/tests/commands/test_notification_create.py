import pytest
from unittest.mock import MagicMock
from ServicioUsuario.models.model import session
from ServicioUsuario.models.notification import Notification
from ServicioUsuario.commands.notification_create import CreateNotification

class TestCreateNotification:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
    
    def test_create_notification(self):
        test_data = {
            "user_id": "user-1",
            "base_id": "base-1",
            "name": "Test Notification",
            "show": True
        }

        notification_created = CreateNotification(**test_data).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()
        assert isinstance(notification_created, Notification)
        assert notification_created.user_id == test_data['user_id']
        assert notification_created.base_id == test_data['base_id']
        assert notification_created.name == test_data['name']
        assert notification_created.show == test_data['show']
    
    def test_create_notification_failure_on_commit(self):
        test_data = {
            "user_id": "user-1",
            "base_id": "base-1",
            "name": "Test Notification",
            "show": True
        }
        self.mock_commit.side_effect = Exception("Commit failed")

        with pytest.raises(Exception, match="Commit failed"):
            CreateNotification(**test_data).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()

    def test_create_notification_invalid_data(self):
        invalid_data = {
            "user_id": None,
            "base_id": "",
            "name": "",
            "show": None
        }

        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateNotification(**invalid_data).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()
