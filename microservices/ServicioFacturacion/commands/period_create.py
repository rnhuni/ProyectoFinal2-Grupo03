from ..models.model import session
from ..models.period import Period
from .base_command import BaseCommannd

class CreatePeriod(BaseCommannd):
    def __init__(self, client_id, period_date, active_subscription, status):
        self.client_id = client_id
        self.period_date = period_date
        self.active_subscription = active_subscription
        self.status = status
    
    def execute(self):
        if not self.client_id or not self.period_date or not self.active_subscription or\
            not self.status:
            raise ValueError("Invalid data provided")
        
        try:            
            period = Period(self.client_id, self.period_date, self.active_subscription.id, self.status)
            
            session.add(period)
            session.commit()

            return period
        except Exception as e:
            session.rollback()
            raise e