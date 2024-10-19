from ..models.model import session
from ..models.subscription_plan import SubscriptionPlan
from ..models.subscription_plan_role import SubscriptionPlanRole
from .base_command import BaseCommannd

class CreateSubscriptionPlan(BaseCommannd):
    def __init__(self, id, name, description, status, price, features, roles):
        self.id = id
        self.name = name
        self.description = description
        self.status = status
        self.price = price
        self.features = features
        self.roles = roles

    def execute(self):
        if not self.id or not self.name or not self.roles:
            raise ValueError("Invalid data provided")

        try:
            plan = SubscriptionPlan(id=self.id, name=self.name, description=self.description, 
                                    status=self.status, price=self.price, features=self.features)
            session.add(plan)
            session.flush()
            
            for role_id in self.roles:
                plan_role = SubscriptionPlanRole(
                    plan_id=plan.id,
                    role_id=role_id
                )
                print(f"plan_role={plan_role}")
                session.add(plan_role)

            session.commit()   
            return plan
        except Exception as e:
            session.rollback()
            raise e
