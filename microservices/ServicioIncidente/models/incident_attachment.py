from  sqlalchemy  import  Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .model  import  Model
from .attachment import Attachment
from sqlalchemy.dialects.postgresql import UUID

class IncidentAttachment(Model):
    __tablename__ = 'incident_attachment'
    incident_id = Column('incident_id', String, ForeignKey('incident.id'), primary_key=True)
    attachment_id = Column('attachment_id', UUID(as_uuid=True), ForeignKey('attachment.id'), primary_key=True)
    
    attachment = relationship("Attachment", backref="incident_attachment")
    
    def  __init__(self, incident_id, attachment_id):
        Model.__init__(self)
        self.incident_id = incident_id
        self.attachment_id = attachment_id