import pytest
from unittest.mock import MagicMock
from ServicioSistema.commands.subscription_plan_get_all import GetAllSubscriptions
from ServicioSistema.models.subscription_plan import SubscriptionPlan
from ServicioSistema.models.model import session

def test_get_all_subscriptions_success(mocker):
    # Crear objetos simulados de SubscriptionPlan
    mock_plan_1 = SubscriptionPlan(
        id="plan-1",
        name="Premium Plan",
        description="Access to premium features",
        status="active",
        price=19.99,
        features="Feature1, Feature2"
    )

    mock_plan_2 = SubscriptionPlan(
        id="plan-2",
        name="Basic Plan",
        description="Access to basic features",
        status="inactive",
        price=9.99,
        features="Feature1"
    )

    # Mockear la consulta de SQLAlchemy para que devuelva las suscripciones simuladas
    mock_query = mocker.patch.object(session, 'query')
    mock_query_instance = mock_query.return_value
    mock_query_instance.all.return_value = [mock_plan_1, mock_plan_2]

    # Ejecutar el comando
    result = GetAllSubscriptions().execute()

    # Verificar que se devuelvan las suscripciones correctas
    assert len(result) == 2
    assert result[0].id == "plan-1"
    assert result[0].name == "Premium Plan"
    assert result[1].id == "plan-2"
    assert result[1].name == "Basic Plan"
    mock_query_instance.all.assert_called_once()
