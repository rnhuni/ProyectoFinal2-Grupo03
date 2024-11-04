import pytest
import uuid
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.payment import Payment
from ServicioFacturacion.commands.payment_update import UpdatePayment

class TestUpdatePayment:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_get = self.mock_query.return_value.get
        self.mock_commit = mocker.patch.object(session, 'commit')

    def test_update_payment_success(self):
        mock_payment = MagicMock(spec=Payment)
        mock_payment.id = "payment-123"
        self.mock_get.return_value = mock_payment

        updated_description = "Updated description"
        updated_period_id = str(uuid.uuid4())
        updated_date = "2024-01-01"
        updated_amount = 200.0
        updated_status = "PAID"

        command = UpdatePayment(
            payment_id="payment-123",
            description=updated_description,
            period_id=updated_period_id,
            date=updated_date,
            amount=updated_amount,
            status=updated_status
        )
        updated_payment = command.execute()

        assert updated_payment.description == updated_description
        assert updated_payment.period_id == updated_period_id
        assert updated_payment.date == updated_date
        assert updated_payment.amount == updated_amount
        assert updated_payment.status == updated_status

        self.mock_get.assert_called_once_with("payment-123")
        self.mock_commit.assert_called_once()

    def test_update_payment_not_found(self):
        self.mock_get.return_value = None

        with pytest.raises(ValueError, match="Payment not found"):
            UpdatePayment(payment_id="nonexistent-payment-id").execute()

        self.mock_commit.assert_not_called()

    def test_update_payment_database_error(self):
        mock_payment = MagicMock(spec=Payment)
        mock_payment.id = "payment-123"
        self.mock_get.return_value = mock_payment

        self.mock_commit.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            UpdatePayment(payment_id="payment-123", description="Updated description").execute()

        self.mock_commit.assert_called_once()