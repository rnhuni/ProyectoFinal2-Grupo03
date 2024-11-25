from ..models.model import session
from ..models.channel import Channel
from .base_command import BaseCommannd

class GetChannel(BaseCommannd):
    def __init__(self, channel_id):
        self.channel_id = channel_id

    def execute(self):
        return session.query(Channel).filter_by(id=self.channel_id).first()
