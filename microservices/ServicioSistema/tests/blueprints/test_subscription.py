import pytest
from datetime import datetime
from unittest.mock import patch, MagicMock
from ServicioSistema.models.subscription_plan import SubscriptionPlan
from ServicioSistema.commands.subscription_plan_get_all import GetAllSubscriptions
from ServicioSistema.models.role import Role
from ServicioSistema.models.model import session
from flask import Flask, jsonify
from ServicioSistema.blueprints.subscriptions.routes import subscriptions_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(subscriptions_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_plan_success(client, mocker):    
    plan_data = {
        "name": "Premium Plan",
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": [
            {"id": "role-1"},
            {"id": "role-2"}
        ]
    }
    
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)
    
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)
    
    mock_created_plan = MagicMock()
    mock_created_plan.id = "plan-1"
    mock_created_plan.name = "Premium Plan"
    mock_created_plan.description = "Access to premium features"
    mock_created_plan.status = "active"
    mock_created_plan.price = 19.99
    mock_created_plan.features = "Feature1, Feature2"
    mock_created_plan.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_created_plan.updatedAt = datetime(2024, 1, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.subscription_plan_create.CreateSubscriptionPlan.execute', return_value=mock_created_plan)
    
    response = client.post('/api/subscriptions', json=plan_data)
    
    assert response.status_code == 201
    
    assert response.json == {
        "id": "plan-1",
        "name": "Premium Plan",
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": ["role-1", "role-2"],
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_create_plan_already_exists(client, mocker):
    plan_data = {
        "name": "Premium Plan",
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": [{"id": "role-1"}]
    }
    
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=True)
    
    response = client.post('/api/subscriptions', json=plan_data)
    
    assert response.status_code == 400
    assert response.data == b"Subscription plan already exists"

def test_create_plan_role_not_found(client, mocker):
    plan_data = {
        "name": "Premium Plan",
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": [{"id": "nonexistent-role"}]
    }
    
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)
    
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)
    
    response = client.post('/api/subscriptions', json=plan_data)
    
    assert response.status_code == 400
    assert response.data == b"Role 'nonexistent-role' does not exist"

def test_create_plan_missing_name(client):
    plan_data = {
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": [{"id": "role-1"}]
    }

    response = client.post('/api/subscriptions', json=plan_data)

    assert response.status_code == 400
    assert response.data.decode() == "Name is required"

def test_get_subscription_plan_not_found(client, mocker):
    
    mocker.patch('ServicioSistema.commands.subscription_plan_get.GetSubscriptionPlan.execute', return_value=None)
    
    response = client.get('/api/subscriptions/nonexistent-plan')
    
    assert response.status_code == 404
    assert response.json == {"error": "Subscription plan not found"}

def test_get_subscription_plan_success(client, mocker):    
    mock_subscription_plan = {
        "id": "plan-1",
        "name": "Premium Plan",
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": [
            {"id": "role-1", "name": "Admin"},
            {"id": "role-2", "name": "User"}
        ],
        "createdAt": "2024-10-01T12:00:00Z",
        "updatedAt": "2024-10-01T12:00:00Z"
    }
    
    mock_plan = MagicMock()
    mock_plan.id = "plan-1"
    mock_plan.name = "Premium Plan"
    mock_plan.description = "Access to premium features"
    mock_plan.status = "active"
    mock_plan.price = 19.99
    mock_plan.features = "Feature1, Feature2"
    mock_plan.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_plan.updatedAt = datetime(2024, 1, 1, 0, 0, 0)
    
    mock_role_1 = MagicMock()
    mock_role_1.id = "role-1"
    mock_role_1.name = "Admin"

    mock_role_2 = MagicMock()
    mock_role_2.id = "role-2"
    mock_role_2.name = "User"
    
    mock_plan.roles = [mock_role_1, mock_role_2]
    
    mocker.patch('ServicioSistema.commands.subscription_plan_get.GetSubscriptionPlan.execute', return_value=mock_plan)
    
    response = client.get('/api/subscriptions/plan-1')
    
    assert response.status_code == 200
    
    assert response.json == {
        "id": "plan-1",
        "name": "Premium Plan",
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": [
            {"id": "role-1", "name": "Admin"},
            {"id": "role-2", "name": "User"}
        ],
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }

