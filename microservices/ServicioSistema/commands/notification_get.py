from ..models.model import session
from ..models.notification import Notification
from .base_command import BaseCommannd

class GetNotification(BaseCommannd):
    def __init__(self, id):
        self.id = id
    
    def execute(self):
        if not self.id:
            raise ValueError("Invalid data provided")
        
        return session.query(Notification).get(self.id)