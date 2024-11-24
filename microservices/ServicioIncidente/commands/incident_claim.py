from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class ClaimIncident(BaseCommannd):
    def __init__(self, incident_id, user_id, user_name, user_type):
        self.incident_id = incident_id
        self.user_id = user_id
        self.user_name = user_name
        self.user_type = user_type

    def execute(self):
        if not self.incident_id:
            raise ValueError("Incident ID is required")

        try:
            incident = session.query(Incident).filter_by(id=self.incident_id).first()
            if not incident:
                raise ValueError("Incident not found")

            incident.assigned_to_id = self.user_id
            incident.assigned_to_name = self.user_name
            incident.assigned_to_type = self.user_type
            incident.status = "ASSIGNED"

            session.commit()
            return incident

        except Exception as e:
            session.rollback()
            raise e