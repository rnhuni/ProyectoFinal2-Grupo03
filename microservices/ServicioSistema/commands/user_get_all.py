from ..models.model import session
from ..models.user import User
from .base_command import BaseCommannd

class GetAllUsers(BaseCommannd):
    def execute(self):
        return session.query(User).all()