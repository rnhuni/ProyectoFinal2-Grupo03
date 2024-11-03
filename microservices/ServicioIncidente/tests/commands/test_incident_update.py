import pytest
from unittest.mock import patch, MagicMock
from ServicioIncidente.models.model import session
from ServicioIncidente.models.incident import Incident
from ServicioIncidente.commands.incident_update import UpdateIncident

class TestUpdateIncident:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        # Mockear los métodos de sesión de la base de datos
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
        self.mock_filter_by = self.mock_query.return_value.filter_by
        self.mock_first = self.mock_filter_by.return_value.first

    def test_update_incident_success(self):
        # Configurar un incidente simulado
        incident_id = "incident-1"
        mock_incident = MagicMock(spec=Incident)
        self.mock_first.return_value = mock_incident

        # Parámetros de actualización
        command = UpdateIncident(
            incident_id=incident_id,
            type="Updated Type",
            description="Updated description",
            contact="updated@example.com"
        )
        result = command.execute()

        # Verificar que el incidente fue actualizado y se realizó commit
        assert result == mock_incident
        assert mock_incident.type == "Updated Type"
        assert mock_incident.description == "Updated description"
        assert mock_incident.contact == "updated@example.com"
        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_not_called()

    def test_update_incident_not_found(self):
        # Simular que no se encuentra el incidente
        self.mock_first.return_value = None
        command = UpdateIncident(incident_id="non_existent_id")

        with pytest.raises(ValueError, match="Incident not found"):
            command.execute()

        # Verificar que no se hizo commit, pero se hizo rollback
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()

    def test_update_incident_missing_id(self):
        # Probar el caso en que no se proporciona un `incident_id`
        command = UpdateIncident(incident_id=None)

        with pytest.raises(ValueError, match="Incident ID is required"):
            command.execute()

        # Verificar que no se hicieron consultas ni cambios
        self.mock_query.assert_not_called()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_not_called()

    def test_update_incident_database_error(self):
        # Configurar un incidente simulado y que ocurra un error al hacer commit
        incident_id = "incident-1"
        mock_incident = MagicMock(spec=Incident)
        self.mock_first.return_value = mock_incident
        self.mock_commit.side_effect = Exception("Database error")

        command = UpdateIncident(
            incident_id=incident_id,
            type="Updated Type",
            description="Updated description",
            contact="updated@example.com"
        )

        # Ejecutar el comando y verificar que se lanza una excepción y se realiza rollback
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()
