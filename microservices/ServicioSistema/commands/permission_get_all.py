from ..models.model import session
from ..models.permission import Permission
from .base_command import BaseCommannd

class GetAllPermissions(BaseCommannd):
    def execute(self):
        return session.query(Permission).all()