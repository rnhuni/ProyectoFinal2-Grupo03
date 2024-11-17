from ..models.model import session
from ..models.session import Session
from .base_command import BaseCommannd

class GetAllSessions(BaseCommannd):
    def __init__(self, channel_id):
        self.channel_id = channel_id

    def execute(self):
        return session.query(Session).filter_by(channel_id=self.channel_id).all()
