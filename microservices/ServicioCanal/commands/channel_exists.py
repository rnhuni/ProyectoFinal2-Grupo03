from ..models.model import session
from ..models.channel import Channel
from .base_command import BaseCommannd

class ExistsChannel(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        if not self.id:
            raise ValueError("Invalid data provided")
        
        return session.query(Channel).get(self.id) is not None
        
        
        
        
