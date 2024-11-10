
from sqlalchemy import func
from ..models.model import session
from ..models.notification import Notification
from .base_command import BaseCommannd

class ExistsNotification(BaseCommannd):
  def __init__(self, user_id, base_id):
      self.user_id = user_id
      self.base_id = base_id
  
  def execute(self):
      if not self.user_id or not self.base_id:
            raise ValueError("Invalid data provided")
      
      return session.query(Notification).filter_by(user_id=self.user_id,base_id=self.base_id).first() is not None