from  sqlalchemy  import  Column, String, ForeignKey
from .model  import  Model
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Message(Model):
    __tablename__ = 'message'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey('session.id'))
    source_id = Column(String, nullable=False)
    source_name = Column(String, nullable=False)
    source_type = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    body = Column(String, nullable=False)
    
    def  __init__(self, session_id, source_id, source_name, source_type, content_type, body):
        Model.__init__(self)
        self.session_id = session_id
        self.source_id = source_id
        self.source_name = source_name
        self.source_type = source_type
        self.content_type = content_type
        self.body = body