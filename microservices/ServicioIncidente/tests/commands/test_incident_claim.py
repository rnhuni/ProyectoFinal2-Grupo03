import pytest
from unittest.mock import MagicMock, patch
from ServicioIncidente.models.model import session
from ServicioIncidente.models.incident import Incident
from ServicioIncidente.commands.incident_claim import ClaimIncident

class TestClaimIncident:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_query_instance = self.mock_query.return_value
        self.mock_query_instance.filter_by.return_value.first.return_value = None
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_claim_incident_success(self):
        mock_incident = MagicMock(spec=Incident)
        self.mock_query_instance.filter_by.return_value.first.return_value = mock_incident

        command = ClaimIncident(
            incident_id="incident-1",
            user_id="user-123",
            user_name="John Doe",
            user_type="admin"
        )
        result = command.execute()

        assert result == mock_incident
        assert mock_incident.assigned_to_id == "user-123"
        assert mock_incident.assigned_to_name == "John Doe"
        assert mock_incident.assigned_to_type == "admin"
        assert mock_incident.status == "ASSIGNED"
        self.mock_commit.assert_called_once()

    def test_claim_incident_not_found(self):
        self.mock_query_instance.filter_by.return_value.first.return_value = None

        command = ClaimIncident(
            incident_id="nonexistent-id",
            user_id="user-123",
            user_name="John Doe",
            user_type="admin"
        )
        with pytest.raises(ValueError, match="Incident not found"):
            command.execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()

    def test_claim_incident_no_id(self):
        command = ClaimIncident(
            incident_id=None,
            user_id="user-123",
            user_name="John Doe",
            user_type="admin"
        )
        with pytest.raises(ValueError, match="Incident ID is required"):
            command.execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_not_called()

    def test_claim_incident_database_error(self):
        self.mock_query_instance.filter_by.side_effect = Exception("Database error")

        command = ClaimIncident(
            incident_id="incident-1",
            user_id="user-123",
            user_name="John Doe",
            user_type="admin"
        )
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
