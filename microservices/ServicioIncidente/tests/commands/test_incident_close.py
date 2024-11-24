import pytest
from unittest.mock import MagicMock, patch
from ServicioIncidente.models.model import session
from ServicioIncidente.models.incident import Incident
from ServicioIncidente.commands.incident_close import CloseIncident

class TestCloseIncident:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_query_instance = self.mock_query.return_value
        self.mock_query_instance.filter_by.return_value.first.return_value = None
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_close_incident_success(self):
        mock_incident = MagicMock(spec=Incident)
        self.mock_query_instance.filter_by.return_value.first.return_value = mock_incident

        command = CloseIncident(
            incident_id="incident-1",
            user_id="user-123",
            user_name="John Doe",
            user_type="admin"
        )
        result = command.execute()

        assert result == mock_incident
        assert mock_incident.closed_by_id == "user-123"
        assert mock_incident.closed_by_name == "John Doe"
        assert mock_incident.closed_by_type == "admin"
        assert mock_incident.status == "CLOSED"
        self.mock_commit.assert_called_once()

    def test_close_incident_not_found(self):
        self.mock_query_instance.filter_by.return_value.first.return_value = None

        command = CloseIncident(
            incident_id="nonexistent-id",
            user_id="user-123",
            user_name="John Doe",
            user_type="admin"
        )
        with pytest.raises(ValueError, match="Incident not found"):
            command.execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()

    def test_close_incident_no_id(self):
        command = CloseIncident(
            incident_id=None,
            user_id="user-123",
            user_name="John Doe",
            user_type="admin"
        )
        with pytest.raises(ValueError, match="Incident ID is required"):
            command.execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_not_called()

    def test_close_incident_database_error(self):
        self.mock_query_instance.filter_by.side_effect = Exception("Database error")

        command = CloseIncident(
            incident_id="incident-1",
            user_id="user-123",
            user_name="John Doe",
            user_type="admin"
        )
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
