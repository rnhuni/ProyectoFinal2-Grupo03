from  sqlalchemy  import  Column, String, ForeignKey
from .model  import  Model
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Session(Model):
    __tablename__ = 'session'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    channel_id = Column(String, ForeignKey('channel.id'))
    status = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    topic_refid = Column(String)
    opened_by_id = Column(String, nullable=False)
    opened_by_name = Column(String)
    opened_by_type = Column(String)
    assigned_to_id = Column(String)
    assigned_to_type = Column(String)
    assigned_to_name = Column(String)
    
    def  __init__(self, channel_id, status, topic, topic_refid, opened_by_id, opened_by_name, opened_by_type):
        Model.__init__(self)
        self.channel_id = channel_id
        self.status = status
        self.topic = topic
        self.topic_refid = topic_refid
        self.opened_by_id = opened_by_id
        self.opened_by_name = opened_by_name
        self.opened_by_type = opened_by_type