from  sqlalchemy  import  Column, String
from sqlalchemy.orm import relationship
from .model  import  Model, Base

class Role(Model):
    __tablename__ = 'role'
    id = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=False)

    def  __init__(self, id, name):
        Model.__init__(self)
        self.id = id
        self.name = name