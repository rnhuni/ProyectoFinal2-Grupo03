from ..models.model import session
from ..models.template import Template
from .base_command import BaseCommannd

class CreateTemplate(BaseCommannd):
    def __init__(self, name, content_type, body, auto_trigger, status, trigger_event):
        self.name = name
        self.content_type = content_type
        self.body = body
        self.auto_trigger = auto_trigger
        self.status = status
        self.trigger_event = trigger_event
    
    def execute(self):
        if not self.name or not self.body or not self.content_type or not self.status:
            raise ValueError("Invalid data provided")
        
        try:
            data = Template(self.name, self.content_type, self.body, \
                            self.auto_trigger, self.status, self.trigger_event)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e