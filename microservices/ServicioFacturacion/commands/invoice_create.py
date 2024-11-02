from ..models.model import session
from ..models.invoice import Invoice
from .base_command import BaseCommannd

class CreateInvoice(BaseCommannd):
    def __init__(self, invoice_id, description, period_id, date, amount, status):
        self.invoice_id = invoice_id
        self.description = description
        self.period_id = period_id
        self.date = date
        self.amount = amount
        self.status = status
    
    def execute(self):
        if not self.invoice_id or not self.description or not self.period_id or\
           not self.date or not self.amount or not self.status:
            raise ValueError("Invalid data provided")
        
        try:
            invoice = Invoice(self.invoice_id, self.description, self.period_id, self.date, self.amount, self.status)
            
            session.add(invoice)
            session.commit()

            return invoice
        except Exception as e:
            session.rollback()
            raise e