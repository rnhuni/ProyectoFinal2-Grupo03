import pytest
from unittest.mock import MagicMock
from ServicioSistema.commands.permission_get import GetPermission
from ServicioSistema.models.permission import Permission
from ServicioSistema.models.model import session

def test_get_permission_success(mocker):
    mock_permission = MagicMock(spec=Permission)
    mocker.patch.object(session, 'query', return_value=mocker.Mock(get=lambda id: mock_permission))

    command = GetPermission(id="permission-id")
    permission = command.execute()

    assert permission is not None
    assert isinstance(permission, Permission)

def test_get_permission_not_found(mocker):
    mocker.patch.object(session, 'query', return_value=mocker.Mock(get=lambda id: None))

    command = GetPermission(id="invalid-id")
    permission = command.execute()

    assert permission is None

def test_get_permission_invalid_id():
    with pytest.raises(ValueError, match="Invalid data provided"):
        command = GetPermission(id=None)
        command.execute()
