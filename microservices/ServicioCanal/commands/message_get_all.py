from ..models.model import session
from ..models.message import Message
from .base_command import BaseCommannd

class GetAllMessages(BaseCommannd):
    def __init__(self, session_id):
        self.session_id = session_id

    def execute(self):
        return session.query(Message).filter_by(session_id=self.session_id).all()
