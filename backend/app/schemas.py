from . import ma
from .models import Plant, TimelineEvent

class TimelineEventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TimelineEvent
        load_instance = True
        include_fk = True

class PlantSchema(ma.SQLAlchemyAutoSchema):
    # Aninha os eventos da timeline dentro do JSON da planta
    timeline = ma.Nested(TimelineEventSchema, many=True)
    
    class Meta:
        model = Plant
        load_instance = True

# Instâncias para usar nas rotas
plant_schema = PlantSchema()
plants_schema = PlantSchema(many=True)
timeline_event_schema = TimelineEventSchema()
