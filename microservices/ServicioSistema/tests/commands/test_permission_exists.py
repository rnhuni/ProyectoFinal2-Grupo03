import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Query
from ServicioSistema.models.model import session
from ServicioSistema.models.permission import Permission
from ServicioSistema.commands.permission_exists import ExistsPermission

class TestExistsPermission():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        # Parchear el query y su resultado
        self.mock_query = mocker.patch.object(session, 'query', return_value=MagicMock(spec=Query))
    
    def test_exists_permission_true(self):
        """Test when the permission exists in the database"""
        test_id = 1
        mock_permission = MagicMock(spec=Permission)
        self.mock_query.return_value.get.return_value = mock_permission

        exists = ExistsPermission(id=test_id).execute()

        self.mock_query.assert_called_once_with(Permission)
        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert exists is True

    def test_exists_permission_false(self):
        """Test when the permission does not exist in the database"""
        test_id = 2
        self.mock_query.return_value.get.return_value = None

        exists = ExistsPermission(id=test_id).execute()

        self.mock_query.assert_called_once_with(Permission)
        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert exists is False
