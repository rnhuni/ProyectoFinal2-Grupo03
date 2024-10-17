from ..models.model import session
from ..models.permission import Permission
from .base_command import BaseCommannd

class CreatePermission(BaseCommannd):
    def __init__(self, id, name, service, description):
        self.id = id
        self.name = name
        self.service = service
        self.description = description
    
    def execute(self):
        if not self.id or not self.name or not self.service or not self.description:
            raise ValueError("Invalid data provided")
        
        try:
            permission = Permission(id=self.id, name=self.name, service=self.service, description=self.description)
            
            session.add(permission)
            session.commit()

            return permission
        except Exception as e:
            session.rollback()
            raise e