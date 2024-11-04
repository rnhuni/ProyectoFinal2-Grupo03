import pytest
import uuid
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.payment import Payment
from ServicioFacturacion.commands.payment_get import GetPayment

class TestGetPayment:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_filter_by = self.mock_query.return_value.filter_by
        self.mock_first = self.mock_filter_by.return_value.first

    def test_get_payment_success(self):
        test_id = str(uuid.uuid4())
        mock_payment = MagicMock(spec=Payment)
        mock_payment.id = test_id
        mock_payment.description = "Test payment description"
        mock_payment.period_id = str(uuid.uuid4())
        mock_payment.date = "2024-01-01"
        mock_payment.amount = 100.0
        mock_payment.status = "PAID"

        self.mock_first.return_value = mock_payment

        command = GetPayment(test_id)
        payment = command.execute()

        self.mock_query.assert_called_once_with(Payment)
        self.mock_filter_by.assert_called_once_with(id=test_id)
        self.mock_first.assert_called_once()

        assert payment == mock_payment
        assert payment.id == test_id
        assert payment.description == "Test payment description"
        assert payment.date == "2024-01-01"
        assert payment.amount == 100.0
        assert payment.status == "PAID"

    def test_get_payment_not_found(self):
        self.mock_first.return_value = None

        command = GetPayment("nonexistent-id")
        payment = command.execute()

        self.mock_query.assert_called_once_with(Payment)
        self.mock_filter_by.assert_called_once_with(id="nonexistent-id")
        self.mock_first.assert_called_once()

        assert payment is None

    def test_get_payment_database_error(self):
        self.mock_first.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            GetPayment("some-id").execute()

        self.mock_query.assert_called_once_with(Payment)
        self.mock_filter_by.assert_called_once_with(id="some-id")
        self.mock_first.assert_called_once()