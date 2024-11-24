from  sqlalchemy  import  Column, String, Boolean
from .model  import  Model
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Template(Model):
    __tablename__ = 'template'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    body = Column(String, nullable=False)
    auto_trigger = Column(Boolean, nullable=False, default=False)
    status = Column(String, nullable=False)
    trigger_event = Column(String)
    
    def  __init__(self, name, content_type, body, auto_trigger, status, trigger_event):
        Model.__init__(self)
        self.name = name
        self.content_type = content_type
        self.body = body
        self.auto_trigger = auto_trigger
        self.status = status
        self.trigger_event = trigger_event