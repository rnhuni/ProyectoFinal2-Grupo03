from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from .model import Model, Base
from .role_permission import RolePermission
from .subscription_plan import SubscriptionPlan
from .subscription_plan_role import SubscriptionPlanRole

class Role(Model):
    __tablename__ = 'role'
    id = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=False)

    permissions = relationship(
        'RolePermission', 
        backref='role',
        cascade="all, delete-orphan",
        lazy='joined'
    )

    plans = relationship(
        'SubscriptionPlan', 
        secondary='subscription_plan_role', 
        back_populates='roles'
    )

    def __init__(self, id, name):
        Model.__init__(self)
        self.id = id
        self.name = name
