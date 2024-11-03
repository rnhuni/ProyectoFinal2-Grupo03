import pytest
from unittest.mock import MagicMock, patch
from ServicioIncidente.models.model import session
from ServicioIncidente.models.attachment import Attachment
from ServicioIncidente.commands.attachment_get import GetAttachment

class TestGetAttachment:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_join = self.mock_query.return_value.join
        self.mock_filter = self.mock_join.return_value.filter

    @patch("ServicioIncidente.models.attachment.Attachment", autospec=True)
    def test_get_attachment_found(self, MockAttachment):
        test_incident_id = 1
        test_attachment_id = 2

        mock_attachment = MockAttachment.return_value
        mock_attachment.id = test_attachment_id
        mock_attachment.file_name = "Test Attachment"
        mock_attachment.file_uri = "s3://bucket/test_attachment"
        mock_attachment.content_type = "text/plain"
        mock_attachment.user_attacher_id = "user-1"
        mock_attachment.user_attacher_name = "Test User"
        self.mock_filter.return_value.first.return_value = mock_attachment

        command = GetAttachment(test_incident_id, test_attachment_id)
        attachment_result = command.execute()

        self.mock_query.assert_called_once_with(Attachment)
        self.mock_join.assert_called_once()
        self.mock_filter.assert_called_once()
        assert attachment_result == mock_attachment

    def test_get_attachment_not_found(self):
        test_incident_id = 1
        test_attachment_id = 3

        self.mock_filter.return_value.first.return_value = None

        command = GetAttachment(test_incident_id, test_attachment_id)
        attachment_result = command.execute()

        assert attachment_result is None
        self.mock_query.assert_called_once_with(Attachment)
        self.mock_join.assert_called_once()
        self.mock_filter.assert_called_once()