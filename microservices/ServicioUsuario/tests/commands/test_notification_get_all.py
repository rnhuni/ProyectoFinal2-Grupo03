import pytest
from unittest.mock import patch, MagicMock
from ServicioUsuario.models.model import session
from ServicioUsuario.commands.notification_get_all import GetAllNotifications

class TestGetAllNotifications:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_all_notifications_success(self):
        mock_notification = MagicMock()
        self.mock_query().filter_by().all.return_value = [mock_notification]
        command = GetAllNotifications("user-1")
        result = command.execute()
        assert result == [mock_notification]
