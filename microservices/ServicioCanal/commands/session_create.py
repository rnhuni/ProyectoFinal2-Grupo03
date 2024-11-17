from ..models.model import session
from ..models.session import Session
from .base_command import BaseCommannd

class CreateSession(BaseCommannd):
    def __init__(self, channel_id,  topic, topic_refid, opened_by_id, opened_by_name, opened_by_type):
        self.channel_id = channel_id
        self.topic = topic
        self.topic_refid = topic_refid
        self.opened_by_id = opened_by_id
        self.opened_by_name = opened_by_name
        self.opened_by_type = opened_by_type
    
    def execute(self):
        if not self.channel_id or not self.opened_by_id:
            raise ValueError("Invalid data provided")
        
        try:
            data = Session(self.channel_id, "OPEN",  self.topic, self.topic_refid, self.opened_by_id, \
                           self.opened_by_name, self.opened_by_type)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e