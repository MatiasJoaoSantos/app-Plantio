from flask import Blueprint, request, jsonify
from . import db
from .models import Plant, TimelineEvent
from .schemas import plant_schema, plants_schema, timeline_event_schema, timeline_events_schema
from datetime import datetime

# Cria um "Blueprint" para organizar as nossas rotas
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/plants', methods=['GET'])
def get_all_plants():
    """Retorna todas as plantas."""
    plants = Plant.query.all()
    return jsonify(plants_schema.dump(plants))

@api_bp.route('/plants/<int:plant_id>', methods=['GET'])
def get_plant(plant_id):
    """Retorna uma planta específica."""
    plant = Plant.query.get_or_404(plant_id)
    return jsonify(plant_schema.dump(plant))

@api_bp.route('/plants', methods=['POST'])
def add_plant():
    """Adiciona uma nova planta e seu evento inicial de plantio."""
    data = request.get_json()
    if not data or not all(k in data for k in ('name', 'planting_date', 'location')):
        return jsonify({'message': 'Dados incompletos fornecidos.'}), 400

    try:
        planting_date_obj = datetime.fromisoformat(data['planting_date'].replace('Z', ''))
    except ValueError:
        return jsonify({'message': 'Formato de data inválido. Use o formato ISO 8601.'}), 400

    new_plant = Plant(
        name=data['name'],
        planting_date=planting_date_obj
    )
    # Adiciona a nova planta à sessão para obter um ID antes do commit
    db.session.add(new_plant)
    db.session.flush() # Garante que new_plant.id esteja disponível

    location = data.get('location', {})
    initial_event = TimelineEvent(
        phase='Plantio',
        event_date=new_plant.planting_date,
        plant_id=new_plant.id,
        latitude=location.get('latitude'),
        longitude=location.get('longitude')
    )
    db.session.add(initial_event)
    
    # Realiza o commit de ambas as operações juntas
    db.session.commit()

    return jsonify(plant_schema.dump(new_plant)), 201

@api_bp.route('/plants/<int:plant_id>', methods=['PUT'])
def update_plant(plant_id):
    """Atualiza uma planta existente."""
    plant = Plant.query.get_or_404(plant_id)
    data = request.get_json()

    if not data:
        return jsonify({'message': 'Nenhum dado fornecido para atualização.'}), 400

    if 'name' in data:
        plant.name = data['name']
    
    if 'planting_date' in data:
        try:
            plant.planting_date = datetime.fromisoformat(data['planting_date'].replace('Z', ''))
        except ValueError:
            return jsonify({'message': 'Formato de data inválido. Use o formato ISO 8601.'}), 400

    db.session.commit()
    return jsonify(plant_schema.dump(plant))

@api_bp.route('/plants/<int:plant_id>', methods=['DELETE'])
def delete_plant(plant_id):
    """Deleta uma planta."""
    plant = Plant.query.get_or_404(plant_id)
    db.session.delete(plant)
    db.session.commit()
    return jsonify({'message': 'Planta deletada com sucesso.'})

@api_bp.route('/plants/<int:plant_id>/timeline', methods=['GET'])
def get_timeline_events(plant_id):
    """Retorna a linha do tempo de uma planta."""
    plant = Plant.query.get_or_404(plant_id)
    events = sorted(plant.timeline, key=lambda x: x.event_date)
    return jsonify(timeline_events_schema.dump(events))

@api_bp.route('/plants/<int:plant_id>/timeline', methods=['POST'])
def add_timeline_event(plant_id):
    """Adiciona um novo evento na linha do tempo de uma planta."""
    plant = Plant.query.get_or_404(plant_id)
    data = request.get_json()
    if not data or not data.get('phase'):
        return jsonify({'message': 'A fase do evento é obrigatória.'}), 400
    
    event_date_str = data.get('date')
    if event_date_str:
        try:
            event_date = datetime.fromisoformat(event_date_str.replace('Z', ''))
        except ValueError:
            return jsonify({'message': 'Formato de data inválido. Use o formato ISO 8601.'}), 400
    else:
        event_date = datetime.utcnow()

    location = data.get('location', {})
    new_event = TimelineEvent(
        phase=data['phase'],
        event_date=event_date,
        plant_id=plant.id,
        latitude=location.get('latitude'),
        longitude=location.get('longitude')
    )
    db.session.add(new_event)
    db.session.commit()
    
    return jsonify(timeline_event_schema.dump(new_event)), 201

@api_bp.route('/timeline/<int:event_id>', methods=['PUT'])
def update_timeline_event(event_id):
    """Atualiza um evento da linha do tempo."""
    event = TimelineEvent.query.get_or_404(event_id)
    data = request.get_json()

    if not data:
        return jsonify({'message': 'Nenhum dado fornecido para atualização.'}), 400
        
    if 'phase' in data:
        event.phase = data['phase']
    
    if 'date' in data:
        try:
            event.event_date = datetime.fromisoformat(data['date'].replace('Z', ''))
        except ValueError:
            return jsonify({'message': 'Formato de data inválido. Use o formato ISO 8601.'}), 400
    
    if 'location' in data:
        location = data['location']
        event.latitude = location.get('latitude', event.latitude)
        event.longitude = location.get('longitude', event.longitude)

    db.session.commit()
    return jsonify(timeline_event_schema.dump(event))

@api_bp.route('/timeline/<int:event_id>', methods=['DELETE'])
def delete_timeline_event(event_id):
    """Deleta um evento da linha do tempo."""
    event = TimelineEvent.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({'message': 'Evento da linha do tempo deletado com sucesso.'})

