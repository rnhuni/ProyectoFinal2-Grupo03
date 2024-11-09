import pytest
from unittest.mock import patch
from ServicioUsuario.models.model import session
from ServicioUsuario.commands.notification_exists import ExistsNotification

class TestExistsNotification:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
    
    def test_exists_notification_success(self):
        self.mock_query().filter_by().first.return_value = True
        command = ExistsNotification("user-1", "base-1")
        result = command.execute()
        assert result is True

    def test_exists_notification_not_found(self):
        self.mock_query().filter_by().first.return_value = None
        command = ExistsNotification("user-1", "base-1")
        result = command.execute()
        assert result is False

    def test_exists_notification_invalid_data(self):
        command = ExistsNotification(None, "base-1")
        with pytest.raises(ValueError, match="Invalid data provided"):
            command.execute()

        self.mock_query().filter_by().first.assert_not_called()
