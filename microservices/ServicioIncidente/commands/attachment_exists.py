from ..models.model import session
from ..models.attachment import Attachment
from .base_command import BaseCommannd

class ExistsAttachment(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        if not self.id:
            raise ValueError("Attachment ID is required")
        
        return session.query(Attachment).get(self.id) is not None