def test_create_plan_missing_roles(client, mocker):    
    plan_data = {
        "name": "Premium Plan",
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": []  
    }
    
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)
    
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)
    
    response = client.post('/api/subscriptions', json=plan_data)
    
    assert response.status_code == 400
    assert response.data.decode('utf-8') == "roles are required"

def test_create_plan_exception(client, mocker):    
    plan_data = {
        "name": "Premium Plan",
        "description": "Access to premium features",
        "status": "active",
        "price": 19.99,
        "features": "Feature1, Feature2",
        "roles": [
            {"id": "role-1"},
            {"id": "role-2"}
        ]
    }
    
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=False)
    
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)
    
    mocker.patch('ServicioSistema.commands.subscription_plan_create.CreateSubscriptionPlan.execute', side_effect=Exception("Database error"))
    
    response = client.post('/api/subscriptions', json=plan_data)
    
    assert response.status_code == 500
    assert response.json == {
        'error': "Create subscription plan failed. Details: Database error"
    }

def test_get_subscription_plan_exception(client, mocker):    
    mocker.patch('ServicioSistema.commands.subscription_plan_get.GetSubscriptionPlan.execute', side_effect=Exception("Database error"))
    
    response = client.get('/api/subscriptions/plan-1')
    
    assert response.status_code == 500
    assert response.json == {
        'error': "Failed to retrieve subscription plan. Details: Database error"
    }

def test_get_all_subscriptions_success(client, mocker):
    mock_plan_1 = SubscriptionPlan(
        id="plan-1",
        name="Premium Plan",
        description="Access to premium features",
        status="active",
        price=19.99,
        features="Feature1, Feature2"
    )
    mock_plan_1.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_plan_1.updatedAt = datetime(2024, 2, 1, 0, 0, 0)

    mock_plan_2 = SubscriptionPlan(
        id="plan-2",
        name="Basic Plan",
        description="Access to basic features",
        status="inactive",
        price=9.99,
        features="Feature1"
    )
    mock_plan_2.createdAt =  datetime(2024, 1, 1, 0, 0, 0)
    mock_plan_2.updatedAt  = datetime(2024, 2, 1, 0, 0, 0)

    mocker.patch('ServicioSistema.commands.subscription_plan_get_all.GetAllSubscriptions.execute', return_value=[mock_plan_1, mock_plan_2])

    response = client.get('/api/subscriptions')

    assert response.status_code == 200

    result = response.json
    for plan in result:
        del plan["created_at"]
        del plan["updated_at"]

    assert result == [
        {
            "id": "plan-1",
            "name": "Premium Plan",
            "description": "Access to premium features",
            "status": "active",
            "price": 19.99,
            "features": "Feature1, Feature2",
            "roles": []
        },
        {
            "id": "plan-2",
            "name": "Basic Plan",
            "description": "Access to basic features",
            "status": "inactive",
            "price": 9.99,
            "features": "Feature1",
            "roles": []
        }
    ]
    
def test_get_all_subscriptions_not_found(client, mocker):
    mocker.patch('ServicioSistema.commands.subscription_plan_get_all.GetAllSubscriptions.execute', return_value=[])

    response = client.get('/api/subscriptions')

    assert response.status_code == 404

    assert response.json == {"message": "No subscription plans found"}

def test_get_all_subscriptions_exception(client, mocker):
    mocker.patch('ServicioSistema.commands.subscription_plan_get_all.GetAllSubscriptions.execute', side_effect=Exception("Database error"))

    response = client.get('/api/subscriptions')

    assert response.status_code == 500

    assert response.json == {'error': 'Failed to retrieve subscription plans. Details: Database error'}

