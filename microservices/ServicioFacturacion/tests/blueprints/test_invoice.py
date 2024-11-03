import pytest
import json
import uuid
from flask import Flask
from unittest.mock import patch, MagicMock
from ServicioFacturacion.blueprints.invoices.routes import invoices_bp

@pytest.fixture
def client():
    app = Flask(__name__)
    app.register_blueprint(invoices_bp, url_prefix='/api')
    with app.test_client() as client:
        yield client

def test_create_invoice_success(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_exists.ExistsPeriod.execute', return_value=True)
    
    mock_invoice = MagicMock()
    mock_invoice.id = str(uuid.uuid4())
    mock_invoice.description = "Test description"
    mock_invoice.period_id = "period-123"
    mock_invoice.date = "2024-01-01"
    mock_invoice.amount = 100.0
    mock_invoice.status = "ACTIVE"
    mocker.patch('ServicioFacturacion.commands.invoice_create.CreateInvoice.execute', return_value=mock_invoice)

    data = {
        "description": "Test description",
        "periodId": "period-123",
        "date": "2024-01-01",
        "amount": 100.0,
        "status": "ACTIVE"
    }

    response = client.post('/api/invoices', json=data)

    assert response.status_code == 200
    assert response.json == {
        "id": mock_invoice.id,
        "description": mock_invoice.description,
        "periodId": mock_invoice.period_id,
        "date": mock_invoice.date,
        "amount": mock_invoice.amount,
        "status": mock_invoice.status
    }

def test_create_invoice_invalid_params(client):
    data = {
        "description": "Test description",
        "date": "2024-01-01",
        "amount": 100.0
    }

    response = client.post('/api/invoices', json=data)

    assert response.status_code == 400
    assert response.get_data(as_text=True) == "Invalid parameters"

def test_create_invoice_period_not_found(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_exists.ExistsPeriod.execute', return_value=False)

    data = {
        "description": "Test description",
        "periodId": "nonexistent-period",
        "date": "2024-01-01",
        "amount": 100.0,
        "status": "ACTIVE"
    }

    response = client.post('/api/invoices', json=data)

    assert response.status_code == 404
    assert response.get_data(as_text=True) == "Period not found"

def test_create_invoice_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.period_exists.ExistsPeriod.execute', return_value=True)
    mocker.patch('ServicioFacturacion.commands.invoice_create.CreateInvoice.execute', side_effect=Exception("Database error"))

    data = {
        "description": "Test description",
        "periodId": "period-123",
        "date": "2024-01-01",
        "amount": 100.0,
        "status": "ACTIVE"
    }

    response = client.post('/api/invoices', json=data)

    assert response.status_code == 500
    assert 'Create period failed. Details: Database error' in response.json['error']

def test_get_all_invoices_success(client, mocker):
    mock_invoice = MagicMock()
    mock_invoice.id = str(uuid.uuid4())
    mock_invoice.description = "Test invoice description"
    mock_invoice.period_id = "period-123"
    mock_invoice.date = "2024-01-01"
    mock_invoice.amount = 100.0
    mock_invoice.status = "ACTIVE"
    mocker.patch('ServicioFacturacion.commands.invoice_get_all.GetAllInvoices.execute', return_value=[mock_invoice])

    response = client.get('/api/invoices')

    assert response.status_code == 200
    assert response.json == [
        {
            "id": mock_invoice.id,
            "description": mock_invoice.description,
            "periodId": mock_invoice.period_id,
            "date": mock_invoice.date,
            "amount": mock_invoice.amount,
            "status": mock_invoice.status
        }
    ]

def test_get_all_invoices_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.invoice_get_all.GetAllInvoices.execute', side_effect=Exception("Database error"))

    response = client.get('/api/invoices')

    assert response.status_code == 500
    assert 'Failed to retrieve invoices. Details: Database error' in response.json['error']

def test_get_invoice_success(client, mocker):
    mock_invoice = MagicMock()
    mock_invoice.id = str(uuid.uuid4())
    mock_invoice.description = "Test invoice description"
    mock_invoice.period_id = "period-123"
    mock_invoice.date = "2024-01-01"
    mock_invoice.amount = 100.0
    mock_invoice.status = "ACTIVE"
    mocker.patch('ServicioFacturacion.commands.invoice_get.GetInvoice.execute', return_value=mock_invoice)

    response = client.get(f'/api/invoices/{mock_invoice.id}')

    assert response.status_code == 200
    assert response.json == {
        "id": mock_invoice.id,
        "description": mock_invoice.description,
        "periodId": mock_invoice.period_id,
        "date": mock_invoice.date,
        "amount": mock_invoice.amount,
        "status": mock_invoice.status
    }

def test_get_invoice_not_found(client, mocker):
    mocker.patch('ServicioFacturacion.commands.invoice_get.GetInvoice.execute', return_value=None)

    response = client.get('/api/invoices/nonexistent-invoice-id')

    assert response.status_code == 404
    assert response.json == {'error': 'Invoice not found'}

def test_get_invoice_exception(client, mocker):
    mocker.patch('ServicioFacturacion.commands.invoice_get.GetInvoice.execute', side_effect=Exception("Database error"))

    response = client.get('/api/invoices/some-invoice-id')

    assert response.status_code == 500
    assert 'Failed to retrieve invoice. Details: Database error' in response.json['error']

def test_update_invoice_success(client, mocker):
    # Mock GetInvoice to return an existing invoice
    mock_invoice = MagicMock()
    mock_invoice.id = "existing-invoice-id"
    mock_invoice.description = "Old description"
    mock_invoice.period_id = "period-123"
    mock_invoice.date = "2024-01-01"
    mock_invoice.amount = 100.0
    mock_invoice.status = "ACTIVE"
    mocker.patch('ServicioFacturacion.commands.invoice_get.GetInvoice.execute', return_value=mock_invoice)

    # Mock UpdateInvoice to simulate a successful update
    updated_invoice = MagicMock()
    updated_invoice.id = mock_invoice.id
    updated_invoice.description = "Updated description"
    updated_invoice.period_id = "period-123"
    updated_invoice.date = "2024-01-02"
    updated_invoice.amount = 200.0
    updated_invoice.status = "PAID"
    mocker.patch('ServicioFacturacion.commands.invoice_update.UpdateInvoice.execute', return_value=updated_invoice)

    data = {
        "description": "Updated description",
        "date": "2024-01-02",
        "amount": 200.0,
        "status": "PAID"
    }

    response = client.put(f'/api/invoices/{mock_invoice.id}', json=data)

    assert response.status_code == 200
    assert response.json == {
        "id": updated_invoice.id,
        "description": updated_invoice.description,
        "periodId": updated_invoice.period_id,
        "date": updated_invoice.date,
        "amount": updated_invoice.amount,
        "status": updated_invoice.status
    }

def test_update_invoice_no_fields_to_update(client):
    # No fields provided for update
    data = {}

    response = client.put('/api/invoices/existing-invoice-id', json=data)

    assert response.status_code == 400
    assert response.json == {"error": "No fields to update"}

def test_update_invoice_not_found(client, mocker):
    # Mock GetInvoice to return None, indicating the invoice is not found
    mocker.patch('ServicioFacturacion.commands.invoice_get.GetInvoice.execute', return_value=None)

    data = {
        "description": "Updated description",
        "date": "2024-01-02",
        "amount": 200.0,
        "status": "PAID"
    }

    response = client.put('/api/invoices/nonexistent-invoice-id', json=data)

    assert response.status_code == 404
    assert response.json == {"error": "Invoice not found"}

def test_update_invoice_exception(client, mocker):
    # Mock GetInvoice to return an existing invoice
    mock_invoice = MagicMock()
    mock_invoice.id = "existing-invoice-id"
    mocker.patch('ServicioFacturacion.commands.invoice_get.GetInvoice.execute', return_value=mock_invoice)

    # Mock UpdateInvoice to raise an exception
    mocker.patch('ServicioFacturacion.commands.invoice_update.UpdateInvoice.execute', side_effect=Exception("Database error"))

    data = {
        "description": "Updated description",
        "date": "2024-01-02",
        "amount": 200.0,
        "status": "PAID"
    }

    response = client.put(f'/api/invoices/{mock_invoice.id}', json=data)

    assert response.status_code == 500
    assert 'Failed to update invoice. Details: Database error' in response.json['error']