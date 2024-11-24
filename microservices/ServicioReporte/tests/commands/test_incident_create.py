import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime
from ServicioReporte.models.model import session
from ServicioReporte.models.incident import Incident
from ServicioReporte.commands.incident_create import CreateIncident

class TestCreateIncident:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_incident_success(self):
        command = CreateIncident(
            incident_id="incident-1",
            client_id="client-123",
            source_id="source-456",
            source_name="John Doe",
            channel_id="channel-789",
            channel_name="Support",
            created_at="2024-01-01T12:00:00",
            sla=1440
        )
        incident_created = command.execute()

        self.mock_add.assert_called_once_with(incident_created)
        self.mock_commit.assert_called_once()

        assert isinstance(incident_created, Incident)
        assert incident_created.incident_id == "incident-1"
        assert incident_created.client_id == "client-123"
        assert incident_created.incident_user_issuer_id == "source-456"
        assert incident_created.incident_user_issuer_name == "John Doe"
        assert incident_created.incident_status == "OPEN"
        assert incident_created.channel_id == "channel-789"
        assert incident_created.channel_name == "Support"
        assert incident_created.incident_created_at == datetime.fromisoformat("2024-01-01T12:00:00")
        assert incident_created.sla == 1440

    def test_create_incident_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateIncident(
                incident_id=None,
                client_id="client-123",
                source_id="source-456",
                source_name="John Doe",
                channel_id="channel-789",
                channel_name="Support",
                created_at="2024-01-01T12:00:00",
                sla=1440
            ).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_incident_database_error(self):
        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateIncident(
                incident_id="incident-1",
                client_id="client-123",
                source_id="source-456",
                source_name="John Doe",
                channel_id="channel-789",
                channel_name="Support",
                created_at="2024-01-01T12:00:00",
                sla=1440
            ).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
