from ..models.model import session
from ..models.permission import Permission
from .base_command import BaseCommannd

class CreatePermission(BaseCommannd):
    def __init__(self, id, name, resource, description):
        self.id = id
        self.name = name
        self.resource = resource
        self.description = description
    
    def execute(self):
        if not self.id or not self.name or not self.resource or not self.description:
            raise ValueError("Invalid data provided")
        
        try:
            permission = Permission(id=self.id, name=self.name, resource=self.resource, description=self.description)
            
            session.add(permission)
            session.commit()

            return permission
        except Exception as e:
            session.rollback()
            raise e