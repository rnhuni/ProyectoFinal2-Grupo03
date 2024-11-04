import pytest
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.invoice import Invoice
from ServicioFacturacion.commands.invoice_get import GetInvoice

class TestGetInvoice:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        # Mocks para las operaciones de sesión y consulta
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_filter_by = self.mock_query.return_value.filter_by
        self.mock_first = self.mock_filter_by.return_value.first

    def test_get_invoice_found(self):
        # Configura una factura simulada para devolverla como resultado de la consulta
        mock_invoice = MagicMock(spec=Invoice)
        mock_invoice.id = "invoice-123"
        mock_invoice.description = "Test invoice description"
        mock_invoice.date = "2024-01-01"
        mock_invoice.amount = 100.0
        mock_invoice.status = "ACTIVE"

        # Configura el mock de la consulta para devolver la factura simulada
        self.mock_first.return_value = mock_invoice

        # Ejecuta el comando
        command = GetInvoice("invoice-123")
        invoice = command.execute()

        # Verificar que la factura devuelta sea la esperada
        assert invoice == mock_invoice
        assert invoice.id == "invoice-123"
        assert invoice.description == "Test invoice description"
        assert invoice.date == "2024-01-01"
        assert invoice.amount == 100.0
        assert invoice.status == "ACTIVE"

    def test_get_invoice_not_found(self):
        # Configura el mock de la consulta para devolver None, simulando que no se encontró la factura
        self.mock_first.return_value = None

        # Ejecuta el comando
        command = GetInvoice("nonexistent-invoice-id")
        invoice = command.execute()

        # Verifica que no se haya encontrado ninguna factura
        assert invoice is None
