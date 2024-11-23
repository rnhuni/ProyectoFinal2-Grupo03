from  sqlalchemy  import  Column, String, ForeignKey
from .model  import  Model
import uuid
from sqlalchemy.dialects.postgresql import UUID

class LogReport(Model):
    __tablename__ = 'log_report'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id = Column(String, nullable=False)
    source_name = Column(String, nullable=False)
    source_type = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    event_content = Column(String)
        
    def  __init__(self, source_id, source_name, source_type, event_type, event_content):
        Model.__init__(self)
        self.source_id = source_id
        self.source_name = source_name
        self.source_type = source_type
        self.event_type = event_type
        self.event_content = event_content