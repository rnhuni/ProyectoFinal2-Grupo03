import pytest
from unittest.mock import MagicMock
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.invoice import Invoice
from ServicioFacturacion.commands.invoice_get_all import GetAllInvoices

class TestGetAllInvoices:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        # Mock para la consulta de sesión
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_all = self.mock_query.return_value.all

    def test_get_all_invoices_found(self):
        # Configura facturas simuladas para devolverlas como resultado de la consulta
        mock_invoice1 = MagicMock(spec=Invoice)
        mock_invoice1.id = "invoice-123"
        mock_invoice1.description = "Test invoice 1"
        mock_invoice1.date = "2024-01-01"
        mock_invoice1.amount = 100.0
        mock_invoice1.status = "ACTIVE"

        mock_invoice2 = MagicMock(spec=Invoice)
        mock_invoice2.id = "invoice-456"
        mock_invoice2.description = "Test invoice 2"
        mock_invoice2.date = "2024-02-01"
        mock_invoice2.amount = 200.0
        mock_invoice2.status = "PENDING"

        # Configura el mock de la consulta para devolver la lista de facturas simuladas
        self.mock_all.return_value = [mock_invoice1, mock_invoice2]

        # Ejecuta el comando
        command = GetAllInvoices()
        invoices = command.execute()

        # Verifica que las facturas devueltas sean las esperadas
        assert invoices == [mock_invoice1, mock_invoice2]
        assert len(invoices) == 2
        assert invoices[0].id == "invoice-123"
        assert invoices[1].id == "invoice-456"

    def test_get_all_invoices_empty(self):
        # Configura el mock de la consulta para devolver una lista vacía, simulando que no hay facturas
        self.mock_all.return_value = []

        # Ejecuta el comando
        command = GetAllInvoices()
        invoices = command.execute()

        # Verifica que no se hayan encontrado facturas
        assert invoices == []
