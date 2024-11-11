import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.notification import Notification
from ServicioSistema.commands.notification_get_all import GetAllNotifications

class TestGetAllNotifications():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_all_notifications(self):
        mock_notification_1 = MagicMock(spec=Notification)
        mock_notification_2 = MagicMock(spec=Notification)
        self.mock_query.return_value.all.return_value = [mock_notification_1, mock_notification_2]

        notifications = GetAllNotifications().execute()

        self.mock_query.assert_called_once_with(Notification)
        self.mock_query.return_value.all.assert_called_once()
        assert notifications == [mock_notification_1, mock_notification_2]
