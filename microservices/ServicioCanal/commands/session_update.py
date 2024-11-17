from ..models.model import session
from ..models.session import Session
from .base_command import BaseCommannd

class UpdateSession(BaseCommannd):
    def __init__(self, session_id, new_status):
        self.session_id = session_id
        self.new_status = new_status

    def execute(self):
        if not self.session_id or not self.new_status:
            raise ValueError("Invalid data provided")

        try:
            session_instance = session.query(Session).filter_by(id=self.session_id).first()

            if not session_instance:
                raise ValueError("Session not found")

            session_instance.status = self.new_status

            session.commit()

            return session_instance

        except Exception as e:
            session.rollback()
            raise e
