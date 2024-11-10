import pytest
from unittest.mock import MagicMock
from datetime import datetime
from ServicioSistema.models.model import session
from ServicioSistema.models.notification import Notification
from ServicioSistema.commands.notification_update import UpdateNotification

class TestUpdateNotification():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_update_notification(self):
        mock_notification = MagicMock(spec=Notification)
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_notification

        update_data = {
            "notification_id": "notif-1",
            "name": "Updated Notification",
            "service": "Updated Service",
            "show_by_default": False
        }

        updated_notification = UpdateNotification(**update_data).execute()

        self.mock_query.assert_called_once_with(Notification)
        self.mock_commit.assert_called_once()
        assert updated_notification.name == update_data['name']
        assert updated_notification.service == update_data['service']
        assert updated_notification.show_by_default == update_data['show_by_default']

    def test_update_notification_not_found(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        update_data = {
            "notification_id": "non-existent-id",
            "name": "Updated Notification",
            "service": "Updated Service",
            "show_by_default": False
        }

        with pytest.raises(ValueError, match="Notification not found"):
            UpdateNotification(**update_data).execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()

    def test_update_notification_failure_on_commit(self):
        mock_notification = MagicMock(spec=Notification)
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_notification
        self.mock_commit.side_effect = Exception("Commit failed")

        update_data = {
            "notification_id": "notif-1",
            "name": "Updated Notification",
            "service": "Updated Service",
            "show_by_default": False
        }

        with pytest.raises(Exception, match="Commit failed"):
            UpdateNotification(**update_data).execute()

        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()

    def test_update_notification_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateNotification(None, "Test Name", "Test Service", True).execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateNotification("notif-1", "", "Test Service", True).execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateNotification("notif-1", "Test Name", "", True).execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateNotification("notif-1", "Test Name", "Test Service", None).execute()