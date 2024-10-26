import pytest
from unittest.mock import MagicMock, patch
from ServicioIncidente.models.model import session
from ServicioIncidente.models.incident import Incident
from ServicioIncidente.commands.incident_exists import ExistsIncident

class TestExistsIncident:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_exists_incident_success(self):
        test_id = "incident-1"
        mock_incident = MagicMock(spec=Incident)
        self.mock_query.return_value.get.return_value = mock_incident

        result = ExistsIncident(test_id).execute()

        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert result is True

    def test_exists_incident_not_found(self):
        test_id = "incident-1"
        self.mock_query.return_value.get.return_value = None

        result = ExistsIncident(test_id).execute()

        self.mock_query.return_value.get.assert_called_once_with(test_id)
        assert result is False

    def test_exists_incident_invalid_id(self):
        with pytest.raises(ValueError, match="Incident ID is required"):
            ExistsIncident(None).execute()
