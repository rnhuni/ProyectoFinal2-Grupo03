from ..models.model import session
from ..models.template import Template
from .base_command import BaseCommannd

class GetAllTemplates(BaseCommannd):
    def execute(self):
        return session.query(Template).all()
