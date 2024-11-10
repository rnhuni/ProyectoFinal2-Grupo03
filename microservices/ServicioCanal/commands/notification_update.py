from ..models.model import session
from ..models.notification import Notification
from .base_command import BaseCommannd
from datetime import datetime

class UpdateNotification(BaseCommannd):
    def __init__(self, user_id, base_id, show):
        self.user_id = user_id
        self.base_id = base_id
        self.show = show

    def execute(self):
        print(f"user_id={self.user_id} base_id={self.base_id} show={self.show}")
        if not self.user_id or not self.base_id or self.show is None:
            raise ValueError("Invalid data provided")

        try:
            data = session.query(Notification).filter_by(user_id=self.user_id,base_id=self.base_id).first()
            if not data:
                raise ValueError("Notification not found")

            data.show = self.show

            session.commit()
            return data

        except Exception as e:
            session.rollback()
            raise e