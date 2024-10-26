from ..models.model import session
from ..models.attachment import Attachment
from ..models.incident_attachment import IncidentAttachment
from .base_command import BaseCommannd

class CreateAttachment(BaseCommannd):
    def __init__(self,id,incident_id, file_name, file_uri, content_type, user_id, user_name):
        self.id = id
        self.incident_id = incident_id
        self.file_name = file_name
        self.file_uri = file_uri
        self.content_type = content_type
        self.user_id = user_id
        self.user_name = user_name
    
    def execute(self):
        if not self.id or not self.incident_id or not self.file_name or not self.file_uri or \
           not self.content_type or not self.user_id or not self.user_name:
            raise ValueError("Invalid data provided")
        
        try:
            attachment = Attachment(self.id, self.file_name, self.file_uri, \
                                    self.content_type, self.user_id, self.user_name)
            session.add(attachment)
            session.flush()
            incident_attachment = IncidentAttachment(self.incident_id,attachment.id)
            session.add(incident_attachment)
            
            session.commit()
            return attachment
        except Exception as e:
            session.rollback()
            raise e