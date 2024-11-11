from ..models.model import session
from ..models.notification import Notification
from .base_command import BaseCommannd

class CreateNotification(BaseCommannd):
    def __init__(self, name, service, show_by_default):
        self.name = name
        self.service = service
        self.show_by_default = show_by_default
    
    def execute(self):
        if not self.name or not self.service or self.show_by_default is None:
            raise ValueError("Invalid data provided")
        
        try:
            data = Notification(self.name, self.service, self.show_by_default)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e