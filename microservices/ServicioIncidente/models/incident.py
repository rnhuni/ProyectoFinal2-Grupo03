from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .incident_attachment import IncidentAttachment
from .model import Model

class Incident(Model):
    __tablename__ = 'incident'
    id = Column(String, primary_key=True)
    type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    contact = Column(String, nullable=True)
    user_issuer_id = Column(String, nullable=False)
    user_issuer_name = Column(String, nullable=False)

    attachments = relationship(
        'Attachment',
        secondary='incident_attachment',
        back_populates='incidents',
        lazy='joined',
    )

    def __init__(self, id, type, description, contact, user_issuer_id, user_issuer_name):
        Model.__init__(self)
        self.id = id
        self.type = type
        self.description = description
        self.contact = contact
        self.user_issuer_id = user_issuer_id
        self.user_issuer_name = user_issuer_name
