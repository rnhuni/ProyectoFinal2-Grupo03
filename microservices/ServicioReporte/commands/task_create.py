from ..models.model import session
from ..models.task import Task
from .base_command import BaseCommannd

class CreateTask(BaseCommannd):
    def __init__(self, filters):
        self.filters = filters
    
    def execute(self):
        if not self.filters:
            raise ValueError("Invalid data provided")
        
        try:
            data = Task(self.filters, "PENDING")
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e