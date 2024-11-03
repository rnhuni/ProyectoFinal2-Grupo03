from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class ExistsIncident(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        if not self.id:
            raise ValueError("Incident ID is required")
        
        return session.query(Incident).get(self.id) is not None