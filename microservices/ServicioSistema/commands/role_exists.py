from ..models.model import session
from ..models.role import Role
from .base_command import BaseCommannd

class ExistsRole(BaseCommannd):
  def __init__(self, id):
      self.id = id
  
  def execute(self):
      if not self.id:
            raise ValueError("Invalid data provided")
      
      return session.query(Role).get(self.id)  is not None