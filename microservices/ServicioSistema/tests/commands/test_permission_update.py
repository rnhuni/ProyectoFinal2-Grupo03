import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.permission import Permission
from ServicioSistema.commands.permission_update import UpdatePermission

class TestUpdatePermission():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
        self.mock_query = mocker.patch.object(session, 'query')
    
    def test_update_permission_success(self):
        # Datos para la prueba
        test_permission_id = "pem-s-1"
        test_data = {
            "name": "Updated Name",
            "resource": "UpdatedResource",
            "description": "Updated description"
        }

        # Mock del permiso existente
        mock_permission = MagicMock(spec=Permission)
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_permission

        # Ejecutar el comando
        updated_permission = UpdatePermission(
            permission_id=test_permission_id,
            name=test_data["name"],
            resource=test_data["resource"],
            description=test_data["description"]
        ).execute()

        # Verificar que los métodos correctos fueron llamados
        assert updated_permission == mock_permission
        assert mock_permission.name == test_data["name"]
        assert mock_permission.resource == test_data["resource"]
        assert mock_permission.description == test_data["description"]
        self.mock_commit.assert_called_once()

    def test_update_permission_not_found(self):
        # Datos para la prueba
        test_permission_id = "nonexistent-id"
        test_data = {
            "name": "Updated Name",
            "resource": "UpdatedResource",
            "description": "Updated description"
        }

        # Simular que no se encontró el permiso
        self.mock_query.return_value.filter_by.return_value.first.return_value = None

        # Ejecutar y verificar que se levante la excepción adecuada
        with pytest.raises(ValueError, match="Permission not found"):
            UpdatePermission(
                permission_id=test_permission_id,
                name=test_data["name"],
                resource=test_data["resource"],
                description=test_data["description"]
            ).execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()

    def test_update_permission_invalid_data(self):
        """Prueba para datos inválidos (nombre y recurso vacíos)"""
        test_permission_id = "pem-s-1"
        invalid_data = {
            "name": "",  # Nombre inválido
            "resource": "",  # Recurso inválido
            "description": "Updated description"
        }

        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdatePermission(
                permission_id=test_permission_id,
                name=invalid_data["name"],
                resource=invalid_data["resource"],
                description=invalid_data["description"]
            ).execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_not_called()

    def test_update_permission_failure_on_commit(self, mocker):
        """Simula un fallo al hacer commit"""
        test_permission_id = "pem-s-1"
        test_data = {
            "name": "Updated Name",
            "resource": "UpdatedResource",
            "description": "Updated description"
        }

        # Mock del permiso existente
        mock_permission = MagicMock(spec=Permission)
        self.mock_query.return_value.filter_by.return_value.first.return_value = mock_permission

        # Simular que el commit falla
        self.mock_commit.side_effect = Exception("Commit failed")

        # Ejecutar y verificar que se levante la excepción adecuada
        with pytest.raises(Exception, match="Commit failed"):
            UpdatePermission(
                permission_id=test_permission_id,
                name=test_data["name"],
                resource=test_data["resource"],
                description=test_data["description"]
            ).execute()

        self.mock_rollback.assert_called_once()