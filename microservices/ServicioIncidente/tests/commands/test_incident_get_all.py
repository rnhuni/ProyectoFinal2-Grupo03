import pytest
from unittest.mock import patch, MagicMock
from ServicioIncidente.models.model import session
from ServicioIncidente.models.incident import Incident
from ServicioIncidente.commands.incident_get_all import GetAllIncidents

class TestGetAllIncidents:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        # Mockear el método `query` de la sesión
        self.mock_query = mocker.patch.object(session, 'query')
        # Configurar `self.mock_all` correctamente para que devuelva el resultado de `all`
        self.mock_all = self.mock_query.return_value.all

    def test_get_all_incidents_success(self):
        # Crear incidentes simulados
        incident_1 = Incident(
            id="incident-1",
            type="Network Issue",
            description="Description of the first issue",
            contact=None,
            user_issuer_id="user-1",
            user_issuer_name="Test User 1"
        )
        incident_2 = Incident(
            id="incident-2",
            type="Software Issue",
            description="Description of the second issue",
            contact=None,
            user_issuer_id="user-2",
            user_issuer_name="Test User 2"
        )

        # Configurar el retorno del mock para `all` con los incidentes simulados
        self.mock_all.return_value = [incident_1, incident_2]

        # Ejecutar el comando
        command = GetAllIncidents()
        result = command.execute()

        # Verificar que el resultado contiene los incidentes simulados
        assert result == [incident_1, incident_2]
        self.mock_query.assert_called_once_with(Incident)
        self.mock_all.assert_called_once()

    def test_get_all_incidents_empty(self):
        # Configurar el retorno del mock para `all` como lista vacía, simulando que no hay incidentes
        self.mock_all.return_value = []

        # Ejecutar el comando
        command = GetAllIncidents()
        result = command.execute()

        # Verificar que el resultado es una lista vacía
        assert result == []
        self.mock_query.assert_called_once_with(Incident)
        self.mock_all.assert_called_once()

    def test_get_all_incidents_database_error(self):
        # Configurar el mock para que `all` lance una excepción
        self.mock_all.side_effect = Exception("Database error")

        # Ejecutar el comando y verificar que lanza una excepción
        command = GetAllIncidents()
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        # Verificar que el método `query` fue llamado antes del error
        self.mock_query.assert_called_once_with(Incident)
        self.mock_all.assert_called_once()
