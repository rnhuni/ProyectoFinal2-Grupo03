from ..models.model import session
from ..models.active_subscription import ActiveSubscription
from .base_command import BaseCommannd

class GetAllSubscriptions(BaseCommannd):
    def execute(self):
        return session.query(ActiveSubscription).all()