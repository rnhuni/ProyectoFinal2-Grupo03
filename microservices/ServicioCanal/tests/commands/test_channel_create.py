import pytest
from unittest.mock import MagicMock, patch
from ServicioCanal.models.model import session
from ServicioCanal.models.channel import Channel
from ServicioCanal.commands.channel_create import CreateChannel
from ServicioCanal.utils.utils import build_channel_id

class TestCreateChannel:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
        self.mock_build_channel_id = mocker.patch('ServicioCanal.utils.utils.build_channel_id', return_value="channel123")

    def test_create_channel_success(self):
        test_name = "Test Channel"
        test_description = "Test Channel Description"
        test_type = "support"
        test_platforms = "web;mobile"

        self.mock_build_channel_id.return_value = "chan-test-channel"

        command = CreateChannel(test_name, test_description, test_type, test_platforms)
        channel_created = command.execute()

        self.mock_add.assert_called_once_with(channel_created)
        self.mock_commit.assert_called_once()

        assert isinstance(channel_created, Channel)
        assert channel_created.id == "chan-test-channel"
        assert channel_created.name == test_name
        assert channel_created.description == test_description
        assert channel_created.type == test_type
        assert channel_created.platforms == test_platforms

    def test_create_channel_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateChannel("", "Test Description", "support", "web;mobile").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_channel_database_error(self):
        test_name = "Test Channel"
        test_description = "Test Channel Description"
        test_type = "support"
        test_platforms = "web;mobile"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateChannel(test_name, test_description, test_type, test_platforms).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
