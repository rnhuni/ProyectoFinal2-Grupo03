from  sqlalchemy  import  Column, String, Boolean
from .model  import  Model
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Notification(Model):
    __tablename__ = 'notification'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    service = Column(String, nullable=True)
    show_by_default = Column(Boolean, nullable=False, default=True)
    
    def  __init__(self, name, service, show_by_default):
        Model.__init__(self)
        self.name = name
        self.service = service
        self.show_by_default = show_by_default