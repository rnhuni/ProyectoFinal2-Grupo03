from  sqlalchemy  import  Column, String, ForeignKey
from .model  import  Model, Base

class SuscriptionPlan(Model):
    __tablename__ = 'suscription_plan_role'
    plan_id = Column('plan_id', String, ForeignKey('suscription_plan.id'), primary_key=True),
    role_id = Column('role_id', String, ForeignKey('role.id'), primary_key=True)
    
    def  __init__(self, plan_id, role_id):
        Model.__init__(self)
        self.plan_id = plan_id
        self.role_id = role_id