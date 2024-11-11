from ..models.model import session
from ..models.notification  import Notification
from .base_command import BaseCommannd

class GetAllNotifications(BaseCommannd):
    def execute(self):
        return session.query(Notification).all()