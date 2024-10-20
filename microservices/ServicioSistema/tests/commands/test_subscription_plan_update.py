import pytest
from unittest.mock import MagicMock
from ServicioSistema.models.model import session
from ServicioSistema.models.subscription_plan import SubscriptionPlan
from ServicioSistema.models.role import Role
from ServicioSistema.commands.subscription_plan_update import UpdateSubscriptionPlan

class TestUpdateSubscriptionPlan:
    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_query = mocker.patch.object(session, 'query', return_value=MagicMock())
        self.mock_commit = mocker.patch.object(session, 'commit')

    def test_update_subscription_plan_success(self):
        test_subscription_id = "plan-1"
        mock_plan = MagicMock(spec=SubscriptionPlan)
        mock_role_1 = MagicMock(spec=Role)
        mock_role_2 = MagicMock(spec=Role)

        self.mock_query.return_value.get.side_effect = [mock_plan, mock_role_1, mock_role_2]

        mock_plan.roles = [mock_role_1, mock_role_2]

        updated_plan = UpdateSubscriptionPlan(
            subscription_id=test_subscription_id,
            name="Updated Plan",
            description="Updated description",
            status="inactive",
            price=29.99,
            features="Updated Feature1, Updated Feature2",
            roles=["role-1", "role-2"]
        ).execute()

        self.mock_query.return_value.get.assert_any_call(test_subscription_id)
        assert mock_plan.name == "Updated Plan"
        assert mock_plan.description == "Updated description"
        assert mock_plan.status == "inactive"
        assert mock_plan.price == 29.99
        assert mock_plan.features == "Updated Feature1, Updated Feature2"
        
        assert mock_plan.roles == [mock_role_1, mock_role_2]

        self.mock_commit.assert_called_once()


    def test_update_subscription_plan_not_found(self):
        test_subscription_id = "invalid-plan-id"

        self.mock_query.return_value.get.return_value = None

        with pytest.raises(ValueError, match=f"Subscription with ID '{test_subscription_id}' not found"):
            UpdateSubscriptionPlan(
                subscription_id=test_subscription_id,
                name="Updated Plan",
                description="Updated description",
                status="inactive",
                price=29.99,
                features="Updated Feature1, Updated Feature2",
                roles=["role-1", "role-2"]
            ).execute()

        self.mock_query.return_value.get.assert_called_once_with(test_subscription_id)
        self.mock_commit.assert_not_called()

    def test_update_subscription_plan_name_required(self):
        test_subscription_id = "plan-1"
        mock_plan = MagicMock(spec=SubscriptionPlan)

        self.mock_query.return_value.get.return_value = mock_plan

        with pytest.raises(ValueError, match="Name is required"):
            UpdateSubscriptionPlan(
                subscription_id=test_subscription_id,
                name="",  # Nombre vacío
                description="Updated description",
                status="inactive",
                price=29.99,
                features="Updated Feature1, Updated Feature2",
                roles=["role-1", "role-2"]
            ).execute()

    def test_update_subscription_plan_invalid_price(self):
        test_subscription_id = "plan-1"
        mock_plan = MagicMock(spec=SubscriptionPlan)

        self.mock_query.return_value.get.return_value = mock_plan

        with pytest.raises(ValueError, match="Price must be a positive number"):
            UpdateSubscriptionPlan(
                subscription_id=test_subscription_id,
                name="Updated Plan",
                description="Updated description",
                status="inactive",
                price=-10.00,  # Precio negativo
                features="Updated Feature1, Updated Feature2",
                roles=["role-1", "role-2"]
            ).execute()

    def test_update_subscription_plan_role_not_found(self):
        test_subscription_id = "plan-1"
        mock_plan = MagicMock(spec=SubscriptionPlan)
        mock_role_1 = MagicMock(spec=Role)

        self.mock_query.return_value.get.side_effect = [mock_plan, mock_role_1, None]

        with pytest.raises(ValueError, match="Role with ID 'role-2' not found"):
            UpdateSubscriptionPlan(
                subscription_id=test_subscription_id,
                name="Updated Plan",
                description="Updated description",
                status="inactive",
                price=29.99,
                features="Updated Feature1, Updated Feature2",
                roles=["role-1", "role-2"]
            ).execute()

        self.mock_commit.assert_not_called()
