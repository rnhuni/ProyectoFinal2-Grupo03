import pytest
import uuid
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.invoice import Invoice
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.invoice_create import CreateInvoice

class TestCreateInvoice:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_invoice_success(self):
        test_id = uuid.uuid4()
        test_description = "Test invoice description"
        test_period_id = uuid.uuid4()
        test_date = "2024-01-01"
        test_amount = 100.0
        test_status = "ACTIVE"

        command = CreateInvoice(test_id, test_description, test_period_id, test_date, test_amount, test_status)
        invoice_created = command.execute()

        self.mock_add.assert_any_call(invoice_created)
        self.mock_commit.assert_called_once()

        assert isinstance(invoice_created, Invoice)
        assert invoice_created.id == test_id
        assert invoice_created.description == test_description
        assert invoice_created.period_id == test_period_id
        assert invoice_created.date == test_date
        assert invoice_created.amount == test_amount
        assert invoice_created.status == test_status

    def test_create_invoice_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateInvoice(None, "Test description", uuid.uuid4(), "2024-01-01", 100.0, "ACTIVE").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_invoice_database_error(self, mocker):
        test_id = uuid.uuid4()
        test_description = "Test invoice description"
        test_period_id = uuid.uuid4()
        test_date = "2024-01-01"
        test_amount = 100.0
        test_status = "ACTIVE"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateInvoice(test_id, test_description, test_period_id, test_date, test_amount, test_status).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()
