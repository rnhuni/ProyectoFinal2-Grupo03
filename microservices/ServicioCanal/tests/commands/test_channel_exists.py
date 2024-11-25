import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.channel import Channel
from ServicioCanal.commands.channel_exists import ExistsChannel

class TestExistsChannel:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_exists_channel_success(self):
        mock_channel = MagicMock(spec=Channel)
        self.mock_query.return_value.get.return_value = mock_channel

        command = ExistsChannel("channel123")
        result = command.execute()

        assert result is True
        self.mock_query.assert_called_once_with(Channel)
        self.mock_query.return_value.get.assert_called_once_with("channel123")

    def test_exists_channel_not_found(self):
        self.mock_query.return_value.get.return_value = None

        command = ExistsChannel("nonexistent_channel")
        result = command.execute()

        assert result is False
        self.mock_query.assert_called_once_with(Channel)
        self.mock_query.return_value.get.assert_called_once_with("nonexistent_channel")

    def test_exists_channel_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            ExistsChannel(None).execute()

        self.mock_query.assert_not_called()
