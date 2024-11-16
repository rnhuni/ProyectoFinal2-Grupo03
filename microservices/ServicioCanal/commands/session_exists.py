from ..models.model import session
from ..models.session import Session
from .base_command import BaseCommannd

class ExistsSession(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        if not self.id:
            raise ValueError("Invalid data provided")
        
        return session.query(Session).get(self.id) is not None