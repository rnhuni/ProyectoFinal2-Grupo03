from ServicioCanal.utils.utils import build_channel_id
from ..models.model import session
from ..models.channel import Channel
from .base_command import BaseCommannd

class CreateChannel(BaseCommannd):
    def __init__(self, name, description, type, platforms):
        self.description = description
        self.name = name
        self.type = type
        self.platforms = platforms
    
    def execute(self):
        if not self.description or not self.name or not self.type or self.platforms is None:
            raise ValueError("Invalid data provided")
        
        try:
            channel_id = build_channel_id(self.name)
            data = Channel(id=channel_id, name=self.name,description=self.description, platforms=self.platforms, type=self.type)
            
            session.add(data)
            session.commit()

            return data
        except Exception as e:
            session.rollback()
            raise e