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

    def publish_new_message(self, message):
        json_data = {
            "type":"new_message_event",
            "payload": {
                "id": str(message.id),
                "source_id": message.source_id,
                "source_name": message.source_name,
                "source_type": message.source_type,
                "content_type": message.content_type,
                "body": message.body,
                "created_at": message.createdAt.isoformat()
            }
        }

        id = str(message.session_id)
        data = json.dumps(json_data)
        
        return self.publish_data(id, data)

    def publish_new_session(self, session):
        json_data = {
            "type":"new_session_event",
            "payload": {
                    "id": str(session.id),
                    "status": str(session.status),
                    "channel_id": session.channel_id,
                    "topic": session.topic,
                    "topic_refid": session.topic_refid,
                    "opened_by_id": session.opened_by_id,
                    "opened_by_name": session.opened_by_name,
                    "opened_by_type": session.opened_by_type,            
                    "created_at": session.createdAt.isoformat()
            }
        }

        id = session.channel_id
        data = json.dumps(json_data)
        
        return self.publish_data(id, data)    

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
