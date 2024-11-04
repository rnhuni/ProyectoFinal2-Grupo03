from sqlalchemy import Column, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from .model import Model, Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class ActiveSubscriptionFeature(Model):
    __tablename__ = 'active_subscription_feature'
    plan_id = Column(UUID(as_uuid=True), ForeignKey('active_subscription.id'), primary_key=True)
    feature_id = Column(String, nullable=False, primary_key=True)
    feature_name = Column(String, nullable=False)
    feature_price = Column(DECIMAL(precision=10, scale=2), nullable=False)

    subscription = relationship('ActiveSubscription', back_populates='features')

    def __init__(self, plan_id, feature_id, feature_name, feature_price):
        Model.__init__(self)
        self.plan_id = plan_id
        self.feature_id = feature_id
        self.feature_name = feature_name
        self.feature_price = feature_price
