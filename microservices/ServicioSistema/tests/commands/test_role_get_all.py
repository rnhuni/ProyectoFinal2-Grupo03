import pytest
from unittest.mock import MagicMock
from ServicioSistema.commands.role_get_all import GetAllRoles
from ServicioSistema.models.role import Role
from ServicioSistema.models.model import session

def test_get_all_roles_success(mocker):
    mock_role = MagicMock(spec=Role)
    mocker.patch.object(session, 'query', return_value=mocker.Mock(all=lambda: [mock_role]))

    command = GetAllRoles()
    roles = command.execute()

    assert len(roles) == 1
    assert isinstance(roles[0], Role)

def test_get_all_roles_empty(mocker):
    mocker.patch.object(session, 'query', return_value=mocker.Mock(all=lambda: []))

    command = GetAllRoles()
    roles = command.execute()

    assert roles == []
