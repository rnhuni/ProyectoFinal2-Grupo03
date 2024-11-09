from ..models.model import session
from ..models.feedback import Feedback
from .base_command import BaseCommannd

class ExistsFeedback(BaseCommannd):
    def __init__(self, incident_id):
        self.incident_id = incident_id

    def execute(self):
        if not self.incident_id:
            raise ValueError("Feedback ID is required")
        
        return session.query(Feedback).filter_by(incident_id=self.incident_id).first() is not None