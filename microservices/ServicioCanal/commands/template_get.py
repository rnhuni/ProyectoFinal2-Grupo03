from ..models.model import session
from ..models.template import Template
from .base_command import BaseCommannd

class GetTemplate(BaseCommannd):
    def __init__(self, id):
        self.id = id

    def execute(self):
        if not self.id:
            raise ValueError("Invalid data provided")
        
        return session.query(Template).get(self.id)
        
        
        
        
