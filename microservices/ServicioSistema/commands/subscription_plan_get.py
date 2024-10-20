from ServicioSistema.models.model import session
from ServicioSistema.models.subscription_plan import SubscriptionPlan

class GetSubscriptionPlan:
    def __init__(self, id):
        self.id = id

    def execute(self):
        if not self.id:
            raise ValueError("Invalid data provided")
        
        return session.query(SubscriptionPlan).get(self.id)