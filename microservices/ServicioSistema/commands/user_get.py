from ..models.model import session
from ..models.user import User
from .base_command import BaseCommannd

class GetUser(BaseCommannd):
    def __init__(self, id):
        self.id = id
    
    def execute(self):
        if not self.id:
            raise ValueError("Invalid data provided")
        
        return session.query(User).get(self.id)