from  sqlalchemy  import  Column, String, Boolean
from .model  import  Model
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Notification(Model):
    __tablename__ = 'user_notification'
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    base_id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)
    show = Column(Boolean, nullable=False)
    
    def  __init__(self, user_id, base_id, name, show):
        Model.__init__(self)
        self.user_id = user_id
        self.base_id = base_id
        self.name = name
        self.show = show