
import pytest
from unittest.mock import MagicMock, patch
from ServicioIncidente.models.model import session
from ServicioIncidente.models.incident import Incident
from ServicioIncidente.commands.incident_create import CreateIncident

class TestCreateIncident:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_incident_success(self):
        test_id = "incident-1"
        test_type = "Network Issue"
        test_description = "Description of the issue"
        test_contact = "contact@example.com"
        test_user_id = "user-1"
        test_user_name = "Test User"

        command = CreateIncident(test_id, test_type, test_description, test_contact, test_user_id, test_user_name)
        incident_created = command.execute()

        self.mock_add.assert_called_once_with(incident_created)
        self.mock_commit.assert_called_once()

        assert isinstance(incident_created, Incident)
        assert incident_created.id == test_id
        assert incident_created.type == test_type
        assert incident_created.description == test_description
        assert incident_created.contact == test_contact
        assert incident_created.user_issuer_id == test_user_id
        assert incident_created.user_issuer_name == test_user_name

    def test_create_incident_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateIncident(None, "Network Issue", "Description", "contact@example.com", "user-1", "Test User").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_incident_database_error(self, mocker):
        test_id = "incident-1"
        test_type = "Network Issue"
        test_description = "Description of the issue"
        test_contact = "contact@example.com"
        test_user_id = "user-1"
        test_user_name = "Test User"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateIncident(test_id, test_type, test_description, test_contact, test_user_id, test_user_name).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
