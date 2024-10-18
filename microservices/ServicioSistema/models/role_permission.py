from  sqlalchemy  import  Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .model  import  Model

class RolePermission(Model):
    __tablename__ = 'role_permission'
    role_id = Column('role_id', String, ForeignKey('role.id'), primary_key=True)
    permission_id = Column('permission_id', String, ForeignKey('permission.id'), primary_key=True)
    scope = Column(String, primary_key=True)

    permission = relationship("Permission", backref="role_permissions")
    
    def  __init__(self, role_id, permission_id, scope):
        Model.__init__(self)
        self.role_id = role_id
        self.permission_id = permission_id
        self.scope = scope