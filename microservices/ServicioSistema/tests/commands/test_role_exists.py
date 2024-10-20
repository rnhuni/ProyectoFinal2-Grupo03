import pytest
from unittest.mock import MagicMock
from sqlalchemy.orm import Query
from ServicioSistema.models.model import session
from ServicioSistema.models.role import Role
from ServicioSistema.commands.role_exists import ExistsRole

class TestExistsRole():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query', return_value=MagicMock(spec=Query))
    
    def test_exists_role_true(self):
        test_id = 1
        mock_role = MagicMock(spec=Role)
        self.mock_query.return_value.get.return_value = mock_role

        exists = ExistsRole(id=test_id).execute()

        self.mock_query.assert_called_once_with(Role)
        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert exists is True

    def test_exists_role_false(self):
        test_id = 2
        self.mock_query.return_value.get.return_value = None

        exists = ExistsRole(id=test_id).execute()

        self.mock_query.assert_called_once_with(Role)
        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert exists is False

    def test_exists_role_invalid_id(self):
        invalid_id = None

        with pytest.raises(ValueError, match="Invalid data provided"):
            ExistsRole(id=invalid_id).execute()

        self.mock_query.assert_not_called()