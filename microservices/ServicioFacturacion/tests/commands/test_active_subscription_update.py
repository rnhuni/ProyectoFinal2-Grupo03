import pytest
from unittest.mock import patch, MagicMock
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.active_subscription import ActiveSubscription, ActiveSubscriptionFeature
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.active_subscription_update import UpdateActiveSubscription

class TestUpdateActiveSubscription:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
        self.mock_flush = mocker.patch.object(session, 'flush')
        
        self.mock_query = mocker.patch.object(session, 'query')
        self.mock_delete = self.mock_query.return_value.filter_by.return_value.delete

    def test_update_active_subscription_success(self):
        mock_active_subscription = MagicMock(spec=ActiveSubscription)
        test_base_subscription = {
            "id": "base-id",
            "name": "Base Subscription",
            "description": "Updated subscription",
            "price": 10.0
        }
        test_features = [
            {"id": "feat1", "name": "Feature 1", "price": 5.0},
            {"id": "feat2", "name": "Feature 2", "price": 3.0}
        ]
        notify_by_email = True

        command = UpdateActiveSubscription(
            active_subscription=mock_active_subscription,
            base_subscription=test_base_subscription,
            features=test_features,
            notify_by_email=notify_by_email
        )
        updated_subscription = command.execute()

        assert mock_active_subscription.base_id == test_base_subscription["id"]
        assert mock_active_subscription.base_name == test_base_subscription["name"]
        assert mock_active_subscription.description == test_base_subscription["description"]
        assert mock_active_subscription.notify_by_email == notify_by_email

        self.mock_delete.assert_called_once()
        self.mock_flush.assert_called_once()
        self.mock_commit.assert_called_once()

        assert self.mock_add.call_count == len(test_features)

    def test_update_active_subscription_invalid_data(self):
        command = UpdateActiveSubscription(None, None, [], None)
        with pytest.raises(ValueError, match="Invalid data provided"):
            command.execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()
        self.mock_flush.assert_not_called()
        self.mock_delete.assert_not_called()

    def test_update_active_subscription_database_error(self):
        mock_active_subscription = MagicMock(spec=ActiveSubscription)
        test_base_subscription = {
            "id": "base-id",
            "name": "Base Subscription",
            "description": "Updated subscription",
            "price": 10.0
        }
        test_features = [{"id": "feat1", "name": "Feature 1", "price": 5.0}]
        notify_by_email = True

        self.mock_commit.side_effect = Exception("Database error")

        command = UpdateActiveSubscription(
            active_subscription=mock_active_subscription,
            base_subscription=test_base_subscription,
            features=test_features,
            notify_by_email=notify_by_email
        )

        with pytest.raises(Exception, match="Database error"):
            command.execute()

        self.mock_commit.assert_called_once()
        self.mock_rollback.assert_called_once()