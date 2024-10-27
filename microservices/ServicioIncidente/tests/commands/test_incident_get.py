import pytest
from unittest.mock import MagicMock, patch
from ServicioIncidente.models.model import session
from ServicioIncidente.models.incident import Incident
from ServicioIncidente.commands.incident_get import GetIncident

class TestGetIncident:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        # Mockear los métodos de sesión de la base de datos
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_filter_by = self.mock_query.return_value.filter_by
        self.mock_first = self.mock_filter_by.return_value.first

    def test_get_incident_success(self):
        # Configurar el incidente simulado
        incident_id = "incident-1"
        mock_incident = Incident(
            id=incident_id,
            type="Network Issue",
            description="Description of the issue",
            contact=None,
            user_issuer_id="user-1",
            user_issuer_name="Test User"
        )

        # Configurar el retorno del mock para `first`
        self.mock_first.return_value = mock_incident

        # Ejecutar el comando
        command = GetIncident(incident_id)
        result = command.execute()

        # Verificar que el resultado es el incidente simulado
        self.mock_query.assert_called_once_with(Incident)
        self.mock_filter_by.assert_called_once_with(id=incident_id)
        assert result == mock_incident

    def test_get_incident_not_found(self):
        # Configurar el retorno del mock para `first` como None, simulando un incidente no encontrado
        self.mock_first.return_value = None

        # Ejecutar el comando
        command = GetIncident("non_existent_incident")
        result = command.execute()

        # Verificar que el resultado es None cuando el incidente no se encuentra
        self.mock_query.assert_called_once_with(Incident)
        self.mock_filter_by.assert_called_once_with(id="non_existent_incident")
        assert result is None

    def test_get_incident_database_error(self, mocker):
        # Configurar el mock para que `first` lance una excepción
        self.mock_first.side_effect = Exception("Database error")

        # Verificar que se lanza una excepción al ejecutar el comando
        command = GetIncident("incident-1")
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        # Verificar que los métodos de consulta fueron llamados antes del error
        self.mock_query.assert_called_once_with(Incident)
        self.mock_filter_by.assert_called_once_with(id="incident-1")
