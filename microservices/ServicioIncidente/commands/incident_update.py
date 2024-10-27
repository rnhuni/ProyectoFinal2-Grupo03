from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class UpdateIncident(BaseCommannd):
    def __init__(self, incident_id, type=None, description=None, contact=None):
        self.incident_id = incident_id
        self.type = type
        self.description = description
        self.contact = contact

    def execute(self):
        if not self.incident_id:
            raise ValueError("Incident ID is required")

        try:
            incident = session.query(Incident).filter_by(id=self.incident_id).first()
            if not incident:
                raise ValueError("Incident not found")

            if self.type is not None:
                incident.type = self.type
            if self.description is not None:
                incident.description = self.description
            if self.contact is not None:
                incident.contact = self.contact

            session.commit()
            return incident

        except Exception as e:
            session.rollback()
            raise e