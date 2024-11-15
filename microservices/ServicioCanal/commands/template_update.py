from ..models.model import session
from ..models.template import Template
from .base_command import BaseCommannd

class UpdateTemplate(BaseCommannd):
    def __init__(self, template, name, content_type, body, auto_trigger, status, trigger_event):
        self.template = template
        self.name = name
        self.content_type = content_type
        self.body = body
        self.auto_trigger = auto_trigger
        self.status = status
        self.trigger_event = trigger_event
    
    def execute(self):
        if not self.template:
            raise ValueError("Invalid data provided")
        
        try:
            if self.name:
                self.template.name = self.name
            if self.content_type:
                self.template.content_type = self.content_type
            if self.body:
                self.template.body = self.body
            if self.auto_trigger:
                self.template.auto_trigger = self.auto_trigger
            if self.status:
                self.template.status = self.status
            if self.trigger_event:
                self.template.trigger_event = self.trigger_event

            session.commit()
            
            return self.template
        except Exception as e:
            session.rollback()
            raise e