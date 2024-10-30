from ..models.model import session
from ..models.attachment import Attachment
from ..models.incident_attachment import IncidentAttachment
from .base_command import BaseCommannd

class GetAllAttachments(BaseCommannd):
    def __init__(self, incident_id):
        self.incident_id = incident_id

    def execute(self):
        return session.query(Attachment).join(IncidentAttachment).filter(
            IncidentAttachment.incident_id == self.incident_id
        ).all()
