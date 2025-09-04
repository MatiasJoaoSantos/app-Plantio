from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from geoalchemy2 import Geometry
from app import db

Base = declarative_base()

class Plant(Base):
    __tablename__ = 'plants'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    location = Column(Geometry('POINT', 4326))

class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    planta_id = db.Column(db.Integer, db.ForeignKey("planta.id"), nullable=False)
    estado_anterior = db.Column(db.String(100), nullable=False)
    estado_atual = db.Column(db.String(100), nullable=False)
    data_hora = db.Column(db.DateTime, nullable=False)