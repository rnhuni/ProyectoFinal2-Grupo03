from  sqlalchemy  import  Column, String, ForeignKey
from .model  import  Model
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Task(Model):
    __tablename__ = 'task'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filters = Column(String, nullable=False)
    status = Column(String, nullable=False)
    key = Column(String)
        
    def  __init__(self, filters, status):
        Model.__init__(self)
        self.filters = filters
        self.status = status