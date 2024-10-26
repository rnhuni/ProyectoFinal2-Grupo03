
import pytest
import uuid
from unittest.mock import MagicMock, patch
from ServicioIncidente.models.model import session
from ServicioIncidente.models.attachment import Attachment
from ServicioIncidente.models.incident_attachment import IncidentAttachment
from ServicioIncidente.commands.attachment_create import CreateAttachment

class TestCreateAttachment:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
        self.mock_flush = mocker.patch.object(session, 'flush')

    def test_create_attachment_success(self):
        test_id = uuid.uuid4()
        test_incident_id = "incident-1"
        test_file_name = "example.txt"
        test_file_uri = "s3://bucket/example.txt"
        test_content_type = "text/plain"
        test_user_id = "user-1"
        test_user_name = "Test User"

        command = CreateAttachment(test_id, test_incident_id, test_file_name, test_file_uri, test_content_type, test_user_id, test_user_name)
        attachment_created = command.execute()

        self.mock_add.assert_any_call(attachment_created)
        self.mock_flush.assert_called_once()
        self.mock_commit.assert_called_once()

        assert isinstance(attachment_created, Attachment)
        assert attachment_created.id == test_id
        assert attachment_created.file_name == test_file_name
        assert attachment_created.file_uri == test_file_uri
        assert attachment_created.content_type == test_content_type
        assert attachment_created.user_attacher_id == test_user_id
        assert attachment_created.user_attacher_name == test_user_name

    def test_create_attachment_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateAttachment(None, "incident-1", "example.txt", "s3://bucket/example.txt", "text/plain", "user-1", "Test User").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_attachment_database_error(self, mocker):
        test_id = uuid.uuid4()
        test_incident_id = "incident-1"
        test_file_name = "example.txt"
        test_file_uri = "s3://bucket/example.txt"
        test_content_type = "text/plain"
        test_user_id = "user-1"
        test_user_name = "Test User"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateAttachment(test_id, test_incident_id, test_file_name, test_file_uri, test_content_type, test_user_id, test_user_name).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
