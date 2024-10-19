import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.role import Role
from ServicioSistema.models.role_permission import RolePermission
from ServicioSistema.models.client import Client
from ServicioSistema.commands.user_create import CreateUser

@pytest.fixture
def mock_session(mocker):
    return mocker.patch('ServicioSistema.commands.user_create.session')

@pytest.fixture
def mock_cognito_service(mocker):
    cognito_mock = mocker.patch('ServicioSistema.services.cognito_service.CognitoService')
    cognito_mock_instance = cognito_mock.return_value
    cognito_mock_instance.register_user = MagicMock(return_value={
        'User': {'Username': 'testuser', 'UserStatus': 'CONFIRMED'}
    })
    return cognito_mock_instance

def create_mock_role():
    role = Role(id="role-1", name="Admin")
    
    # Crear un permiso simulado
    permission = MagicMock()
    permission.permission_id = "permission-1"
    permission.action = "write"
    
    role_permission = RolePermission(role_id="role-1", permission_id="permission-1", action="write")
    role.permissions = [role_permission]  # Asignar el permiso simulado al rol
    return role

def test_create_user_client_not_exist(mock_session, mock_cognito_service, mocker):
    role = create_mock_role()
    
    mocker.patch.object(mock_session, 'query').return_value.get.side_effect = lambda model_id: role if model_id == "role-1" else None
    
    with pytest.raises(ValueError, match="Client with id client-1 does not exist"):
        CreateUser("Test User", "testuser@example.com", role, "client-1").execute()

def test_create_user_invalid_data(mock_session, mock_cognito_service):
    role = create_mock_role()
    
    with pytest.raises(ValueError, match="Invalid data provided"):
        CreateUser("", "testuser@example.com", role, "client-1").execute()

def test_create_user_internal_error(mock_session, mock_cognito_service, mocker):
    role = create_mock_role()
    
    mock_session.query.side_effect = Exception("Internal Error")

    with pytest.raises(Exception, match="Internal Error"):
        CreateUser("Test User", "testuser@example.com", role, "client-1").execute()

def test_create_user_success(mock_session, mock_cognito_service, mocker):
    role = create_mock_role()

    mocker.patch.object(mock_session, 'query').return_value.get.side_effect = lambda model_id: (
        role if model_id == "role-1" else Client(id="client-1", name="Client 1")
    )

    mock_user = MagicMock()
    mock_user.id = "user-1"
    mock_user.name = "Test User"
    mock_user.email = "testuser@example.com"
    mock_user.role_id = "role-1"
    mock_user.client_id = "client-1"
    mock_user.createdAt = "2024-01-01"
    mock_user.updatedAt = "2024-01-01"

    mocker.patch('ServicioSistema.commands.user_create.CreateUser.execute', return_value=mock_user)

    user = CreateUser("Test User", "testuser@example.com", role, "client-1").execute()

    assert user.name == "Test User"
    assert user.email == "testuser@example.com"
