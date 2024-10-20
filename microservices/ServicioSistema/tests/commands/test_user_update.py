import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.user import User
from ServicioSistema.commands.user_update import UpdateUser

class TestUpdateUser:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query', return_value=MagicMock())
        self.mock_commit = mocker.patch.object(session, 'commit')

    def test_update_user_success(self):
        test_user_id = 1
        mock_user = MagicMock(spec=User)
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_user

        updated_user = UpdateUser(
            user_id=test_user_id,
            name="Updated Name",
            email="updatedemail@example.com",
            role_id="role-1",
            client_id="client-1"
        ).execute()

        self.mock_query.return_value.filter_by.assert_called_once_with(id=test_user_id)
        assert mock_user.name == "Updated Name"
        assert mock_user.email == "updatedemail@example.com"
        assert mock_user.role_id == "role-1"
        assert mock_user.client_id == "client-1"
        self.mock_commit.assert_called_once()

    def test_update_user_not_found(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        with pytest.raises(ValueError, match="User not found"):
            UpdateUser(
                user_id=1,
                name="Updated Name",
                email="updatedemail@example.com",
                role_id="role-1",
                client_id="client-1"
            ).execute()

        self.mock_query.return_value.filter_by.assert_called_once_with(id=1)
        self.mock_commit.assert_not_called()