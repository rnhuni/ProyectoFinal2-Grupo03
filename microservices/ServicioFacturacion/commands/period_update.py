from ..models.model import session
from ..models.period import Period
from .base_command import BaseCommannd

class UpdatePeriod(BaseCommannd):
    def __init__(self, period, active_subscription, status):
        self.period = period
        self.active_subscription = active_subscription
        self.status = status

    def execute(self):
        if not self.period or not self.active_subscription or not self.status:
            raise ValueError("Invalid data provided")

        try:
            self.period.active_subscription_id = self.active_subscription.id
            self.period.status = self.status
            
            session.commit()
            
            return self.period

        except Exception as e:
            session.rollback()
            raise e