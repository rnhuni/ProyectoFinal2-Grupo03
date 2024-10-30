from ..models.model import session
from ..models.attachment import Attachment
from ..models.incident_attachment import IncidentAttachment
from .base_command import BaseCommannd

class GetAttachment(BaseCommannd):
    def __init__(self, incident_id, attachment_id):
        self.incident_id = incident_id
        self.attachment_id = attachment_id

    def execute(self):
        return session.query(Attachment).join(IncidentAttachment).filter(
            IncidentAttachment.incident_id == self.incident_id,
            Attachment.id == self.attachment_id
        ).first()
