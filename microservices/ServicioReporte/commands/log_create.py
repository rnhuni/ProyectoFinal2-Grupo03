from ..models.model import session
from ..models.log import Log
from .base_command import BaseCommannd

class CreateLog(BaseCommannd):
    def __init__(self, source_id, source_name, source_type, event_type, event_content):
        self.source_id = source_id
        self.source_name = source_name
        self.source_type = source_type
        self.event_type = event_type
        self.event_content = event_content
    
    def execute(self):
        if not self.source_id or not self.source_name or not self.source_type or not self.event_type:
            raise ValueError("Invalid data provided")
        
        try:
            data = Log(self.source_id, self.source_name, self.source_type, \
                       self.event_type, self.event_content)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e