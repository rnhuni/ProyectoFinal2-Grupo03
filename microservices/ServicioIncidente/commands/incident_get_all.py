from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class GetAllIncidents(BaseCommannd):
    def execute(self):
        return session.query(Incident).all()