import pytest
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.invoice import Invoice
from ServicioFacturacion.commands.invoice_update import UpdateInvoice

class TestUpdateInvoice:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        # Mocks para las operaciones de sesión
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_get = self.mock_query.return_value.get
        self.mock_commit = mocker.patch.object(session, 'commit')

    def test_update_invoice_success(self):
        # Configura una factura simulada para devolverla como resultado de la consulta
        mock_invoice = MagicMock(spec=Invoice)
        mock_invoice.id = "invoice-123"
        mock_invoice.description = "Old description"
        mock_invoice.period_id = "old-period-id"
        mock_invoice.date = "2024-01-01"
        mock_invoice.amount = 100.0
        mock_invoice.status = "ACTIVE"

        # Configura el mock para que `get` devuelva la factura simulada
        self.mock_get.return_value = mock_invoice

        # Datos de actualización
        new_description = "Updated description"
        new_period_id = "new-period-id"
        new_date = "2024-02-01"
        new_amount = 150.0
        new_status = "COMPLETED"

        # Ejecuta el comando
        command = UpdateInvoice(
            invoice_id="invoice-123", 
            description=new_description, 
            period_id=new_period_id,  # Actualiza period_id
            date=new_date,            # Actualiza date
            amount=new_amount, 
            status=new_status          # Actualiza status
        )
        updated_invoice = command.execute()

        # Verifica que los campos se hayan actualizado correctamente
        assert updated_invoice.description == new_description
        assert updated_invoice.period_id == new_period_id
        assert updated_invoice.date == new_date
        assert updated_invoice.amount == new_amount
        assert updated_invoice.status == new_status

        # Verifica que se llame a commit
        self.mock_commit.assert_called_once()

    def test_update_invoice_not_found(self):
        # Configura el mock para que `get` devuelva None, simulando que no se encontró la factura
        self.mock_get.return_value = None

        # Ejecuta el comando y verifica que lance un ValueError
        with pytest.raises(ValueError, match="Invoice not found"):
            UpdateInvoice(invoice_id="nonexistent-invoice-id", description="New description").execute()

        # Verifica que no se llame a commit
        self.mock_commit.assert_not_called()

    def test_update_invoice_database_error(self):
        # Configura una factura simulada para devolverla como resultado de la consulta
        mock_invoice = MagicMock(spec=Invoice)
        mock_invoice.id = "invoice-123"
        self.mock_get.return_value = mock_invoice

        # Simulamos un error de base de datos en el commit
        self.mock_commit.side_effect = Exception("Database error")

        # Ejecuta el comando y verifica que se maneje el error
        with pytest.raises(Exception, match="Database error"):
            UpdateInvoice(invoice_id="invoice-123", description="Updated description").execute()

        # Verifica que se llame a rollback en caso de error
        self.mock_commit.assert_called_once()
