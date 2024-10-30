import pytest
from unittest.mock import MagicMock, patch
import uuid
from ServicioIncidente.models.model import session
from ServicioIncidente.models.attachment import Attachment
from ServicioIncidente.commands.attachment_exists import ExistsAttachment

class TestExistsAttachment:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_exists_attachment_success(self):
        test_id = uuid.uuid4()
        mock_attachment = MagicMock(spec=Attachment)
        self.mock_query.return_value.get.return_value = mock_attachment

        result = ExistsAttachment(test_id).execute()

        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert result is True

    def test_exists_attachment_not_found(self):
        test_id = uuid.uuid4()
        self.mock_query.return_value.get.return_value = None

        result = ExistsAttachment(test_id).execute()

        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert result is False

    def test_exists_attachment_invalid_id(self):
        with pytest.raises(ValueError, match="Attachment ID is required"):
            ExistsAttachment(None).execute()
