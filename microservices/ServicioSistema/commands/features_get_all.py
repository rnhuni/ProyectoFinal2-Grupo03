from ..models.model import session
from ..models.feature import Feature
from .base_command import BaseCommannd

class GetAllFeatures(BaseCommannd):
    def execute(self):
        return session.query(Feature).all()