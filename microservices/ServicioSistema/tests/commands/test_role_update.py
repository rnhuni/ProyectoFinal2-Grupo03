import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.role import Role
from ServicioSistema.models.role_permission import RolePermission
from ServicioSistema.commands.role_update import UpdateRole

class TestUpdateRole():
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        # Mockear las operaciones de la base de datos
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_flush = mocker.patch.object(session, 'flush')
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_filter_by = self.mock_query.return_value.filter_by

    def test_update_role(self):
        test_data = {
            "id": 1,
            "name": "Updated Test Role",
            "permissions": [
                {
                    "id": 101,
                    "actions": ["read", "write"]
                },
                {
                    "id": 102,
                    "actions": ["read"]
                }
            ]
        }

        # Simular un rol existente en la base de datos
        mock_role = Role(id=test_data["id"], name="Old Role Name")
        self.mock_filter_by.return_value.first.return_value = mock_role

        # Ejecutar el comando de actualización
        updated_role = UpdateRole(**test_data).execute()

        # Verificar que la sesión flush, add y commit hayan sido llamados
        self.mock_flush.assert_called_once()
        assert self.mock_add.call_count == 3  # 1 vez para el rol, 2 para los permisos
        self.mock_commit.assert_called_once()

        # Verificar que el rol se haya actualizado correctamente
        assert updated_role.id == test_data['id']
        assert updated_role.name == test_data['name']

    def test_role_not_found(self):
        # Simular que el rol no se encuentra en la base de datos
        self.mock_filter_by.return_value.first.return_value = None

        # Datos de prueba
        test_data = {
            "id": "non-existent-role",
            "name": "Updated Role",
            "permissions": [
                {
                    "id": 101,
                    "actions": ["read", "write"]
                }
            ]
        }

        # Intentar ejecutar el comando y capturar la excepción
        with pytest.raises(ValueError, match="Role not found"):
            UpdateRole(**test_data).execute()

        # Verificar que no se haya hecho commit ni flush
        self.mock_commit.assert_not_called()
        self.mock_flush.assert_not_called()
    
    def test_invalid_data_provided(self):
        # Caso donde falta el nombre
        test_data = {
            "id": 1,
            "name": "",
            "permissions": [
                {
                    "id": 101,
                    "actions": ["read", "write"]
                }
            ]
        }

        # Esperar que se lance una excepción de "Invalid data provided"
        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdateRole(**test_data).execute()

        # Verificar que no se haya hecho commit ni flush
        self.mock_commit.assert_not_called()
        self.mock_flush.assert_not_called()

    def test_missing_permission_id(self):
        # Caso donde un permiso no tiene 'id'
        test_data = {
            "id": 1,
            "name": "Updated Test Role",
            "permissions": [
                {
                    "actions": ["read", "write"]  # Falta el 'id'
                }
            ]
        }

        # Esperar que se lance una excepción de "Permission ID is missing"
        with pytest.raises(ValueError, match="Permission ID is missing"):
            UpdateRole(**test_data).execute()

        # Verificar que no se haya hecho commit ni flush
        self.mock_commit.assert_not_called()
        self.mock_flush.assert_not_called()