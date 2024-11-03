import pytest
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.period_update import UpdatePeriod

class TestUpdatePeriod:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_update_period_success(self):
        mock_period = MagicMock(spec=Period)
        mock_active_subscription = MagicMock()
        mock_active_subscription.id = "subscription-id"
        new_status = "updated-status"

        command = UpdatePeriod(mock_period, mock_active_subscription, new_status)
        updated_period = command.execute()

        assert updated_period == mock_period
        assert updated_period.active_subscription_id == mock_active_subscription.id
        assert updated_period.status == new_status
        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_not_called()

    def test_update_period_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdatePeriod(None, MagicMock(), "status").execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdatePeriod(MagicMock(), None, "status").execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            UpdatePeriod(MagicMock(), MagicMock(), None).execute()

        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_not_called()

    def test_update_period_database_error(self):
        mock_period = MagicMock(spec=Period)
        mock_active_subscription = MagicMock()
        mock_active_subscription.id = "subscription-id"
        new_status = "updated-status"

        self.mock_commit.side_effect = Exception("Database error")

        command = UpdatePeriod(mock_period, mock_active_subscription, new_status)
        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()