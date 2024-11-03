from ..models.model import session
from ..models.role import Role
from ..models.role_permission import RolePermission
from .base_command import BaseCommannd
from datetime import datetime

class UpdateRole(BaseCommannd):
    def __init__(self, id, name, permissions):
        self.id = id
        self.name = name
        self.permissions = permissions
    
    def execute(self):
        if not self.id or not self.name or not self.permissions:
            raise ValueError("Invalid data provided")

        try:
            role = session.query(Role).filter_by(id=self.id).first()
            if not role:
                raise ValueError("Role not found")

            role.name = self.name

            role.updatedAt = datetime.utcnow()

            session.query(RolePermission).filter_by(role_id=role.id).delete()

            for perm in self.permissions:
                permission_id = perm.get('id')
                actions = perm.get('actions', [])

                if not permission_id:
                    raise ValueError("Permission ID is missing")

                for action in actions:
                    role_permission = RolePermission(
                        role_id = self.id,
                        permission_id = permission_id,
                        action = action
                    )
                    session.add(role_permission)

            session.flush()

            session.commit()
            return role

        except Exception as e:
            session.rollback()
            raise e