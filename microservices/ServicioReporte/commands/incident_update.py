from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class UpdateIncident(BaseCommannd):
    def __init__(self, incident_id, 
                 incident_assigned_to_id=None,
                 incident_assigned_to_name=None,
                 status=None,
                 incident_closed_by_id=None, 
                 incident_closed_by_name=None,
                 sla_ok=None,
                 resolution_time=None,
                 feedback_id=None, 
                 feedback_support_rating=None,
                 feedback_ease_of_contact=None,
                 feedback_support_staff_attitude=None,
                 feedback_resolution_time=None):
        self.incident_id = incident_id
        self.incident_assigned_to_id = incident_assigned_to_id
        self.incident_assigned_to_name = incident_assigned_to_name
        self.status = status
        self.incident_closed_by_id = incident_closed_by_id
        self.incident_closed_by_name = incident_closed_by_name
        self.sla_ok = sla_ok
        self.resolution_time = resolution_time
        self.feedback_id = feedback_id
        self.feedback_support_rating = feedback_support_rating
        self.feedback_ease_of_contact = feedback_ease_of_contact
        self.feedback_support_staff_attitude = feedback_support_staff_attitude
        self.feedback_resolution_time = feedback_resolution_time        
    
    def execute(self):
        if not self.incident_id:
            raise ValueError("Invalid data provided")
        
        incident = session.query(Incident).filter_by(incident_id=self.incident_id).first()
        if not self.incident_id:
            raise ValueError("Incident not found")
        
        try:
            if self.incident_assigned_to_id:
                incident.incident_assigned_to_id = self.incident_assigned_to_id
            if self.incident_assigned_to_name:
                incident.incident_assigned_to_name = self.incident_assigned_to_name
            if self.status:
                incident.incident_status = self.status
            if self.incident_closed_by_id:
                incident.incident_closed_by_id = self.incident_closed_by_id
            if self.incident_closed_by_name:
                incident.incident_closed_by_name = self.incident_closed_by_name
            if self.sla_ok:
                incident.sla_ok = self.sla_ok
            if self.resolution_time:
                incident.resolution_time = self.resolution_time
            if self.feedback_id:
                incident.feedback_id = self.feedback_id
            if self.feedback_support_rating:
                incident.feedback_support_rating = self.feedback_support_rating
            if self.feedback_ease_of_contact:
                incident.feedback_ease_of_contact = self.feedback_ease_of_contact
            if self.feedback_support_staff_attitude:
                incident.feedback_support_staff_attitude = self.feedback_support_staff_attitude
            if self.feedback_resolution_time:
                incident.feedback_resolution_time = self.feedback_resolution_time                

            session.commit()
            
            return incident
        except Exception as e:
            session.rollback()
            raise e