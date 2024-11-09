from ..models.model import session
from ..models.notification import Notification
from .base_command import BaseCommannd

class GetAllNotifications(BaseCommannd):
    def __init__(self, user_id):
        self.user_id = user_id

    def execute(self):
        return session.query(Notification).filter_by(user_id=self.user_id).all()