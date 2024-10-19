from sqlalchemy import Column, String, DECIMAL
from sqlalchemy.orm import relationship
from .model import Model, Base
from .subscription_plan_role import SubscriptionPlanRole

class SubscriptionPlan(Model):
    __tablename__ = 'subscription_plan'
    id = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, nullable=True)
    price = Column(DECIMAL(precision=10, scale=2), nullable=False)
    features = Column(String, nullable=True)

    roles = relationship(
        'Role', 
        secondary='subscription_plan_role', 
        back_populates='plans'
    )

    def __init__(self, id, name, description, status, price, features):
        Model.__init__(self)
        self.id = id
        self.name = name
        self.description = description
        self.price = price
        self.status = status
        self.features = features
