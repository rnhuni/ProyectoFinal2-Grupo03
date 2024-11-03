import pytest
import uuid
from unittest.mock import MagicMock, patch
from ServicioFacturacion.models.model import session
from ServicioFacturacion.models.active_subscription import ActiveSubscription, ActiveSubscriptionFeature
from ServicioFacturacion.models.period import Period
from ServicioFacturacion.commands.active_subscription_create import CreateActiveSubscription

class TestCreateActiveSubscription:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_rollback = mocker.patch.object(session, 'rollback')
        self.mock_flush = mocker.patch.object(session, 'flush')

    def test_create_active_subscription_success(self):
        test_client_id = str(uuid.uuid4())
        test_base_subscription = {
            "id": "base-id",
            "name": "Base Subscription",
            "description": "Test subscription",
            "price": 10.0
        }
        test_features = [
            {"id": "feat1", "name": "Feature 1", "price": 5.0},
            {"id": "feat2", "name": "Feature 2", "price": 3.0}
        ]
        notify_by_email = True

        command = CreateActiveSubscription(test_client_id, test_base_subscription, test_features, notify_by_email)
        active_subscription_created = command.execute()

        self.mock_add.assert_any_call(active_subscription_created)
        self.mock_flush.assert_called_once()
        self.mock_commit.assert_called_once()

        assert isinstance(active_subscription_created, ActiveSubscription)
        assert active_subscription_created.client_id == test_client_id
        assert active_subscription_created.base_id == test_base_subscription["id"]
        assert active_subscription_created.notify_by_email == notify_by_email

    def test_create_active_subscription_invalid_data(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateActiveSubscription(None, None, [], None).execute()

        self.mock_add.assert_not_called()
        self.mock_commit.assert_not_called()

    def test_create_active_subscription_database_error(self):
        test_client_id = str(uuid.uuid4())
        test_base_subscription = {
            "id": "base-id",
            "name": "Base Subscription",
            "description": "Test subscription",
            "price": 10.0
        }
        test_features = [{"id": "feat1", "name": "Feature 1", "price": 5.0}]
        notify_by_email = True

        self.mock_add.side_effect = Exception("Database error")

        with pytest.raises(Exception, match="Database error"):
            CreateActiveSubscription(test_client_id, test_base_subscription, test_features, notify_by_email).execute()

        self.mock_add.assert_called_once()
        self.mock_commit.assert_not_called()
        self.mock_rollback.assert_called_once()