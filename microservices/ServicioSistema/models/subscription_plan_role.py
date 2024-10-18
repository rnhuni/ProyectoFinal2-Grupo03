from sqlalchemy import Column, String, ForeignKey
from .model import Model

class SubscriptionPlanRole(Model):
    __tablename__ = 'subscription_plan_role'
    plan_id = Column(String, ForeignKey('subscription_plan.id'), primary_key=True)
    role_id = Column(String, ForeignKey('role.id'), primary_key=True)

    def __init__(self, plan_id, role_id):
        self.plan_id = plan_id
        self.role_id = role_id
