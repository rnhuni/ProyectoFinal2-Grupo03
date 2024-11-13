from ..models.model import session
from ..models.message import Message
from .base_command import BaseCommannd

class CreateMessage(BaseCommannd):
    def __init__(self, session_id, source_id, source_name, source_type, content_type, body):
        self.session_id = session_id
        self.source_id = source_id
        self.source_name = source_name
        self.source_type = source_type
        self.content_type = content_type
        self.body = body
    
    def execute(self):
        if not self.session_id or not self.source_id or not self.source_name or \
           not self.content_type or not self.body:
            raise ValueError("Invalid data provided")
        
        try:
            data = Message(self.session_id, self.source_id, self.source_name, \
                           self.source_type, self.content_type, self.body)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e