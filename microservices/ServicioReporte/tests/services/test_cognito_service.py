import pytest
from unittest.mock import patch, MagicMock
from ServicioReporte.services.cognito_service import CognitoService

class TestCognitoService:
    @pytest.fixture(autouse=True)
    def setup_env(self, mocker):
        mocker.patch('os.getenv', side_effect=lambda key, default=None: {
            'ENV': 'test',
            'AWS_REGION': 'us-east-1',
            'USER_POOL_ID': 'test-user-pool-id'
        }.get(key, default))

    @patch('boto3.client')
    def test_get_all_agents_success(self, mock_boto_client):
        mock_cognito_client = MagicMock()
        mock_paginator = MagicMock()

        mock_paginator.paginate.return_value = [
            {
                'Users': [
                    {
                        'Attributes': [
                            {'Name': 'sub', 'Value': 'agent-123'},
                            {'Name': 'name', 'Value': 'Agent Name'},
                            {'Name': 'email', 'Value': 'agent@example.com'},
                            {'Name': 'custom:role', 'Value': 'role-agent'},
                            {'Name': 'custom:client', 'Value': 'client-1'}
                        ]
                    },
                    {
                        'Attributes': [
                            {'Name': 'sub', 'Value': 'agent-456'},
                            {'Name': 'name', 'Value': 'Another Agent'},
                            {'Name': 'email', 'Value': 'anotheragent@example.com'},
                            {'Name': 'custom:role', 'Value': 'role-agent-admin'},
                            {'Name': 'custom:client', 'Value': 'client-2'}
                        ]
                    }
                ]
            }
        ]

        mock_cognito_client.get_paginator.return_value = mock_paginator
        mock_boto_client.return_value = mock_cognito_client

        service = CognitoService()
        agents = service.get_all_agents()

        assert len(agents) == 0

    @patch('boto3.client')
    def test_get_all_agents_no_agents(self, mock_boto_client):
        mock_cognito_client = MagicMock()
        mock_paginator = MagicMock()

        mock_paginator.paginate.return_value = [{'Users': []}]
        mock_cognito_client.get_paginator.return_value = mock_paginator
        mock_boto_client.return_value = mock_cognito_client

        service = CognitoService()
        agents = service.get_all_agents()

        assert len(agents) == 0

    @patch('boto3.client')
    def test_get_all_agents_error(self, mock_boto_client):
        mock_cognito_client = MagicMock()
        mock_cognito_client.get_paginator.side
