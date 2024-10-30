import pytest
from unittest.mock import patch
from ServicioIncidente.models.model import session
from ServicioIncidente.models.attachment import Attachment
from ServicioIncidente.models.incident_attachment import IncidentAttachment
from ServicioIncidente.commands.attachment_get_all import GetAllAttachments

class TestGetAllAttachments:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_join = self.mock_query.return_value.join
        self.mock_filter = self.mock_join.return_value.filter

    @patch("ServicioIncidente.models.attachment.Attachment")
    def test_get_all_attachments_found(self, MockAttachment):
        test_incident_id = 1
        mock_attachments = [MockAttachment(id=1), MockAttachment(id=2), MockAttachment(id=3)]
        self.mock_filter.return_value.all.return_value = mock_attachments

        command = GetAllAttachments(test_incident_id)
        attachments_result = command.execute()

        self.mock_query.assert_called_once_with(Attachment)
        self.mock_join.assert_called_once_with(IncidentAttachment)
        self.mock_filter.assert_called_once()
        assert attachments_result == mock_attachments

    def test_get_all_attachments_not_found(self):
        test_incident_id = 1
        self.mock_filter.return_value.all.return_value = []

        command = GetAllAttachments(test_incident_id)
        attachments_result = command.execute()

        assert attachments_result == []
        self.mock_query.assert_called_once_with(Attachment)
        self.mock_join.assert_called_once_with(IncidentAttachment)
        self.mock_filter.assert_called_once()