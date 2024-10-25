from ..models.model import session
from ..models.client import Client
from .base_command import BaseCommannd

class GetAllClients(BaseCommannd):
    def execute(self):
        return session.query(Client).all()