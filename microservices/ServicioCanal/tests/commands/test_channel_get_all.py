import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.channel import Channel
from ServicioCanal.commands.channel_get_all import GetAllChannels

class TestGetAllChannels:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_all_channels_success(self):
        mock_channel1 = MagicMock(spec=Channel)
        mock_channel1.id = "channel1"
        mock_channel1.name = "Channel 1"
        mock_channel1.description = "Description 1"
        mock_channel1.type = "support"
        mock_channel1.platforms = "web;mobile"
        
        mock_channel2 = MagicMock(spec=Channel)
        mock_channel2.id = "channel2"
        mock_channel2.name = "Channel 2"
        mock_channel2.description = "Description 2"
        mock_channel2.type = "marketing"
        mock_channel2.platforms = "mobile"

        self.mock_query.return_value.all.return_value = [mock_channel1, mock_channel2]

        command = GetAllChannels()
        result = command.execute()

        assert len(result) == 2
        assert result[0].id == "channel1"
        assert result[0].name == "Channel 1"
        assert result[1].id == "channel2"
        assert result[1].name == "Channel 2"

        self.mock_query.assert_called_once_with(Channel)
        self.mock_query.return_value.all.assert_called_once()

    def test_get_all_channels_empty(self):
        self.mock_query.return_value.all.return_value = []

        command = GetAllChannels()
        result = command.execute()

        assert result == []

        self.mock_query.assert_called_once_with(Channel)
        self.mock_query.return_value.all.assert_called_once()
