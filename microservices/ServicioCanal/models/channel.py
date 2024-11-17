from  sqlalchemy  import  Column, String
from .model  import  Model

class Channel(Model):
    __tablename__ = 'channel'
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    type = Column(String, nullable=False)
    platforms = Column(String, nullable=False)
    
    def  __init__(self, id, name, description, type, platforms):
        Model.__init__(self)
        self.id = id
        self.name = name
        self.description = description
        self.type = type
        self.platforms = platforms