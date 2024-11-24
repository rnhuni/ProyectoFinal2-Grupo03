import json
import os
import requests

class NotificationService:
    def __init__(self):
        self.url = os.getenv('ALERTS_URL')
        self.api_key = os.getenv('ALERTS_API_KEY')
        self.headers = {
            'x-api-key': self.api_key,
            'Content-Type': 'application/json'
        }

    def publish_action_refresh(self, user_id):
        json_data = {
            "type":"system_action_event",
            "payload": {
                "id": "report",
                "action": "refresh"
            }
        }

        data = json.dumps(json_data)
        
        return self.publish_data(user_id, data)

    def publish_data(self, id, data):
        query = """
        mutation PublishData($data: AWSJSON!, $id: String!) {
          publish(data: $data, id: $id) {
            data
            id
          }
        }
        """
        variables = {
            "data": data,
            "id": id
        }
        payload = {
            "query": query,
            "variables": variables
        }

        url = f"{self.url}/graphql"
        
        response = requests.post(url, headers=self.headers, json=payload)
        response.raise_for_status()
        return response.json()
