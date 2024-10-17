from  sqlalchemy  import  Column, String, relationship
from .model  import  Model, Base

class SuscriptionPlan(Model):
    __tablename__ = 'suscription_plan'
    id = Column(String, nullable=False, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    roles = relationship('Role', secondary='subscription_plan_role', back_populates='plans')
    
    def  __init__(self, id, name, description):
        Model.__init__(self)
        self.id = id
        self.name = name
        self.description = description