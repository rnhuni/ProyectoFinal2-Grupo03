from ..models.model import session
from ..models.session import Session
from .base_command import BaseCommannd

class GetSession(BaseCommannd):
    def __init__(self, session_id):
        self.session_id = session_id

    def execute(self):
        return session.query(Session).filter_by(id=self.session_id).first()
