import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.notification import Notification
from ServicioSistema.commands.notification_get import GetNotification

class TestGetNotification():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_notification(self):
        mock_notification = MagicMock(spec=Notification)
        self.mock_query.return_value.get.return_value = mock_notification

        notification_id = "notif-1"
        notification = GetNotification(notification_id).execute()

        self.mock_query.assert_called_once_with(Notification)
        self.mock_query.return_value.get.assert_called_once_with(notification_id)
        assert notification == mock_notification

    def test_get_notification_not_found(self):
        self.mock_query.return_value.get.return_value = None

        notification_id = "non-existent-id"
        notification = GetNotification(notification_id).execute()

        assert notification is None

    def test_get_notification_invalid_id(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            GetNotification(None).execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            GetNotification("").execute()