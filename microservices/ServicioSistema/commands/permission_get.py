from ..models.model import session
from ..models.permission import Permission
from .base_command import BaseCommannd

class GetPermission(BaseCommannd):
    def __init__(self, id):
        self.id = id
    
    def execute(self):
        if not self.id:
            raise ValueError("Invalid data provided")
        
        return session.query(Permission).get(self.id)