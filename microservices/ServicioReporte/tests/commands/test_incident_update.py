import pytest
from unittest.mock import MagicMock, patch
from ServicioReporte.models.model import session
from ServicioReporte.models.incident import Incident
from ServicioReporte.commands.incident_update import UpdateIncident

class TestUpdateIncident:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_query_instance = self.mock_query.return_value
        self.mock_query_instance.filter_by.return_value.first.return_value = MagicMock(spec=Incident)
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_update_incident_all_fields(self):
        mock_incident = self.mock_query_instance.filter_by.return_value.first.return_value

        command = UpdateIncident(
            incident_id="incident-1",
            incident_assigned_to_id="user-123",
            incident_assigned_to_name="John Doe",
            status="CLOSED",
            incident_closed_by_id="agent-789",
            incident_closed_by_name="Agent Smith",
            sla_ok=True,
            resolution_time=500,
            feedback_id="feedback-321",
            feedback_support_rating=5,
            feedback_ease_of_contact=4,
            feedback_support_staff_attitude=5,
            feedback_resolution_time=300
        )
        result = command.execute()

        assert result == mock_incident
        assert mock_incident.incident_assigned_to_id == "user-123"
        assert mock_incident.incident_assigned_to_name == "John Doe"
        assert mock_incident.incident_status == "CLOSED"
        assert mock_incident.incident_closed_by_id == "agent-789"
        assert mock_incident.incident_closed_by_name == "Agent Smith"
        assert mock_incident.sla_ok is True
        assert mock_incident.resolution_time == 500
        assert mock_incident.feedback_id == "feedback-321"
        assert mock_incident.feedback_support_rating == 5
        assert mock_incident.feedback_ease_of_contact == 4
        assert mock_incident.feedback_support_staff_attitude == 5
        assert mock_incident.feedback_resolution_time == 300
        self.mock_commit.assert_called_once()

    def test_update_incident_partial_fields(self):
        mock_incident = self.mock_query_instance.filter_by.return_value.first.return_value

        command = UpdateIncident(
            incident_id="incident-1",
            status="IN_PROGRESS",
            feedback_support_rating=3
        )
        result = command.execute()

        assert result == mock_incident
        assert mock_incident.incident_status == "IN_PROGRESS"
        assert mock_incident.feedback_support_rating == 3
        self.mock_commit.assert_called_once()

    def test_update_incident_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateIncident(None).execute()

        self.mock_commit.assert_not_called()

    def test_update_incident_not_found(self):
        self.mock_query_instance.filter_by.return_value.first.return_value = None

        command = UpdateIncident(incident_id="nonexistent-id")
        with pytest.raises(ValueError, match="Incident not found"):
            command.execute()

        self.mock_commit.assert_not_called()

    def test_update_incident_no_fields_updated(self):
        mock_incident = self.mock_query_instance.filter_by.return_value.first.return_value

        command = UpdateIncident(incident_id="incident-1")
        result = command.execute()

        assert result == mock_incident
        self.mock_commit.assert_called_once()
        # Ensure no changes were made

    def test_update_incident_database_error(self):
        self.mock_query_instance.filter_by.side_effect = Exception("Database error")

        command = UpdateIncident(incident_id="incident-1")
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        

    def test_update_incident_rollback_on_error(self):
        mock_incident = self.mock_query_instance.filter_by.return_value.first.return_value
        self.mock_commit.side_effect = Exception("Commit failed")

        command = UpdateIncident(
            incident_id="incident-1",
            status="CLOSED",
            feedback_support_rating=5
        )

        with pytest.raises(Exception, match="Commit failed"):
            command.execute()

        assert mock_incident.incident_status == "CLOSED"
        assert mock_incident.feedback_support_rating == 5
        self.mock_rollback.assert_called_once()
