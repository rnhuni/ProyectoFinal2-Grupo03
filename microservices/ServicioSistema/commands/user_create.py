from ..models.model import session
from ..models.user import User
from ..models.client import Client
from ..models.role import Role
from .base_command import BaseCommannd
from ServicioSistema.services.cognito_service import CognitoService

#cognito_service = CognitoService()

class CreateUser(BaseCommannd):
    def __init__(self, name, email, temporary_password, role_id, client_id):
        self.name = name
        self.email = email
        self.temporary_password = temporary_password
        self.role_id = role_id
        self.client_id = client_id

    def execute(self):
        if not self.name or not self.email or not self.role_id or not self.client_id:
            raise ValueError("Invalid data provided")

        try:
            role = session.query(Role).get(self.role_id)
            client = session.query(Client).get(self.client_id)

            if not role:
                raise ValueError(f"Role with id {self.role_id} does not exist")
            
            if not client:
                raise ValueError(f"Client with id {self.client_id} does not exist")


            #cognito_user = cognito_service.register_user(self.email, self.temporary_password)
            cognito_id = "cognito_user['User']['Username']"

            user = User(
                name=self.name,
                email=self.email,
                cognito_id=cognito_id,
                role_id=self.role_id,
                client_id=self.client_id
            )

            session.add(user)
            session.commit()
            return user
        except Exception as e:
            session.rollback()
            raise e
