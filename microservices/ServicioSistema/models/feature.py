from ..utils.utils import generate_slug
from  sqlalchemy  import  Column, String, DECIMAL
from .model  import  Model

class Feature(Model):
    __tablename__ = 'feature'
    id = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    price = Column(DECIMAL(precision=10, scale=2), nullable=False, default=1.0)
    
    def  __init__(self, id, name, description, price):
        Model.__init__(self)
        self.id = id
        self.name = name
        self.description = description
        self.price = price