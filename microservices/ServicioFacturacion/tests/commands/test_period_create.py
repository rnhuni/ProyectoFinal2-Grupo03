import pytest
import uuid
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.period_create import CreatePeriod

class TestCreatePeriod:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_period_success(self):
        test_client_id = uuid.uuid4()
        test_period_date = "2024-01-01"
        test_active_subscription = MagicMock()
        test_active_subscription.id = uuid.uuid4()
        test_status = "active"

        command = CreatePeriod(test_client_id, test_period_date, test_active_subscription, test_status)
        period_created = command.execute()

        self.mock_add.assert_any_call(period_created)
        self.mock_commit.assert_called_once()

        assert isinstance(period_created, Period)
        assert period_created.client_id == test_client_id
        assert period_created.date == test_period_date
        assert period_created.active_subscription_id == test_active_subscription.id
        assert period_created.status == test_status

    def test_create_period_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreatePeriod(None, "2024-01-01", MagicMock(id=uuid.uuid4()), "active").execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_period_database_error(self, mocker):
        test_client_id = uuid.uuid4()
        test_period_date = "2024-01-01"
        test_active_subscription = MagicMock()
        test_active_subscription.id = uuid.uuid4()
        test_status = "active"

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreatePeriod(test_client_id, test_period_date, test_active_subscription, test_status).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()