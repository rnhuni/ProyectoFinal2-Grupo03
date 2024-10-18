import pytest
from unittest.mock import MagicMock
from ServicioSistema.commands.permission_get_all import GetAllPermissions
from ServicioSistema.models.permission import Permission
from ServicioSistema.models.model import session

def test_get_all_permissions_success(mocker):
    mock_permission = MagicMock(spec=Permission)
    mocker.patch.object(session, 'query', return_value=mocker.Mock(all=lambda: [mock_permission]))

    command = GetAllPermissions()
    permissions = command.execute()

    assert len(permissions) == 1
    assert isinstance(permissions[0], Permission)

def test_get_all_permissions_empty(mocker):
    mocker.patch.object(session, 'query', return_value=mocker.Mock(all=lambda: []))

    command = GetAllPermissions()
    permissions = command.execute()

    assert permissions == []
