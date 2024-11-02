from ..models.model import session
from ..models.active_subscription import ActiveSubscription
from .base_command import BaseCommannd

class ActiveSubscriptionExists(BaseCommannd):
    def __init__(self, id = None, client_id = None, status = None):
        self.id = id
        self.client_id = client_id
        self.status = status

    def execute(self):
        if self.id:
            return session.query(ActiveSubscription).get(self.id) is not None
        
        if self.client_id and self.status:
            return session.query(ActiveSubscription).filter_by(client_id=self.client_id, status=self.status).first() is not None
        
        raise ValueError("Invalid data provided")
        
        
