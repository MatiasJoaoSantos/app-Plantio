from . import ma
from .models import Plant, TimelineEvent

class TimelineEventSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TimelineEvent
        load_instance = True
        include_fk = True

class PlantSchema(ma.SQLAlchemyAutoSchema):
    timeline = ma.Nested(TimelineEventSchema, many=True, dump_only=True)
    class Meta:
        model = Plant
        load_instance = True

plant_schema = PlantSchema()
plants_schema = PlantSchema(many=True)
timeline_event_schema = TimelineEventSchema()
timeline_events_schema = TimelineEventSchema(many=True)