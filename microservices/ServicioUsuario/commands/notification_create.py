from ..models.model import session
from ..models.notification import Notification
from .base_command import BaseCommannd

class CreateNotification(BaseCommannd):
    def __init__(self, user_id, base_id, name, show):
        self.user_id = user_id
        self.name = name
        self.base_id = base_id
        self.show = show
    
    def execute(self):
        print(f"user_id={self.user_id} name={self.name} base_id={self.base_id} show={self.show}")
        if not self.user_id or not self.name or not self.base_id or self.show is None:
            raise ValueError("Invalid data provided")
        
        try:
            data = Notification(self.user_id, self.base_id, self.name, self.show)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e