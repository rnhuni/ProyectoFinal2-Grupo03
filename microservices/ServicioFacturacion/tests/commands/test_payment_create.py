import pytest
import uuid
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.payment import Payment
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.payment_create import CreatePayment

class TestCreatePayment:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_payment_success(self):
        test_id = str(uuid.uuid4())
        test_description = "Test payment description"
        test_period_id = str(uuid.uuid4())
        test_date = "2024-01-01"
        test_amount = 100.0
        test_status = "PAID"

        command = CreatePayment(test_id, test_description, test_period_id, test_date, test_amount, test_status)
        payment_created = command.execute()

        self.mock_add.assert_any_call(payment_created)
        self.mock_commit.assert_called_once()

        assert isinstance(payment_created, Payment)
        assert payment_created.id == test_id
        assert payment_created.description == test_description
        assert payment_created.period_id == test_period_id
        assert payment_created.date == test_date
        assert payment_created.amount == test_amount
        assert payment_created.status == test_status

    def test_create_payment_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreatePayment(None, "Test description", str(uuid.uuid4()), "2024-01-01", 100.0, "PAID").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_payment_database_error(self):
        test_id = str(uuid.uuid4())
        test_description = "Test payment description"
        test_period_id = str(uuid.uuid4())
        test_date = "2024-01-01"
        test_amount = 100.0
        test_status = "PAID"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreatePayment(test_id, test_description, test_period_id, test_date, test_amount, test_status).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()