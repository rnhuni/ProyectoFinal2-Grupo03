from sqlalchemy import asc, desc
from ..models.model import session
from ..models.session import Session
from .base_command import BaseCommannd

class GetAllSessionsByFilters(BaseCommannd):
    def __init__(self, channel=None, assigned_to=None, opened_by=None, status=None, \
                 topic=None, topic_refid=None, order=None, start_date=None, end_date=None):
        self.channel = channel
        self.assigned_to = assigned_to
        self.opened_by = opened_by
        self.status = status
        self.topic = topic
        self.topic_refid = topic_refid
        self.order = order
        self.start_date = start_date
        self.end_date = end_date

    def execute(self):
        query = session.query(Session)

        if self.channel:
            query = query.filter(Session.channel_id == self.channel)
        if self.assigned_to:
            query = query.filter(Session.assigned_to_id == self.assigned_to)
        if self.opened_by:
            query = query.filter(Session.opened_by_id == self.opened_by)
        if self.status:
            query = query.filter(Session.status == self.status)
        if self.topic:
            query = query.filter(Session.topic == self.topic)
        if self.topic_refid:
            query = query.filter(Session.topic_refid == self.topic_refid)
        if self.start_date:
            query = query.filter(Session.createdAt >= self.start_date)
        if self.end_date:
            query = query.filter(Session.createdAt <= self.end_date)

        if self.order == "asc":
            query = query.order_by(asc(Session.createdAt))
        else:
            query = query.order_by(desc(Session.createdAt))
        
        return query.all()
