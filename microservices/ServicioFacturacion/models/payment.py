from sqlalchemy import Column, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from .model import Model, Base
from sqlalchemy.dialects.postgresql import UUID

class Payment(Model):
    __tablename__ = 'payment'
    id = Column(UUID(as_uuid=True), primary_key=True)
    description = Column(String, nullable=False)
    date = Column(String, nullable=False)
    amount = Column(DECIMAL(precision=10, scale=2), nullable=False)
    status = Column(String, nullable=False)

    period_id = Column(UUID, ForeignKey('period.id'), nullable=False)
    period = relationship('Period', back_populates='payment')

    def __init__(self, id, description, period_id, date, amount, status):
        Model.__init__(self)
        self.id = id
        self.description = description
        self.period_id = period_id
        self.date = date
        self.amount = amount
        self.status = status
