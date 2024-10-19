from ..models.model import session
from ..models.user import User
from .base_command import BaseCommannd

class ExistsUserByEmail(BaseCommannd):
    def __init__(self, email):
        self.email = email

    def execute(self):
        if not self.email:
            raise ValueError("Email is required")
        
        return session.query(User).filter_by(email=self.email).first() is not None