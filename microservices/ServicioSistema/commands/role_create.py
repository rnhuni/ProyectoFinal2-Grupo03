from ..models.model import session
from ..models.role import Role
from ..models.role_permission import RolePermission
from .base_command import BaseCommannd

class CreateRole(BaseCommannd):
    def __init__(self, id, name, permissions):
        self.id = id
        self.name = name
        self.permissions = permissions
    def execute(self):
        if not self.id or not self.name or not self.permissions:
            raise ValueError("Invalid data provided")
        
        try:
            role = Role(id=self.id, name=self.name)
            
            session.add(role)
            session.flush()
            for perm in self.permissions:
                permission_id = perm.get('permission')
                scopes = perm.get('scopes')
                for scope in scopes:
                    role_permission = RolePermission(
                            role_id=role.id,
                            permission_id=permission_id,
                            scope=scope
                        )
                    print(f"role_permission={role_permission}")
                    session.add(role_permission)
            session.commit()   
            return role
        except Exception as e:
                session.rollback()
                raise e