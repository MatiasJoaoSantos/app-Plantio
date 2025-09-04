from flask import jsonify, request
from .models import Plant
from .database import session
from .models import Event
from . import app
from app import db

@app.route('/plants', methods=['GET'])
def get_plants():
    plants = session.query(Plant).all()
    return jsonify([plant.to_dict() for plant in plants])

@app.route('/plants', methods=['POST'])
def create_plant():
    plant = Plant(name=request.json['name'], description=request.json['description'])
    session.add(plant)
    session.commit()
    return jsonify(plant.to_dict())

@app.route("/events", methods=["POST"])
def register_event():
    data = request.get_json()
    event = Event(plant_id=data["plant_id"], previous_state=data["previous_state"], current_state=data["current_state"], datetime=data["datetime"])
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Event registered successfully!"})

@app.route("/plants/<int:plant_id>", methods=["GET"])
def get_plant(plant_id):
    plant = Plant.query.get(plant_id)
    events = Event.query.filter_by(plant_id=plant_id).all()
    return jsonify({"plant": plant.to_dict(), "events": [event.to_dict() for event in events]})
    
    
@app.route('/plants/<int:plant_id>', methods=['PUT'])
def update_plant(plant_id):
    plant = session.query(Plant).get(plant_id)
    plant.name = request.json['name']
    plant.description = request.json['description']
    session.commit()
    return jsonify(plant.to_dict())

@app.route('/plants/<int:plant_id>', methods=['DELETE'])
def delete_plant(plant_id):
    plant = session.query(Plant).get(plant_id)
    session.delete(plant)
    session.commit()
    return jsonify({'message': 'Plant deleted'})