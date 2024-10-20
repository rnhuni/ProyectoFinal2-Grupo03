import os
from ..models.model import session
from ..models.user import User
from ..models.client import Client
from ..models.role import Role
from .base_command import BaseCommannd
from ServicioSistema.services.cognito_service import CognitoService

cognito_service=None
if os.getenv('ENV') != 'test':
    cognito_service = CognitoService()

class CreateUser(BaseCommannd):
    def __init__(self, name, email, role, client_id):
        self.name = name
        self.email = email
        self.role = role
        self.client_id = client_id

    def execute(self):
        if not self.name or not self.email or not self.role or not self.client_id:
            raise ValueError("Invalid data provided")

        try:
            client = session.query(Client).get(self.client_id)
            
            if not client:
                raise ValueError(f"Client with id {self.client_id} does not exist")

            permissions_str = self._convert_permissions_to_string(self.role.permissions)

            cognito_user = cognito_service.register_user(
                name=self.name,
                email=self.email,
                client=str(self.client_id),
                role=str(self.role.id),
                permissions=permissions_str
            )
            cognito_id = cognito_user['User']['Username']

            status = cognito_user['User']['UserStatus']

            user = User(
                name=self.name,
                email=self.email,
                cognito_id=cognito_id,
                role_id=self.role.id,
                client_id=self.client_id,
            )

            user.status = status

            session.add(user)
            session.commit()
            return user
        except Exception as e:
            session.rollback()
            raise e
        

    def _convert_permissions_to_string(self, permissions):
            permission_list = []
            for rp in permissions:
                permission_id = rp.permission.id
                permission_list.append(f"{permission_id}:{rp.action}")
            return ";".join(permission_list)
