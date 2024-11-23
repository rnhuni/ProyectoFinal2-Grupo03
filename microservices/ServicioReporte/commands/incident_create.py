from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class CreateIncident(BaseCommannd):
    def __init__(self, incident_id, client_id, source_id, source_name, channel_id, channel_name, sla):
        self.incident_id = incident_id
        self.client_id = client_id
        self.source_id = source_id
        self.source_name = source_name
        self.channel_id = channel_id
        self.channel_name = channel_name
        self.sla = sla
    
    def execute(self):
        if not self.incident_id:
            raise ValueError("Invalid data provided")
        
        try:
            data = Incident(incident_id=self.incident_id,
                            client_id=self.client_id,
                            incident_user_issuer_id=self.source_id,
                            incident_user_issuer_name=self.source_name,
                            channel_id=self.channel_id,
                            channel_name=self.channel_name,                            
                            sla=self.sla)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e