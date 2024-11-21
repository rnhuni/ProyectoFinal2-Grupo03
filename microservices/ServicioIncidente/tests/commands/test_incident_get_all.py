import pytest
from unittest.mock import MagicMock, patch
from sqlalchemy.orm.query import Query
from ServicioIncidente.models.model import session
from ServicioIncidente.models.incident import Incident
from ServicioIncidente.commands.incident_get_all import GetAllIncidents

class TestGetAllIncidents:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_query_instance = self.mock_query.return_value
        self.mock_query_instance.filter.return_value = self.mock_query_instance
        self.mock_query_instance.order_by.return_value = self.mock_query_instance
        self.mock_query_instance.all.return_value = []

    def test_get_all_incidents_with_all_filters(self):
        mock_incidents = [MagicMock(spec=Incident), MagicMock(spec=Incident)]
        self.mock_query_instance.all.return_value = mock_incidents

        command = GetAllIncidents(
            status="open",
            assigned_to="123",
            user_issuer="456",
            order="asc",
            start_date="2023-11-01T00:00:00",
            end_date="2023-11-15T00:00:00"
        )
        incidents = command.execute()

        assert incidents == mock_incidents
        self.mock_query.assert_called_once_with(Incident)
        self.mock_query_instance.filter.assert_called()
        self.mock_query_instance.order_by.assert_called_once()

    def test_get_all_incidents_with_partial_filters(self):
        mock_incidents = [MagicMock(spec=Incident)]
        self.mock_query_instance.all.return_value = mock_incidents

        command = GetAllIncidents(
            status="closed",
            assigned_to=None,
            user_issuer="789",
            order="desc",
            start_date=None,
            end_date=None
        )
        incidents = command.execute()

        assert incidents == mock_incidents
        self.mock_query.assert_called_once_with(Incident)
        self.mock_query_instance.filter.assert_called()
        self.mock_query_instance.order_by.assert_called_once()

    def test_get_all_incidents_no_filters(self):
        mock_incidents = []
        self.mock_query_instance.all.return_value = mock_incidents

        command = GetAllIncidents()
        incidents = command.execute()

        assert incidents == mock_incidents
        self.mock_query.assert_called_once_with(Incident)
        self.mock_query_instance.filter.assert_not_called()
        self.mock_query_instance.order_by.assert_called_once()

    def test_get_all_incidents_database_error(self):
        self.mock_query_instance.all.side_effect = Exception("Database error")

        command = GetAllIncidents()
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_query.assert_called_once_with(Incident)
        self.mock_query_instance.filter.assert_not_called()
