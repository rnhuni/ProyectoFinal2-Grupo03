from ..models.model import session
from ..models.feedback import Feedback
from .base_command import BaseCommannd

class CreateFeedback(BaseCommannd):
    def __init__(self,user_id, incident_id, support_rating, ease_of_contact, \
                 resolution_time, support_staff_attitude, additional_comments):
        self.user_id = user_id
        self.incident_id = incident_id
        self.support_rating = support_rating
        self.ease_of_contact = ease_of_contact
        self.resolution_time = resolution_time
        self.support_staff_attitude = support_staff_attitude
        self.additional_comments = additional_comments
    
    def execute(self):
        if not self.user_id or not self.incident_id or not self.support_rating or not self.ease_of_contact or \
           not self.resolution_time or not self.support_staff_attitude or not self.additional_comments:
            raise ValueError("Invalid data provided")
        
        try:
            feedback = Feedback(self.user_id, self.incident_id, self.support_rating, self.ease_of_contact, \
                self.resolution_time, self.support_staff_attitude, self.additional_comments)
            
            session.add(feedback)
            session.commit()
            return feedback
        except Exception as e:
            session.rollback()
            raise e