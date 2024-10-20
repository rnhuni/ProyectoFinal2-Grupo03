import pytest
from unittest.mock import MagicMock
from ServicioSistema.commands.subscription_plan_get import GetSubscriptionPlan
from ServicioSistema.models.subscription_plan import SubscriptionPlan
from ServicioSistema.models.model import session

class TestGetSubscriptionPlan:

    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query')

    def test_get_subscription_plan_success(self):
        mock_plan = SubscriptionPlan(
            id="plan-1",
            name="Premium Plan",
            description="Access to premium features",
            status="active",
            price=19.99,
            features="Feature1, Feature2"
        )

        mock_query_instance = self.mock_query.return_value
        mock_query_instance.get.return_value = mock_plan

        result = GetSubscriptionPlan(id="plan-1").execute()

        assert result.id == "plan-1"
        assert result.name == "Premium Plan"
        mock_query_instance.get.assert_called_once_with("plan-1")

    def test_get_subscription_plan_no_id(self):
        with pytest.raises(ValueError, match="Invalid data provided"):
            GetSubscriptionPlan(id=None).execute()

    def test_get_subscription_plan_not_found(self):
        mock_query_instance = self.mock_query.return_value
        mock_query_instance.get.return_value = None

        result = GetSubscriptionPlan(id="nonexistent-id").execute()

        assert result is None
        mock_query_instance.get.assert_called_once_with("nonexistent-id")