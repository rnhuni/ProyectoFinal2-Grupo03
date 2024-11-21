from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class CreateIncident(BaseCommannd):
    def __init__(self,id, type, description, contact, user_id, user_name, channel_id, sla):
        self.id = id
        self.type = type
        self.contact = contact
        self.description = description
        self.user_id = user_id
        self.user_name = user_name
        self.channel_id = channel_id
        self.sla = sla
    
    def execute(self):
        if not self.id or not self.type or not self.description or \
           not self.description or not self.user_id or not self.user_name or\
           not self.channel_id or not self.sla :
            raise ValueError("Invalid data provided")
        
        try:
            incident = Incident(self.id, self.type, self.description, \
                                self.contact, self.user_id, self.user_name, \
                                self.channel_id, self.sla)
            
            session.add(incident)
            session.commit()

            return incident
        except Exception as e:
            session.rollback()
            raise e