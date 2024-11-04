from ..models.model import session
from ..models.payment import Payment
from .base_command import BaseCommannd

class GetPayment(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        return session.query(Payment).filter_by(id=self.id).first()