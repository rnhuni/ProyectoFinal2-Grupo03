from ..models.model import session
from ..models.permission import Permission
from .base_command import BaseCommannd
from datetime import datetime

class UpdatePermission(BaseCommannd):
    def __init__(self, permission_id, name, resource, description):
        self.permission_id = permission_id
        self.name = name
        self.resource = resource
        self.description = description

    def execute(self):
        if not self.permission_id or not self.name or not self.resource:
            raise ValueError("Invalid data provided")

        try:
            permission = session.query(Permission).filter_by(id=self.permission_id).first()
            if not permission:
                raise ValueError("Permission not found")

            permission.name = self.name
            permission.resource = self.resource
            permission.description = self.description
            permission.updatedAt = datetime.utcnow()

            session.commit()
            return permission

        except Exception as e:
            session.rollback()
            raise e