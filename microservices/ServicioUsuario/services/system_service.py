import os
import requests

class SystemService:
    def __init__(self):
        self.base_uri = os.getenv('SYSTEM_SERVICE_URI', '')

    def get_notifications(self):
        response = requests.get(f'{self.base_uri}/notifications')
        response.raise_for_status()
        return response.json()
    
    def get_notification(self, id):
        response = requests.get(f'{self.base_uri}/notifications/{id}')
        response.raise_for_status()
        return response.json()