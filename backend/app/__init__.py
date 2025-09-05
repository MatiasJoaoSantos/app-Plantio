from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_cors import CORS
from .config import Config

# Inicializamos as extensões aqui para que possam ser importadas noutros ficheiros
db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
cors = CORS()

def create_app(config_class=Config):
    """Fábrica para criar e configurar a instância da aplicação Flask."""
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Associa as extensões à nossa instância da aplicação
    db.init_app(app)
    ma.init_app(app)
    migrate.init_app(app, db)
    
    # Esta linha configura o CORS corretamente para si.
    # Permite requisições de qualquer origem para qualquer rota que comece com /api/
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    with app.app_context():
        # Importa e regista as nossas rotas na aplicação
        from . import routes
        app.register_blueprint(routes.api_bp)

        return app

