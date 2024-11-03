from ..models.model import session
from ..models.subscription_plan import SubscriptionPlan

class GetAllSubscriptions:
    def execute(self):
        return session.query(SubscriptionPlan).all()