def test_update_subscriptions_success(client, mocker):
    update_data = {
        "name": "Updated Plan",
        "description": "Updated description",
        "status": "inactive",
        "price": 29.99,
        "features": "Updated Feature1, Updated Feature2",
        "roles": [
            {"id": "role-1"},
            {"id": "role-2"}
        ]
    }

    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=True)
    
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)
    
    mock_updated_plan = MagicMock()
    mock_updated_plan.id = "plan-1"
    mock_updated_plan.name = "Updated Plan"
    mock_updated_plan.description = "Updated description"
    mock_updated_plan.status = "inactive"
    mock_updated_plan.price = 29.99
    mock_updated_plan.features = "Updated Feature1, Updated Feature2"
    mock_updated_plan.createdAt = datetime(2024, 1, 1, 0, 0, 0)
    mock_updated_plan.updatedAt = datetime(2024, 1, 2, 0, 0, 0)

    mock_role_1 = MagicMock()
    mock_role_1.id = "role-1"
    mock_role_1.name = "Admin"

    mock_role_2 = MagicMock()
    mock_role_2.id = "role-2"
    mock_role_2.name = "User"
    
    mock_updated_plan.roles = [mock_role_1, mock_role_2]

    mocker.patch('ServicioSistema.commands.subscription_plan_update.UpdateSubscriptionPlan.execute', return_value=mock_updated_plan)
    
    response = client.put('/api/subscriptions/plan-1', json=update_data)

    assert response.status_code == 200
    assert response.json == {
        "id": "plan-1",
        "name": "Updated Plan",
        "description": "Updated description",
        "status": "inactive",
        "price": 29.99,
        "features": "Updated Feature1, Updated Feature2",
        "roles": [
            {"id": "role-1", "name": "Admin"},
            {"id": "role-2", "name": "User"}
        ],
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-02T00:00:00"
    }

def test_update_subscription_no_valid_roles(client, mocker):
    # Datos para la actualización sin roles válidos
    update_data = {
        "name": "Updated Plan",
        "description": "Updated description",
        "status": "inactive",
        "price": 29.99,
        "features": "Updated Feature1, Updated Feature2",
        "roles": []  # Lista vacía de roles
    }

    # Mock para comprobar que el plan existe
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=True)
    
    # Mock para devolver False indicando que ningún rol es válido
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=False)

    # Simulación de la petición PUT para la actualización
    response = client.put('/api/subscriptions/plan-1', json=update_data)

    # Verificar que se devuelve un error 400 con el mensaje esperado
    assert response.status_code == 400
    assert response.json == {"error": "At least one valid role is required"}

def test_update_subscription_value_error(client, mocker):
    # Datos para la actualización
    update_data = {
        "name": "Updated Plan",
        "description": "Updated description",
        "status": "inactive",
        "price": 29.99,
        "features": "Updated Feature1, Updated Feature2",
        "roles": [
            {"id": "role-1"},
            {"id": "role-3"}
        ]
    }

    # Mock para comprobar que el plan existe
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=True)
    
    # Mock para comprobar que los roles existen
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)
    
    # Mock de la actualización del plan para que lance un ValueError
    mocker.patch('ServicioSistema.commands.subscription_plan_update.UpdateSubscriptionPlan.execute', side_effect=ValueError("Name is required"))

    # Simulación de la petición PUT para la actualización
    response = client.put('/api/subscriptions/plan-1', json=update_data)

    # Verificar que se devuelve un error 400 con el mensaje esperado
    assert response.status_code == 400
    assert response.json == {"error": "Name is required"}

def test_update_subscription_generic_exception(client, mocker):
    # Datos para la actualización
    update_data = {
        "name": "Updated Plan",
        "description": "Updated description",
        "status": "inactive",
        "price": 29.99,
        "features": "Updated Feature1, Updated Feature2",
        "roles": [
            {"id": "role-1"},
            {"id": "role-3"}
        ]
    }

    # Mock para comprobar que el plan existe
    mocker.patch('ServicioSistema.commands.subscription_plan_exists.ExistsSubscriptionPlan.execute', return_value=True)
    
    # Mock para comprobar que los roles existen
    mocker.patch('ServicioSistema.commands.role_exists.ExistsRole.execute', return_value=True)
    
    # Mock de la actualización del plan para que lance una excepción genérica
    mocker.patch('ServicioSistema.commands.subscription_plan_update.UpdateSubscriptionPlan.execute', side_effect=Exception("Unexpected error"))

    # Simulación de la petición PUT para la actualización
    response = client.put('/api/subscriptions/plan-1', json=update_data)

    # Verificar que se devuelve un error 500 con el mensaje esperado
    assert response.status_code == 500
    assert response.json == {"error": "Failed to update subscription. Details: Unexpected error"}
