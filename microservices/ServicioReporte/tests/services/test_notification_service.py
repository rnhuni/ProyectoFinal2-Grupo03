import pytest
from unittest.mock import patch, MagicMock
from ServicioReporte.services.notification_service import NotificationService

class TestNotificationService:
    @pytest.fixture(autouse=True)
    def setup_env(self, mocker):
        mocker.patch('os.getenv', side_effect=lambda key, default=None: {
            'ALERTS_URL': 'http://mock-alerts-url',
            'NEW_INCIDENT_ALERT_ID': 'new-incident-id',
            'UPDATE_INCIDENT_ALERT_ID': 'update-incident-id',
            'ALERTS_API_KEY': 'mock-api-key'
        }.get(key, default))

    @pytest.fixture
    def service(self):
        return NotificationService()

    @patch('requests.post')
    def test_publish_action_refresh(self, mock_post, service):
        mock_response = MagicMock()
        mock_response.json.return_value = {"data": {"publish": {"id": "report", "data": {}}}}
        mock_response.raise_for_status = MagicMock()
        mock_post.return_value = mock_response

        response = service.publish_action_refresh("publish-id")
        
        mock_post.assert_called_once_with(
            f"http://mock-alerts-url/graphql",
            headers={
                'x-api-key': 'mock-api-key',
                'Content-Type': 'application/json'
            },
            json={
                "query": """
        mutation PublishData($data: AWSJSON!, $id: String!) {
          publish(data: $data, id: $id) {
            data
            id
          }
        }
        """,
                "variables": {
                    "data": '{"type": "system_action_event", "payload": {"id": "report", "action": "refresh"}}',
                    "id": "publish-id"
                }
            }
        )
        assert response == {"data": {"publish": {"id": "report", "data": {}}}}

    @patch('requests.post')
    def test_publish_notification_new_incident(self, mock_post, service):
        mock_response = MagicMock()
        mock_response.json.return_value = {"data": {"publish": {"id": "new-incident-id", "data": {}}}}
        mock_response.raise_for_status = MagicMock()
        mock_post.return_value = mock_response

        response = service.publish_notification_new_incident("publish-id", "incident-123", "John Doe")
        
        mock_post.assert_called_once_with(
            f"http://mock-alerts-url/graphql",
            headers={
                'x-api-key': 'mock-api-key',
                'Content-Type': 'application/json'
            },
            json={
                "query": """
        mutation PublishData($data: AWSJSON!, $id: String!) {
          publish(data: $data, id: $id) {
            data
            id
          }
        }
        """,
                "variables": {
                    "data": '{"type": "notifiaction_event", "payload": {"id": "new-incident-id", "message": "Nuevo incidente incident-123 creado por John Doe"}}',
                    "id": "publish-id"
                }
            }
        )
        assert response == {"data": {"publish": {"id": "new-incident-id", "data": {}}}}

    @patch('requests.post')
    def test_publish_notification_close_incident(self, mock_post, service):
        mock_response = MagicMock()
        mock_response.json.return_value = {"data": {"publish": {"id": "update-incident-id", "data": {}}}}
        mock_response.raise_for_status = MagicMock()
        mock_post.return_value = mock_response

        response = service.publish_notification_close_incident("publish-id", "incident-123", "Jane Doe")
        
        mock_post.assert_called_once_with(
            f"http://mock-alerts-url/graphql",
            headers={
                'x-api-key': 'mock-api-key',
                'Content-Type': 'application/json'
            },
            json={
                "query": """
        mutation PublishData($data: AWSJSON!, $id: String!) {
          publish(data: $data, id: $id) {
            data
            id
          }
        }
        """,
                "variables": {
                    "data": '{"type": "notifiaction_event", "payload": {"id": "update-incident-id", "message": "El incidente incident-123 fue cerrado por Jane Doe"}}',
                    "id": "publish-id"
                }
            }
        )
        assert response == {"data": {"publish": {"id": "update-incident-id", "data": {}}}}

    @patch('requests.post')
    def test_publish_data_error(self, mock_post, service):
        mock_post.side_effect = Exception("Network error")

        with pytest.raises(Exception, match="Network error"):
            service.publish_action_refresh("publish-id")

        mock_post.assert_called_once()
