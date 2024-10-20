import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.user import User
from ServicioSistema.commands.user_get import GetUser

class TestGetUser:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query', return_value=MagicMock())

    def test_get_user_success(self):
        test_id = 1
        mock_user = MagicMock(spec=User)
        self.mock_query.return_value.get.return_value = mock_user

        result = GetUser(id=test_id).execute()

        self.mock_query.assert_called_once_with(User)
        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert result == mock_user

    def test_get_user_not_found(self):
        test_id = 1
        self.mock_query.return_value.get.return_value = None

        result = GetUser(id=test_id).execute()

        self.mock_query.assert_called_once_with(User)
        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert result is None

    def test_get_user_invalid_id(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            GetUser(id=None).execute()