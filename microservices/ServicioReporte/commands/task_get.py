from ..models.model import session
from ..models.task import Task
from .base_command import BaseCommannd

class GetTask(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        return session.query(Task).filter_by(id=self.id).first()