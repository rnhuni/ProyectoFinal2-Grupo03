from ..models.model import session
from ..models.invoice import Invoice
from .base_command import BaseCommannd

class GetAllInvoices(BaseCommannd):
    def execute(self):
        return session.query(Invoice).all()