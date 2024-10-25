from ..utils.utils import generate_slug
from  sqlalchemy  import  Column, String
from .model  import  Model

class Feature(Model):
    __tablename__ = 'feature'
    id = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    def  __init__(self, id, name, description):
        Model.__init__(self)
        self.id = id
        self.name = name
        self.description = description