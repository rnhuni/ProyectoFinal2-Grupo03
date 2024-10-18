from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from .model import Model, Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class User(Model):
    __tablename__ = 'user'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    cognito_id = Column(String, nullable=False, unique=True)
    
    role_id = Column(String, ForeignKey('role.id'))
    role = relationship('Role', backref='users')

    client_id = Column(UUID, ForeignKey('client.id'))
    client = relationship('Client', backref='users')

    def __init__(self, name, email, cognito_id, role_id, client_id):
        Model.__init__(self)
        self.name = name
        self.email = email
        self.cognito_id = cognito_id
        self.role_id = role_id
        self.client_id = client_id
