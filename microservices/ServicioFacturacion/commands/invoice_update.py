from ..models.model import session
from ..models.invoice import Invoice
from .base_command import BaseCommannd

class UpdateInvoice(BaseCommannd):
    def __init__(self, invoice_id, description=None, period_id=None, date=None, amount=None, status=None):
        self.invoice_id = invoice_id
        self.description = description
        self.period_id = period_id
        self.date = date
        self.amount = amount
        self.status = status

    def execute(self):
        invoice = session.query(Invoice).get(self.invoice_id)
        if not invoice:
            raise ValueError("Invoice not found")

        if self.description:
            invoice.description = self.description
        if self.period_id:
            invoice.period_id = self.period_id
        if self.date:
            invoice.date = self.date
        if self.amount:
            invoice.amount = self.amount
        if self.status:
            invoice.status = self.status

        session.commit()
        
        return invoice