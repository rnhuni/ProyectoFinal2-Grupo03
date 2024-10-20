from datetime import datetime
import os
from sqlalchemy import create_engine, Column, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
import logging

from . import CONNECTION_STRING

Base = declarative_base()

class Model(Base):
    __abstract__ = True
    #id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)
    def __init__(self):
        self.createdAt = datetime.now()
        self.updatedAt = datetime.now()
 
engine = None
if os.getenv('ENV') != 'test':
    engine = create_engine(CONNECTION_STRING, echo=True)

def initdb():    
    Base.metadata.create_all(engine)
    logging.getLogger('sqlalchemy.engine').setLevel(logging.ERROR)
    
Session = sessionmaker(bind=engine)
session = Session()