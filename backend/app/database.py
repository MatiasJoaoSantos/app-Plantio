from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .config import SQLALCHEMY_DATABASE_URI
from .models import Base

engine = create_engine(SQLALCHEMY_DATABASE_URI)
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = Session()
