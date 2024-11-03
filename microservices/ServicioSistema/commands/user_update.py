from ..models.model import session
from ..models.user import User
from .base_command import BaseCommannd

class UpdateUser(BaseCommannd):
    def __init__(self, user_id, name, email, role_id, client_id):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.role_id = role_id
        self.client_id = client_id

    def execute(self):
        user = session.query(User).filter_by(id=self.user_id).first()
        if not user:
            raise ValueError("User not found")

        user.name = self.name
        user.email = self.email
        user.role_id = self.role_id
        user.client_id = self.client_id

        session.commit()

        return user