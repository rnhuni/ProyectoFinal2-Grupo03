from ..models.model import session
from ..models.client import Client
from .base_command import BaseCommannd
from datetime import datetime

class UpdateClient(BaseCommannd):
    def __init__(self, client_id, plan_id):
        self.client_id = client_id
        self.plan_id = plan_id

    def execute(self):
        if not self.client_id or not self.plan_id:
            raise ValueError("Invalid data provided")

        try:
            client = session.query(Client).filter_by(id=self.client_id).first()
            if not client:
                raise ValueError("Client not found")

            client.active_subscription_plan_id = self.plan_id

            session.commit()
            return client

        except Exception as e:
            session.rollback()
            raise e