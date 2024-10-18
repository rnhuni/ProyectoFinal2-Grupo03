from ..models.model import session
from ..models.role import Role
from .base_command import BaseCommannd

class GetAllRoles(BaseCommannd):
    def execute(self):
        return session.query(Role).all()