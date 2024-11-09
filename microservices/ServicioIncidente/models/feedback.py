from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .model import Model, Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class Feedback(Model):
    __tablename__ = 'feedback'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    incident_id = Column('incident_id', String, ForeignKey('incident.id'), primary_key=True)
    support_rating = Column(Integer, nullable=False)
    ease_of_contact = Column(Integer, nullable=False)
    resolution_time = Column(Integer, nullable=False)
    support_staff_attitude = Column(Integer, nullable=False)
    additional_comments = Column(String, nullable=False)

    def __init__(self, user_id, incident_id, support_rating, ease_of_contact, \
                resolution_time, support_staff_attitude, additional_comments):
        Model.__init__(self)
        self.user_id = user_id
        self.incident_id = incident_id
        self.support_rating = support_rating
        self.ease_of_contact = ease_of_contact
        self.resolution_time = resolution_time
        self.support_staff_attitude = support_staff_attitude
        self.additional_comments = additional_comments