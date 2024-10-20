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
        self.mock_rollback = mocker.patch.object(session, 'rollback')
    
    def test_create_role(self):
        test_data = {
            "id": 1,
            "name": "Test Role",
            "permissions": [
                {
                    "permission": 101,
                    "actions": ["read", "write"]
                },
                {
                    "permission": 102,
                    "actions": ["read"]
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

    def test_create_role_invalid_data(self):
        invalid_data = {
            "id": None,
            "name": "Test Role",
            "permissions": [
                {
                    "permission": 101,
                    "actions": ["read", "write"]
                }
            ]
        }

        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateRole(**invalid_data).execute()

        self.mock_add.assert_not_called()
        self.mock_flush.assert_not_called()
        self.mock_commit.assert_not_called()
    
    def test_create_role_exception_during_commit(self):
        test_data = {
            "id": 1,
            "name": "Test Role",
            "permissions": [
                {
                    "permission": 101,
                    "actions": ["read", "write"]
                }
            ]
        }

        self.mock_commit.side_effect = Exception("Commit failed")

        with pytest.raises(Exception, match="Commit failed"):
            CreateRole(**test_data).execute()

        self.mock_add.assert_called()
        self.mock_flush.assert_called_once()
        self.mock_rollback.assert_called_once()