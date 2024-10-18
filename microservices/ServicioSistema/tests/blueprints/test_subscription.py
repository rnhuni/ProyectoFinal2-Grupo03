
import pytest
from unittest.mock import MagicMock
from flask import Flask
from ServicioSistema.blueprints.subscriptions.routes import subscriptions_bp
from ServicioSistema.commands.role_exists import ExistsRole
from ServicioSistema.commands.subscription_plan_exists import ExistsSubscriptionPlan
from ServicioSistema.commands.subscription_plan_create import CreateSubscriptionPlan
from ServicioSistema.utils import build_plan_id

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(subscriptions_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_subscription_plan_success(client, mocker):
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)

    mock_plan = MagicMock()
    mock_plan.id = "plan-premium"
    mock_plan.name = "Premium Plan"
    mock_plan.description = "Plan for premium users"
    mock_plan.createdAt = "2024-01-01"
    mock_plan.updatedAt = "2024-01-01"

    mocker.patch('ServicioSistema.commands.subscription_plan_create.CreateSubscriptionPlan.execute', return_value=mock_plan)
    mocker.patch('ServicioSistema.utils.build_plan_id', return_value="plan-premium")

    json_data = {
        "name": "Premium Plan",
        "description": "Plan for premium users",
        "roles": [
            {"id": "role-1"},
            {"id": "role-2"}
        ]
    }

    response = client.post('/api/subscriptions', json=json_data)

    assert response.status_code == 201
    assert response.json == {
        "id": "plan-premium",
        "name": "Premium Plan",
        "description": "Plan for premium users",
        "roles": ["role-1", "role-2"],
        "createdAt": "2024-01-01",
        "updatedAt": "2024-01-01"
    }

def test_create_subscription_plan_already_exists(client, mocker):
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=True)

    json_data = {
        "name": "Premium Plan",
        "description": "Plan for premium users",
        "roles": [
            {"id": "role-1"},
            {"id": "role-2"}
        ]
    }

    response = client.post('/api/subscriptions', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Subscription plan already exists"

def test_create_subscription_plan_role_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)

    json_data = {
        "name": "Premium Plan",
        "description": "Plan for premium users",
        "roles": [
            {"id": "role-not-found"}
        ]
    }

    response = client.post('/api/subscriptions', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Role 'role-not-found' does not exist"

def test_create_subscription_plan_missing_roles(client, mocker):
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)

    json_data = {
        "name": "Premium Plan",
        "description": "Plan for premium users",
        "roles": []
    }

    response = client.post('/api/subscriptions', json=json_data)

    assert response.status_code == 400
    assert response.data == b"roles are required"

def test_create_subscription_plan_invalid_name(client):
    json_data = {
        "name": "",
        "description": "Plan for premium users",
        "roles": [
            {"id": "role-1"},
            {"id": "role-2"}
        ]
    }

    response = client.post('/api/subscriptions', json=json_data)

    assert response.status_code == 400
    assert response.data == b"Name is required"

def test_create_subscription_plan_internal_error(client, mocker):
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)
    mocker.patch('ServicioSistema.commands.subscription_plan_create.CreateSubscriptionPlan.execute', side_effect=Exception("Database error"))

    json_data = {
        "name": "Premium Plan",
        "description": "Plan for premium users",
        "roles": [
            {"id": "role-1"},
            {"id": "role-2"}
        ]
    }

    response = client.post('/api/subscriptions', json=json_data)

    assert response.status_code == 500
    assert "Create subscription plan failed" in response.json['error']
