from sqlalchemy import asc, desc
from ..models.model import session
from ..models.incident import Incident
from .base_command import BaseCommannd

class GetAllIncidents(BaseCommannd):
    def __init__(self, status=None, assigned_to=None, user_issuer=None, order=None, start_date=None, end_date=None):
        self.status = status
        self.assigned_to = assigned_to
        self.user_issuer = user_issuer
        self.start_date = start_date
        self.end_date = end_date
        self.order = order

    def execute(self):
        query = session.query(Incident)

        if self.status:
            query = query.filter(Incident.status == self.status)
        if self.assigned_to:
            query = query.filter(Incident.assigned_to_id == self.assigned_to)
        if self.user_issuer:
            query = query.filter(Incident.user_issuer_id == self.user_issuer)
        if self.start_date:
            query = query.filter(Incident.createdAt >= self.start_date)
        if self.end_date:
            query = query.filter(Incident.createdAt <= self.end_date)

        if self.order == "asc":
            query = query.order_by(asc(Incident.createdAt))
        else:
            query = query.order_by(desc(Incident.createdAt))
        
        return query.all()