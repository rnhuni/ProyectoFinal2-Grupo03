from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class GetIncident(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        return session.query(Incident).filter_by(id=self.id).first()