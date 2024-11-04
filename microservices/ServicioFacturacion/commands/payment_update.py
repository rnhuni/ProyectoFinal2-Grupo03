from ..models.model import session
from ..models.payment import Payment
from .base_command import BaseCommannd

class UpdatePayment(BaseCommannd):
    def __init__(self, payment_id, description=None, period_id=None, date=None, amount=None, status=None):
        self.payment_id = payment_id
        self.description = description
        self.period_id = period_id
        self.date = date
        self.amount = amount
        self.status = status

    def execute(self):
        payment = session.query(Payment).get(self.payment_id)
        if not payment:
            raise ValueError("Payment not found")

        if self.description:
            payment.description = self.description
        if self.period_id:
            payment.period_id = self.period_id
        if self.date:
            payment.date = self.date
        if self.amount:
            payment.amount = self.amount
        if self.status:
            payment.status = self.status

        session.commit()
        return payment