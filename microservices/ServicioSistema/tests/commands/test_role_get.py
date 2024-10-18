import pytest
from unittest.mock import MagicMock
from ServicioSistema.commands.role_get import GetRole
from ServicioSistema.models.role import Role
from ServicioSistema.models.model import session

def test_get_role_success(mocker):
    mock_role = MagicMock(spec=Role)
    mocker.patch.object(session, 'query', return_value=mocker.Mock(get=lambda id: mock_role))

    command = GetRole(id="role-id")
    role = command.execute()

    assert role is not None
    assert isinstance(role, Role)

def test_get_role_not_found(mocker):
    mocker.patch.object(session, 'query', return_value=mocker.Mock(get=lambda id: None))

    command = GetRole(id="invalid-id")
    role = command.execute()

    assert role is None

def test_get_role_invalid_id():
    with pytest.raises(ValueError, match="Invalid data provided"):
        command = GetRole(id=None)
        command.execute()
