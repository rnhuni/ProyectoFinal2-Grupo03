import pytest
from unittest.mock import MagicMock
from ServicioSistema.commands.subscription_plan_create import CreateSubscriptionPlan
from ServicioSistema.models.subscription_plan import SubscriptionPlan
from ServicioSistema.models.subscription_plan_role import SubscriptionPlanRole
from ServicioSistema.models.model import session

class TestCreateSubscriptionPlan:

    @pytest.fixture(autouse=True)
    def setup_method(self, mocker):
        self.mock_add = mocker.patch.object(session, 'add')
        self.mock_commit = mocker.patch.object(session, 'commit')
        self.mock_flush = mocker.patch.object(session, 'flush')
        self.mock_rollback = mocker.patch.object(session, 'rollback')

    def test_create_subscription_plan_success(self):
        test_data = {
            "id": "test_plan_id",
            "name": "Test Plan",
            "description": "A test plan",
            "status": "active",
            "price": 9.99,
            "features": "feature1, feature2",
            "roles": [1, 2]
        }

        mock_plan = SubscriptionPlan(
            id=test_data["id"],
            name=test_data["name"],
            description=test_data["description"],
            status=test_data["status"],
            price=test_data["price"],
            features=test_data["features"]
        )
        self.mock_add.side_effect = lambda x: None

        plan_created = CreateSubscriptionPlan(**test_data).execute()

        self.mock_flush.assert_called_once()
        self.mock_commit.assert_called_once()

        assert plan_created.id == test_data['id']
        assert plan_created.name == test_data['name']

    def test_create_subscription_plan_invalid_data(client, mocker):
        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateSubscriptionPlan(id=None, name="Test Plan", description="Desc", status="active", price=9.99, features="features", roles=[1, 2]).execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateSubscriptionPlan(id="test_id", name=None, description="Desc", status="active", price=9.99, features="features", roles=[1, 2]).execute()

        with pytest.raises(ValueError, match="Invalid data provided"):
            CreateSubscriptionPlan(id="test_id", name="Test Plan", description="Desc", status="active", price=9.99, features="features", roles=None).execute()

    def test_create_subscription_plan_rollback_on_exception(self):
        test_data = {
            "id": "test_plan_id",
            "name": "Test Plan",
            "description": "A test plan",
            "status": "active",
            "price": 9.99,
            "features": "feature1, feature2",
            "roles": [1, 2]
        }

        self.mock_flush.side_effect = Exception("DB Error")

        with pytest.raises(Exception, match="DB Error"):
            CreateSubscriptionPlan(**test_data).execute()

        self.mock_rollback.assert_called_once()

        self.mock_commit.assert_not_called()