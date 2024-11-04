from ..models.model import session
from ..models.invoice import Invoice
from .base_command import BaseCommannd

class GetInvoice(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        return session.query(Invoice).filter_by(id=self.id).first()
