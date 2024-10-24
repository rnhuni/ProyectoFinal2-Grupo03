import pytest
from unittest.mock import MagicMock, patch
from ServicioSistema.models.model import session
from ServicioSistema.models.user import User
from ServicioSistema.models.client import Client
from ServicioSistema.models.role import Role
from ServicioSistema.commands.user_create import CreateUser

class TestCreateUser:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

        self.mock_cognito_service = mocker.patch('ServicioSistema.services.cognito_service.CognitoService', autospec=True)

    def test_create_user_success(self, mocker):
        test_name = "Test User"
        test_email = "test@example.com"
        test_role = MagicMock(spec=Role)
        test_role.id = "role-1"
        test_role.permissions = []
        test_client_id = "client-1"
        test_features = ["feature1", "feature2"]

        mock_client = MagicMock(spec=Client)
        self.mock_cognito_service.return_value.register_user.return_value = {
            'User': {
                'Username': "cognito-id",
                'UserStatus': "CONFIRMED"
            }
        }

        mocker.patch('ServicioSistema.commands.user_create.cognito_service', new=self.mock_cognito_service.return_value)
        mocker.patch.object(session, 'query', return_value=MagicMock(get=MagicMock(return_value=mock_client)))

        user_created = CreateUser(test_name, test_email, test_role, test_features, test_client_id).execute()

        self.mock_cognito_service.return_value.register_user.assert_called_once_with(
            name=test_name,
            email=test_email,
            client=str(test_client_id),
            role=str(test_role.id),
            permissions="",
            features=str(test_features)
        )

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()

        assert isinstance(user_created, User)
        assert user_created.name == test_name
        assert user_created.email == test_email
        assert user_created.cognito_id == "cognito-id"
        assert user_created.role_id == "role-1"
        assert user_created.client_id == test_client_id
        assert user_created.status == "CONFIRMED"

    def test_create_user_client_not_found(self, mocker):
        test_name = "Test User"
        test_email = "test@example.com"
        test_role = MagicMock(spec=Role)
        test_client_id = "client-1"
        test_features = ["feature1"]

        mocker.patch.object(session, 'query', return_value=MagicMock(get=MagicMock(return_value=None)))

        with pytest.raises(ValueError, match=f"Client with id {test_client_id} does not exist"):
            CreateUser(test_name, test_email, test_role, test_features, test_client_id).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_user_role_not_found(self, mocker):
        test_name = "Test User"
        test_email = "test@example.com"
        test_role = None
        test_client_id = "client-1"
        test_features = ["feature1"]

        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateUser(test_name, test_email, test_role, test_features, test_client_id).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_user_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateUser("", "test@example.com", MagicMock(spec=Role), ["feature1"], "client-1").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_user_cognito_failure(self, mocker):
        test_name = "Test User"
        test_email = "test@example.com"
        test_role = MagicMock(spec=Role)
        test_role.id = "role-1"
        test_client_id = "client-1"
        test_features = ["feature1"]

        mocker.patch('ServicioSistema.commands.user_create.cognito_service', new=self.mock_cognito_service.return_value)

        self.mock_cognito_service.return_value.register_user.side_effect = Exception("Cognito error")

        mock_client = MagicMock(spec=Client)
        mocker.patch.object(session, 'query', return_value=MagicMock(get=MagicMock(return_value=mock_client)))

        with pytest.raises(Exception, match="Cognito error"):
            CreateUser(test_name, test_email, test_role, test_features, test_client_id).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()

    def test_convert_permissions_to_string(self):
        test_role = MagicMock(spec=Role)

        permission_1 = MagicMock()
        permission_1.permission.id = "permission-1"
        permission_1.action = "read"

        permission_2 = MagicMock()
        permission_2.permission.id = "permission-2"
        permission_2.action = "write"

        test_role.permissions = [permission_1, permission_2]

        create_user_command = CreateUser("Test User", "test@example.com", test_role, ["feature1"], "client-1")
        permissions_str = create_user_command._convert_permissions_to_string(test_role.permissions)

        assert permissions_str == "permission-1:read;permission-2:write"
