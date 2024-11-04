from ..models.model import session
from ..models.period import Period
from .base_command import BaseCommannd

class GetAllPeriods(BaseCommannd):
    def execute(self):
        return session.query(Period).all()