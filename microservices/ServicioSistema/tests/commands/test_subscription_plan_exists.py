import pytest
from ServicioSistema.commands.subscription_plan_exists import ExistsSubscriptionPlan
from ServicioSistema.models.subscription_plan import SubscriptionPlan
from ServicioSistema.models.model import session

def test_exists_subscription_plan_success(mocker):
    mock_plan = mocker.MagicMock(spec=SubscriptionPlan)
    mocker.patch.object(session, 'query', return_value=mocker.Mock(get=lambda id: mock_plan))

    command = ExistsSubscriptionPlan(id="plan-premium")
    exists = command.execute()

    assert exists is True

def test_exists_subscription_plan_not_found(mocker):
    mocker.patch.object(session, 'query', return_value=mocker.Mock(get=lambda id: None))

    command = ExistsSubscriptionPlan(id="plan-not-found")
    exists = command.execute()

    assert exists is False

def test_exists_subscription_plan_invalid_data():
    with pytest.raises(ValueError, match="Invalid data provided"):
        command = ExistsSubscriptionPlan(id=None)
        command.execute()
