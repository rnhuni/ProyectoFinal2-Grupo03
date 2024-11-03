from ..models.model import session
from ..models.payment import Payment
from .base_command import BaseCommannd

class CreatePayment(BaseCommannd):
    def __init__(self, payment_id, description, period_id, date, amount, status):
        self.payment_id = payment_id
        self.description = description
        self.period_id = period_id
        self.date = date
        self.amount = amount
        self.status = status
    
    def execute(self):
        if not self.payment_id or not self.description or not self.period_id or\
           not self.date or not self.amount or not self.status:
            raise ValueError("Invalid data provided")
        
        try:
            payment = Payment(self.payment_id, self.description, self.period_id, self.date, self.amount, self.status)
            
            session.add(payment)
            session.commit()

            return payment
        except Exception as e:
            session.rollback()
            raise e