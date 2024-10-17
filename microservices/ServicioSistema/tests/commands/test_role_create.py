import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.role import Role
from ServicioSistema.models.role_permission import RolePermission
from ServicioSistema.commands.role_create import CreateRole

class TestCreateRole():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_flush = mocker.patch.object(session, 'flush')
    
    def test_create_role(self):
        test_data = {
            "id": 1,
            "name": "Test Role",
            "permissions": [
                {
                    "permission": 101,
                    "scopes": ["read", "write"]
                },
                {
                    "permission": 102,
                    "scopes": ["read"]
                }
            ]
        }

        mock_role = Role(id=test_data["id"], name=test_data["name"])
        self.mock_add.side_effect = lambda x: None

        role_created = CreateRole(**test_data).execute()

        self.mock_flush.assert_called_once()
        assert self.mock_add.call_count == 4
        self.mock_commit.assert_called_once()

        assert role_created.id == test_data['id']
        assert role_created.name == test_data['name']
