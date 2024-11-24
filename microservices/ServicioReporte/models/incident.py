from sqlalchemy import Column, String, Integer, Boolean, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from .model import Model
import uuid

class Incident(Model):
    __tablename__ = 'incident_reports'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(String(255), nullable=False, default="")
    incident_id = Column(String(255), nullable=False, default="")
    incident_status = Column(String(50), nullable=False, default="")
    incident_user_issuer_id = Column(String(255), nullable=False, default="")
    incident_user_issuer_name = Column(String(255), nullable=False, default="")
    incident_assigned_to_id = Column(String(255), nullable=False, default="")
    incident_assigned_to_name = Column(String(255), nullable=False, default="")
    incident_closed_by_id = Column(String(255), nullable=False, default="")
    incident_closed_by_name = Column(String(255), nullable=False, default="")
    incident_created_at = Column(DateTime, nullable=False, default=text('CURRENT_TIMESTAMP'))
    channel_id = Column(String(255), nullable=False, default="")
    channel_name = Column(String(255), nullable=False, default="")
    sla = Column(Integer, nullable=False, default=0)
    sla_ok = Column(Boolean, nullable=False, default=False)
    resolution_time = Column(Integer, nullable=False, default=0)
    feedback_id = Column(String(255), nullable=False, default="")
    feedback_support_rating = Column(Integer, nullable=False, default=0)
    feedback_ease_of_contact = Column(Integer, nullable=False, default=0)
    feedback_support_staff_attitude = Column(Integer, nullable=False, default=0)
    feedback_resolution_time = Column(Integer, nullable=False, default=0)
    
    def __init__(
        self, 
        client_id="", 
        incident_id="", 
        incident_status="", 
        incident_user_issuer_id="", 
        incident_user_issuer_name="", 
        incident_assigned_to_id="", 
        incident_assigned_to_name="", 
        incident_closed_by_id="", 
        incident_closed_by_name="", 
        channel_id="", 
        channel_name="", 
        incident_created_at = None,
        sla=0, 
        sla_ok=False, 
        resolution_time=0, 
        feedback_id="", 
        feedback_support_rating=0, 
        feedback_ease_of_contact=0, 
        feedback_support_staff_attitude=0, 
        feedback_resolution_time=0
    ):
        Model.__init__(self)
        self.client_id = client_id
        self.incident_id = incident_id
        self.incident_status = incident_status
        self.incident_user_issuer_id = incident_user_issuer_id
        self.incident_user_issuer_name = incident_user_issuer_name
        self.incident_assigned_to_id = incident_assigned_to_id
        self.incident_assigned_to_name = incident_assigned_to_name
        self.incident_closed_by_id = incident_closed_by_id
        self.incident_closed_by_name = incident_closed_by_name
        self.channel_id = channel_id
        self.channel_name = channel_name
        self.incident_created_at = incident_created_at
        self.sla = sla
        self.sla_ok = sla_ok
        self.resolution_time = resolution_time
        self.feedback_id = feedback_id
        self.feedback_support_rating = feedback_support_rating
        self.feedback_ease_of_contact = feedback_ease_of_contact
        self.feedback_support_staff_attitude = feedback_support_staff_attitude
        self.feedback_resolution_time = feedback_resolution_time
