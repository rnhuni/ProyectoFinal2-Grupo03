from ..models.model import session
from ..models.channel import Channel
from .base_command import BaseCommannd

class GetAllChannels(BaseCommannd):
    def execute(self):
        return session.query(Channel).all()
