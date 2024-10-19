from ..utils.utils import generate_slug
from  sqlalchemy  import  Column, String
from .model  import  Model

class Permission(Model):
    __tablename__ = 'permission'
    id = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    def  __init__(self, id, name, resource, description):
        Model.__init__(self)

        self.id = id
        self.name = name
        self.resource = resource
        self.description = description