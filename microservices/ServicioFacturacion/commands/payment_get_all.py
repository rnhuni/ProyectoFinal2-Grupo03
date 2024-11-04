from ..models.model import session
from ..models.payment import Payment
from .base_command import BaseCommannd

class GetAllPayments(BaseCommannd):
    def execute(self):
        return session.query(Payment).all()