from . import db
from datetime import datetime

class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    planting_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Relação com os eventos da linha do tempo
    timeline = db.relationship('TimelineEvent', backref='plant', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Plant {self.name}>'

class TimelineEvent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phase = db.Column(db.String(100), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    # Chave estrangeira para ligar ao Plant
    plant_id = db.Column(db.Integer, db.ForeignKey('plant.id'), nullable=False)
    
    # Armazenar latitude e longitude como números
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

    def __repr__(self):
        return f'<TimelineEvent {self.phase} for Plant {self.plant_id}>'
