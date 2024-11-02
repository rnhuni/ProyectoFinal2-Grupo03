import os
import requests

class SystemService:
    def __init__(self):
        self.base_uri = os.getenv('SYSTEM_SERVICE_URI')

    def get_subscription(self, subscription_id):
        response = requests.get(f'{self.base_uri}/subscriptions/{subscription_id}')
        response.raise_for_status()
        return response.json()
    
    def get_features(self):
        response = requests.get(f'{self.base_uri}/features')
        response.raise_for_status()
        return response.json()