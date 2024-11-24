import json
import os
import requests

class NotificationService:
    def __init__(self):
        self.url = os.getenv('ALERTS_URL')
        self.notification_new_incident_id  = os.getenv('NEW_INCIDENT_ALERT_ID')
        self.notification_update_incident_id  = os.getenv('UPDATE_INCIDENT_ALERT_ID')
        self.api_key = os.getenv('ALERTS_API_KEY')
        self.headers = {
            'x-api-key': self.api_key,
            'Content-Type': 'application/json'
        }

    def publish_action_refresh(self, publish_id):
        json_data = {
            "type":"system_action_event",
            "payload": {
                "id": "report",
                "action": "refresh"
            }
        }

        data = json.dumps(json_data)
        
        return self.publish_data(publish_id, data)
    
    def publish_notification_new_incident_user(self, publish_id, incident_id):
        json_data = {
            "type":"notifiaction_event",
            "payload": {
                "id": self.notification_new_incident_id,
                "message": f"Incidente {incident_id} creado con éxito"
            }
        }

        data = json.dumps(json_data)
        
        return self.publish_data(publish_id, data)
    
    def publish_notification_new_incident(self, publish_id, incident_id, user_name):
        json_data = {
            "type":"notifiaction_event",
            "payload": {
                "id": self.notification_new_incident_id,
                "message": f"Nuevo incidente {incident_id} creado por {user_name}"
            }
        }

        data = json.dumps(json_data)
        
        return self.publish_data(publish_id, data)
    
    def publish_notification_close_incident(self, publish_id, incident_id, agent_name):
        json_data = {
            "type":"notifiaction_event",
            "payload": {
                "id": self.notification_update_incident_id,
                "message": f"El incidente {incident_id} fue cerrado por {agent_name}"
            }
        }

        data = json.dumps(json_data)
        
        return self.publish_data(publish_id, data)
    
    def publish_notification_claim_incident(self, publish_id, incident_id, agent_name):
        json_data = {
            "type":"notifiaction_event",
            "payload": {
                "id": self.notification_update_incident_id,
                "message": f"El incidente {incident_id} fue asignado a {agent_name}"
            }
        }

        data = json.dumps(json_data)
        
        return self.publish_data(publish_id, data)
    
    def publish_notification_new_feedback(self, publish_id, incident_id, user_name):
        json_data = {
            "type":"notifiaction_event",
            "payload": {
                "id": self.notification_update_incident_id,
                "message": f"La solución del incidente {incident_id} fue valorado por {user_name}"
            }
        }

        data = json.dumps(json_data)
        
        return self.publish_data(publish_id, data)
    
    def publish_notification_new_feedback_user(self, publish_id, incident_id):
        json_data = {
            "type":"notifiaction_event",
            "payload": {
                "id": self.notification_update_incident_id,
                "message": f"Su valoraración del incidente {incident_id} fue registrada con éxito"
            }
        }

        data = json.dumps(json_data)
        
        return self.publish_data(publish_id, data)

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
