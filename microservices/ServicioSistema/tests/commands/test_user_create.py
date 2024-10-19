import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.user import User
from ServicioSistema.models.role import Role
from ServicioSistema.models.client import Client
from ServicioSistema.commands.user_create import CreateUser

@pytest.fixture
def mock_session(mocker):
    return mocker.patch('ServicioSistema.commands.user_create.session')

def test_create_user_client_not_exist(mock_session, mocker):
    mocker.patch.object(mock_session, 'query').return_value.get.side_effect = lambda model_id: Role(id="role-1", name="Admin") if model_id == "role-1" else None

    with pytest.raises(ValueError, match="Client with id client-1 does not exist"):
        CreateUser("Test User", "testuser@example.com", "temp_password", "role-1", "client-1").execute()

def test_create_user_invalid_data(mock_session):
    with pytest.raises(ValueError, match="Invalid data provided"):
        CreateUser("", "testuser@example.com", "temp_password", "role-1", "client-1").execute()

def test_create_user_internal_error(mock_session, mocker):
    mock_session.query.side_effect = Exception("Internal Error")

    with pytest.raises(Exception, match="Internal Error"):
        CreateUser("Test User", "testuser@example.com", "temp_password", "role-1", "client-1").execute()

