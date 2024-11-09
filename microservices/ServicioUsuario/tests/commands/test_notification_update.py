import pytest
from unittest.mock import MagicMock, patch
from ServicioUsuario.models.model import session
from ServicioUsuario.models.notification import Notification
from ServicioUsuario.commands.notification_update import UpdateNotification

class TestUpdateNotification:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
    
    def test_update_notification_success(self):
        mock_notification = MagicMock(spec=Notification)
        self.mock_query().filter_by().first.return_value = mock_notification
        command = UpdateNotification("user-1", "base-1", False)
        result = command.execute()
        assert result == mock_notification
        assert result.show is False
        self.mock_commit.assert_called_once()

    def test_update_notification_not_found(self):
        self.mock_query().filter_by().first.return_value = None
        command = UpdateNotification("user-1", "base-1", True)
        with pytest.raises(ValueError, match="Notification not found"):
            command.execute()

    def test_update_notification_invalid_data(self):
        command = UpdateNotification("user-1", None, True)
        with pytest.raises(ValueError, match="Invalid data provided"):
            command.execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_not_called()
