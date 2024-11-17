import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.session import Session
from ServicioCanal.commands.session_exists import ExistsSession

class TestExistsSession:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_get = self.mock_query.return_value.get

    def test_exists_session_success(self):
        mock_session = MagicMock(spec=Session)
        self.mock_get.return_value = mock_session

        command = ExistsSession("existing_session_id")
        result = command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_get.assert_called_once_with("existing_session_id")

        assert result is True

    def test_exists_session_not_found(self):
        self.mock_get.return_value = None

        command = ExistsSession("nonexistent_session_id")
        result = command.execute()

        self.mock_query.assert_called_once_with(Session)
        self.mock_get.assert_called_once_with("nonexistent_session_id")

        assert result is False

    def test_exists_session_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            ExistsSession(None).execute()

        self.mock_query.assert_not_called()
        self.mock_get.assert_not_called()
