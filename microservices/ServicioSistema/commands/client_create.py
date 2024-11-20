from ..models.model import session
from ..models.client import Client
from .base_command import BaseCommannd
from datetime import datetime

class CreateClient(BaseCommannd):
    def __init__(self, id, name, description, email, plan_id):
        self.id = id
        self.name = name
        self.description = description
        self.email = email
        self.plan_id = plan_id

    def execute(self):
        if not self.id or not self.name or not self.email or not self.plan_id:
            raise ValueError("Invalid data provided")

        try:
            data = Client(self.id, self.name, self.description, self.email, self.plan_id)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e