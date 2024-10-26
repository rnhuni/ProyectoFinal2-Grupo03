from ..models.model import session
from ..models.client import Client
from .base_command import BaseCommannd

class GetClient(BaseCommannd):
    def __init__(self, client_id):
        self.client_id = client_id

    def execute(self):
        if not self.client_id:
            raise ValueError("Client ID is required")
        
        return session.query(Client).get(self.client_id)