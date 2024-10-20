from ..models.model import session
from ..models.subscription_plan import SubscriptionPlan
from .base_command import BaseCommannd

class ExistsSubscriptionPlan(BaseCommannd):
  def __init__(self, id):
      self.id = id
  
  def execute(self):
      if not self.id:
            raise ValueError("Invalid data provided")
      
      return session.query(SubscriptionPlan).get(self.id)  is not None