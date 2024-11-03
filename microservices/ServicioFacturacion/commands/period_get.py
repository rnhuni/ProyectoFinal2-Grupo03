from ..models.model import session
from ..models.period import Period
from .base_command import BaseCommannd

class GetPeriod(BaseCommannd):
    def __init__(self, id = None, client_id = None, period_date = None, status = None):
        self.id = id
        self.client_id = client_id
        self.period_date = period_date
        self.status = status

    def execute(self):
        if self.id:
            return session.query(Period).get(self.id)
        
        if self.client_id and self.period_date:
            return session.query(Period).filter_by(client_id=self.client_id, date=self.period_date).first()
        
        if self.client_id and self.status:
            return session.query(Period).filter_by(client_id=self.client_id, status=self.status).all()
        
        raise ValueError("Invalid data provided")
        
        
