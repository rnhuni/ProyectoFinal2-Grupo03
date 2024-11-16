import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.channel import Channel
from ServicioCanal.commands.channel_get import GetChannel

class TestGetChannel:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_channel_success(self):
        mock_channel = MagicMock(spec=Channel)
        mock_channel.id = "channel123"
        mock_channel.name = "Test Channel"
        mock_channel.description = "Test Description"
        mock_channel.type = "support"
        mock_channel.platforms = "web;mobile"
        
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_channel

        command = GetChannel("channel123")
        result = command.execute()

        assert result is mock_channel
        assert result.id == "channel123"
        assert result.name == "Test Channel"

        self.mock_query.assert_called_once_with(Channel)
        self.mock_query.return_value.filter_by.assert_called_once_with(id="channel123")
        self.mock_query.return_value.filter_by.return_value.first.assert_called_once()

    def test_get_channel_not_found(self):
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        command = GetChannel("nonexistent_channel")
        result = command.execute()

        assert result is None

        self.mock_query.assert_called_once_with(Channel)
        self.mock_query.return_value.filter_by.assert_called_once_with(id="nonexistent_channel")
        self.mock_query.return_value.filter_by.return_value.first.assert_called_once()
