from sqlalchemy import asc, desc
from ..models.model import session
from ..models.log import Log
from .base_command import BaseCommannd

class GetLogs(BaseCommannd):
    def __init__(self, source_id, event_type, start_date, end_date, order):
        self.source_id = source_id
        self.event_type = event_type
        self.start_date = start_date
        self.end_date = end_date
        self.order = order

    def execute(self):
        query = session.query(Log)

        if self.source_id:
            query = query.filter(Log.source_id == self.source_id)
        if self.event_type:
            query = query.filter(Log.event_type == self.event_type)
        if self.start_date:
            query = query.filter(Log.createdAt >= self.start_date)
        if self.end_date:
            query = query.filter(Log.createdAt <= self.end_date)

        if self.order == "asc":
            query = query.order_by(asc(Log.createdAt))
        else:
            query = query.order_by(desc(Log.createdAt))
        
        return query.all()
        
        
        
        
