import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.notification import Notification
from ServicioSistema.commands.notification_create import CreateNotification

class TestCreateNotification():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_notification(self):
        test_data = {
            "name": "Test Notification",
            "service": "Test Service",
            "show_by_default": True
        }

        notification_created = CreateNotification(**test_data).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()
        assert isinstance(notification_created, Notification)
        assert notification_created.name == test_data['name']
        assert notification_created.service == test_data['service']
        assert notification_created.show_by_default == test_data['show_by_default']

    def test_create_notification_failure_on_commit(self):
        test_data = {
            "name": "Test Notification",
            "service": "Test Service",
            "show_by_default": True
        }
        self.mock_commit.side_effect = Exception("Commit failed")

        with pytest.raises(Exception, match="Commit failed"):
            CreateNotification(**test_data).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()

    def test_create_notification_invalid_data(self):
        invalid_data = {
            "name": "",
            "service": "",
            "show_by_default": None
        }

        with pytest.raises(ValueError):
            CreateNotification(**invalid_data).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()
