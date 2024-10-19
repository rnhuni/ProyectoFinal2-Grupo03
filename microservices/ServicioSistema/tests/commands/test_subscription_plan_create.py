import pytest
from unittest.mock import MagicMock, patch
from ServicioSistema.commands.subscription_plan_create import CreateSubscriptionPlan
from ServicioSistema.models.subscription_plan import SubscriptionPlan
from ServicioSistema.models.subscription_plan_role import SubscriptionPlanRole
from ServicioSistema.models.model import session

def test_create_subscription_plan_success(mocker):
    add_spy = mocker.spy(session, 'add')
    mocker.patch.object(session, 'flush')
    mocker.patch.object(session, 'commit')

    command = CreateSubscriptionPlan(
        id="plan-premium", 
        name="Premium Plan", 
        description="Plan for premium users", 
        status="active", 
        price=99.99, 
        features="Advanced support, Unlimited access", 
        roles=["role-1", "role-2"]
    )

    plan = command.execute()

    add_spy.assert_any_call(plan)
    session.flush.assert_called_once()
    session.commit.assert_called_once()
    
    assert plan is not None
    assert isinstance(plan, SubscriptionPlan)
    assert plan.id == "plan-premium"
    assert plan.name == "Premium Plan"
    assert plan.description == "Plan for premium users"
    assert plan.status == "active"
    assert plan.price == 99.99
    assert plan.features == "Advanced support, Unlimited access"
    
    assert add_spy.call_count == 3
    for call in add_spy.mock_calls:
        if isinstance(call[1][0], SubscriptionPlanRole):
            assert call[1][0].role_id in ["role-1", "role-2"]

def test_create_subscription_plan_invalid_data():
    with pytest.raises(ValueError, match="Invalid data provided"):
        command = CreateSubscriptionPlan(id="plan-premium", name="Premium Plan", description="Plan for premium users", status="active", price=99.99, features="Advanced support, Unlimited access", roles=[])
        command.execute()

def test_create_subscription_plan_rollback_on_error(mocker):
    mocker.patch.object(session, 'add', side_effect=Exception("Database error"))
    mocker.patch.object(session, 'rollback')

    command = CreateSubscriptionPlan(
        id="plan-premium", 
        name="Premium Plan", 
        description="Plan for premium users", 
        status="active", 
        price=99.99, 
        features="Advanced support, Unlimited access", 
        roles=["role-1", "role-2"]
    )

    with pytest.raises(Exception, match="Database error"):
        command.execute()

    session.rollback.assert_called_once()
