from datetime import datetime
import os
from sqlalchemy import create_engine, Column, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, scoped_session
import logging

from . import CONNECTION_STRING

Base = declarative_base()

class Model(Base):
    __abstract__ = True
    createdAt = Column(DateTime)
    updatedAt = Column(DateTime)
    def __init__(self):
        self.createdAt = datetime.now()
        self.updatedAt = datetime.now()
 
engine = None
if os.getenv('ENV') != 'test':
    engine = create_engine(CONNECTION_STRING, echo=False)

def initdb():    
    Base.metadata.create_all(engine)
    
session = scoped_session(sessionmaker(bind=engine))