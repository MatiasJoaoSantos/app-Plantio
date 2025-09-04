from flask import Blueprint, request, jsonify
from . import db
from .models import Plant, TimelineEvent
from .schemas import plant_schema
from datetime import datetime

# Cria um "Blueprint" para organizar as nossas rotas
api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/plants', methods=['POST'])
def add_plant():
    data = request.get_json()
    if not all(k in data for k in ('name', 'planting_date', 'location')):
        return jsonify({'message': 'Dados incompletos fornecidos.'}), 400

    try:
        planting_date_obj = datetime.fromisoformat(data['planting_date'].replace('Z', ''))
    except ValueError:
        return jsonify({'message': 'Formato de data inválido. Use o formato ISO 8601.'}), 400

    new_plant = Plant(
        name=data['name'],
        planting_date=planting_date_obj
    )
    db.session.add(new_plant)
    db.session.commit()

    location = data['location']
    initial_event = TimelineEvent(
        phase='Plantio',
        event_date=new_plant.planting_date,
        plant_id=new_plant.id,
        latitude=location.get('latitude'),
        longitude=location.get('longitude')
    )
    db.session.add(initial_event)
    db.session.commit()

    # --- A CORREÇÃO ESTÁ AQUI ---
    # Recarrega a `new_plant` da sessão da base de dados.
    # Isto garante que a relação `timeline` é carregada com o evento que acabámos de criar.
    db.session.refresh(new_plant)

    return jsonify(plant_schema.dump(new_plant)), 201


@api_bp.route('/plants/<int:plant_id>/timeline', methods=['POST'])
def add_timeline_event(plant_id):
    # (O resto do ficheiro continua igual...)
    plant = Plant.query.get_or_404(plant_id)
    data = request.get_json()
    if not data or not data.get('phase'):
        return jsonify({'message': 'A fase do evento é obrigatória.'}), 400
    
    event_date = datetime.fromisoformat(data['date'].replace('Z', '')) if data.get('date') else datetime.utcnow()
    
    new_event = TimelineEvent(
        phase=data['phase'],
        event_date=event_date,
        plant_id=plant.id,
        latitude=data.get('location', {}).get('latitude'),
        longitude=data.get('location', {}).get('longitude')
    )
    db.session.add(new_event)
    db.session.commit()

    # Para consistência, também podemos recarregar aqui, embora não seja estritamente necessário para a lógica atual
    db.session.refresh(new_event)
    
    # Usamos o schema do evento aqui
    from .schemas import timeline_event_schema
    return jsonify(timeline_event_schema.dump(new_event)), 201

