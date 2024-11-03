import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.user import User
from ServicioSistema.commands.user_get_all import GetAllUsers

class TestGetAllUsers:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query', return_value=MagicMock())

    def test_get_all_users_success(self):
        mock_user1 = MagicMock(spec=User)
        mock_user2 = MagicMock(spec=User)
        self.mock_query.return_value.all.return_value = [mock_user1, mock_user2]

        result = GetAllUsers().execute()

        self.mock_query.assert_called_once_with(User)
        self.mock_query.return_value.all.assert_called_once()
        assert result == [mock_user1, mock_user2]

    def test_get_all_users_empty(self):
        self.mock_query.return_value.all.return_value = []

        result = GetAllUsers().execute()

        self.mock_query.assert_called_once_with(User)
        self.mock_query.return_value.all.assert_called_once()
        assert result == []