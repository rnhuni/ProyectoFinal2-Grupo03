from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .model import Model, Base
import uuid
from sqlalchemy.dialects.postgresql import UUID
from .invoice import Invoice
from .payment import Payment
from .active_subscription import ActiveSubscription

class Period(Model):
    __tablename__ = 'period'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    client_id = Column(String, nullable=False)
    date = Column(String, nullable=False)
    status = Column(String, nullable=False)
    
    active_subscription_id = Column(UUID, ForeignKey('active_subscription.id'), nullable=True)
    active_subscription = relationship('ActiveSubscription', back_populates='period')

    invoice = relationship('Invoice', back_populates='period', uselist=False)
    payment = relationship('Payment', back_populates='period', uselist=False)

    def __init__(self, client_id, date, active_subscription_id, status):
        Model.__init__(self)
        self.client_id = client_id
        self.date = date
        self.active_subscription_id = active_subscription_id
        self.status = status
