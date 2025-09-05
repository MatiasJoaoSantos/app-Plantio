import os

# Define o diretório base da pasta 'app'
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """Configurações da aplicação Flask."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'uma-chave-secreta-muito-segura'
    
    # Aponta a base de dados para um ficheiro `dev.db` dentro da pasta `instance`
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, '..', 'instance', 'dev.db')
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False