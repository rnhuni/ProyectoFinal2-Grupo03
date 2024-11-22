from ..models.model import session
from ..models.session import Session
from .base_command import BaseCommannd

class ClaimSession(BaseCommannd):
    def __init__(self, session_id, user_id, user_name, user_type):
        self.session_id = session_id
        self.user_id = user_id
        self.user_name = user_name
        self.user_type = user_type

    def execute(self):
        if not self.session_id:
            raise ValueError("Session ID is required")

        try:
            data = session.query(Session).filter_by(id=self.session_id).first()
            if not data:
                raise ValueError("Session not found")

            data.assigned_to_id = self.user_id
            data.assigned_to_name = self.user_name
            data.assigned_to_type = self.user_type
            data.status = "ASSIGNED"

            session.commit()
            return data

        except Exception as e:
            session.rollback()
            raise e