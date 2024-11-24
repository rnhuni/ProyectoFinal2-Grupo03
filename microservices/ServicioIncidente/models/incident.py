from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.orm import relationship
from .incident_attachment import IncidentAttachment
from .model import Model

class Incident(Model):
    __tablename__ = 'incident'
    id = Column(String, primary_key=True)
    type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default='OPEN')
    contact = Column(String, nullable=True)
    user_issuer_id = Column(String, nullable=False)
    user_issuer_name = Column(String, nullable=False)
    date_resolution=Column(DateTime)
    resolution_time=Column(Integer)
    closed_by_id = Column(String)
    closed_by_name = Column(String)
    closed_by_type = Column(String)
    assigned_to_id = Column(String)
    assigned_to_type = Column(String)
    assigned_to_name = Column(String)
    assigned_to_name = Column(String)
    publication_channel_id = Column(String)
    sla = Column(Integer)

    attachments = relationship(
        'Attachment',
        secondary='incident_attachment',
        back_populates='incidents',
        lazy='joined',
    )

    def __init__(self, id, type, description, contact, user_issuer_id, user_issuer_name, publication_channel_id, sla):
        Model.__init__(self)
        self.id = id
        self.type = type
        self.description = description
        self.contact = contact
        self.user_issuer_id = user_issuer_id
        self.user_issuer_name = user_issuer_name
        self.status = 'OPEN'
        self.publication_channel_id = publication_channel_id
        self.sla = sla
