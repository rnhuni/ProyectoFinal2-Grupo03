from ..models.model import session
from ..models.subscription_plan import SubscriptionPlan
from ..models.role import Role

class UpdateSubscriptionPlan:
    def __init__(self, subscription_id, name, description, status, price, features, roles):
        self.subscription_id = subscription_id
        self.name = name
        self.description = description
        self.status = status
        self.price = price
        self.features = features
        self.roles = roles

    def execute(self):
        subscription_plan = session.query(SubscriptionPlan).get(self.subscription_id)
        if not subscription_plan:
            raise ValueError(f"Subscription with ID '{self.subscription_id}' not found")

        if not self.name or len(self.name.strip()) < 1:
            raise ValueError("Name is required")
        if self.price < 0:
            raise ValueError("Price must be a positive number")

        subscription_plan.name = self.name
        subscription_plan.description = self.description
        subscription_plan.status = self.status
        subscription_plan.price = self.price
        subscription_plan.features = self.features

        subscription_plan.roles.clear()

        for role_id in self.roles:
            role = session.query(Role).get(role_id)
            if not role:
                raise ValueError(f"Role with ID '{role_id}' not found")
            subscription_plan.roles.append(role)

        session.commit()

        return subscription_plan