from sqlalchemy import Column, String, ForeignKey, DECIMAL, Boolean
from sqlalchemy.orm import relationship
from .model import Model, Base
import uuid
from sqlalchemy.dialects.postgresql import UUID
from .active_subscription_feature import ActiveSubscriptionFeature

class ActiveSubscription(Model):
    __tablename__ = 'active_subscription'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = Column(String, nullable=False)
    base_id = Column(String, nullable=False)
    base_name = Column(String, nullable=False)
    description = Column(String)
    price = Column(DECIMAL(precision=10, scale=2), nullable=False)
    status = Column(String, nullable=False)
    notify_by_email = Column(Boolean, nullable=False, default=False)

    period = relationship('Period', back_populates='active_subscription', uselist=False)
    features = relationship('ActiveSubscriptionFeature', back_populates='subscription', cascade='all, delete-orphan')

    def __init__(self, client_id, base_id, base_name, description, price, status, notify_by_email):
        Model.__init__(self)
        self.client_id = client_id
        self.base_id = base_id
        self.base_name = base_name
        self.description = description
        self.price = price
        self.status = status
        self.notify_by_email = notify_by_email
