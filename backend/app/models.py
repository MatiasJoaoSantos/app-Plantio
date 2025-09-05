from . import db
from datetime import datetime

class Plant(db.Model):
    __tablename__ = 'plant'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    planting_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    timeline = db.relationship('TimelineEvent', backref='plant', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Plant {self.name}>'

class TimelineEvent(db.Model):
    __tablename__ = 'timeline_event'
    id = db.Column(db.Integer, primary_key=True)
    phase = db.Column(db.String(100), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    
    plant_id = db.Column(db.Integer, db.ForeignKey('plant.id'), nullable=False)
    
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

    def __repr__(self):
        return f'<TimelineEvent {self.phase} for Plant ID {self.plant_id}>'