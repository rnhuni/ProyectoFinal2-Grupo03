from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .model import Model, Base

class Client(Model):
    __tablename__ = 'client'
    id = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    email = Column(String, nullable=False)
    
    active_subscription_plan_id = Column(String, ForeignKey('subscription_plan.id'))
    active_subscription_plan = relationship('SubscriptionPlan', backref='clients')

    def __init__(self, name, description, email, subscription_plan_id):
        Model.__init__(self)
        self.name = name
        self.description = description
        self.email = email
        self.subscription_plan_id = subscription_plan_id
