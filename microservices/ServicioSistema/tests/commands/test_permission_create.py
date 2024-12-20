import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.permission import Permission
from ServicioSistema.commands.permission_create import CreatePermission

class TestCreatePermission():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
  
    def test_create_permission(self):
        test_data = {
            "id": "pem-s-1",
            "name": "1",
            "resource": "s",
            "description": "Permission to manage users"
        }

        permission_created = CreatePermission(**test_data).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()
        assert isinstance(permission_created, Permission)
        assert permission_created.id == test_data['id']
        assert permission_created.name == test_data['name']
        assert permission_created.resource == test_data['resource']
        assert permission_created.description == test_data['description']
    
    def test_create_permission_failure_on_commit(self, mocker):
        """Test when commit fails"""
        test_data = {
            "id": "pem-s-2",
            "name": "2",
            "resource": "s",
            "description": "Permission to manage orders"
        }
        self.mock_commit.side_effect = Exception("Commit failed")

        with pytest.raises(Exception, match="Commit failed"):
            CreatePermission(**test_data).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()

    def test_create_permission_invalid_data(self):
        """Test creating permission with invalid data"""
        invalid_data = {
            "id": None,  # Invalid ID
            "name": "",
            "resource": "",
            "description": ""
        }

        with pytest.raises(ValueError):
            CreatePermission(**invalid_data).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()
