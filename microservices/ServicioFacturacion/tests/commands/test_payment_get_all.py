import pytest
import uuid
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.payment import Payment
from ServicioFacturacion.commands.payment_get_all import GetAllPayments

class TestGetAllPayments:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_all = self.mock_query.return_value.all

    def test_get_all_payments_success(self):
        mock_payment_1 = MagicMock(spec=Payment)
        mock_payment_1.id = str(uuid.uuid4())
        mock_payment_1.description = "Payment 1"
        mock_payment_1.period_id = str(uuid.uuid4())
        mock_payment_1.date = "2024-01-01"
        mock_payment_1.amount = 150.0
        mock_payment_1.status = "PAID"

        mock_payment_2 = MagicMock(spec=Payment)
        mock_payment_2.id = str(uuid.uuid4())
        mock_payment_2.description = "Payment 2"
        mock_payment_2.period_id = str(uuid.uuid4())
        mock_payment_2.date = "2024-01-02"
        mock_payment_2.amount = 200.0
        mock_payment_2.status = "PENDING"

        self.mock_all.return_value = [mock_payment_1, mock_payment_2]

        command = GetAllPayments()
        payments = command.execute()

        self.mock_query.assert_called_once_with(Payment)
        self.mock_all.assert_called_once()

        assert payments == [mock_payment_1, mock_payment_2]
        assert len(payments) == 2
        assert payments[0].description == "Payment 1"
        assert payments[1].description == "Payment 2"

    def test_get_all_payments_database_error(self):
        self.mock_all.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            GetAllPayments().execute()

        self.mock_query.assert_called_once_with(Payment)
        self.mock_all.assert_called_once()