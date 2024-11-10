from ..models.model import session
from ..models.notification import Notification
from .base_command import BaseCommannd
from datetime import datetime

class UpdateNotification(BaseCommannd):
    def __init__(self, notification_id, name, service, show_by_default):
        self.notification_id = notification_id
        self.name = name
        self.service = service
        self.show_by_default = show_by_default

    def execute(self):
        if not self.notification_id or not self.name or not self.service or self.show_by_default is None:
            raise ValueError("Invalid data provided")

        try:
            notification = session.query(Notification).filter_by(id=self.notification_id).first()
            if not notification:
                raise ValueError("Notification not found")

            notification.name = self.name
            notification.service = self.service
            notification.show_by_default = self.show_by_default
            notification.updatedAt = datetime.utcnow()

            session.commit()
            return notification

        except Exception as e:
            session.rollback()
            raise e
