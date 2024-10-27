from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .model import Model, Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Attachment(Model):
    __tablename__ = 'attachment'
    id = Column(UUID(as_uuid=True), primary_key=True)
    file_name = Column(String, nullable=False)
    file_uri = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    user_attacher_id = Column(String, nullable=False)
    user_attacher_name = Column(String, nullable=False)

    incidents = relationship(
        "Incident",
        secondary="incident_attachment",
        back_populates="attachments"  # Cambiar a back_populates
    )

    def __init__(self, id, file_name, file_uri, content_type, user_attacher_id, user_attacher_name):
        Model.__init__(self)
        self.id = id
        self.file_name = file_name
        self.file_uri = file_uri
        self.content_type = content_type
        self.user_attacher_id = user_attacher_id
        self.user_attacher_name = user_attacher_name
