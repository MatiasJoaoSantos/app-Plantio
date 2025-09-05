import os
from sqlalchemy import create_engine
from geoalchemy2 import WKTElement


basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')

class Config(object):
    """Classe de configura o do aplicativo"""

    SECRET_KEY = os.environ.get('SECRET_KEY') or 'secret-key-here'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Adicione essa linha para especificar o tipo de dado geométrico
    SQLALCHEMY_NATIVE_TYPES = ['geometry']

    # Adicione essas linhas para configurar o CORS
    CORS_HEADERS = 'Content-Type'
    CORS_RESOURCES = {r"/api/*": {"origins": "*"}}
    CORS_SUPPORTS_CREDENTIALS = True
    CORS_EXPOSE_HEADERS = ['Content-Type', 'Authorization']

