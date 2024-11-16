from ..models.model import session
from ..models.task import Task
from .base_command import BaseCommannd

class UpdateTask(BaseCommannd):
    def __init__(self, task, key, status):
        self.task = task
        self.key = key
        self.status = status
    
    def execute(self):
        if not self.task:
            raise ValueError("Invalid data provided")
        
        try:
            if self.status:
                self.task.status = self.status
            if self.key:
                self.task.key = self.key

            session.commit()
            
            return self.task
        except Exception as e:
            session.rollback()
            raise e