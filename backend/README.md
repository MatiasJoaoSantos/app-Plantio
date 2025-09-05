Backend - App Plantio (API com Flask)

Este diretório contém o código-fonte da API RESTful desenvolvida para o projeto de Rastreabilidade de Plantio. A API foi construída com o micro-framework Flask em Python e é responsável por todas as operações de criação, leitura, atualização e exclusão (CRUD) dos dados das plantas e suas linhas do tempo.
Funcionalidades e Endpoints

A API expõe os seguintes endpoints sob o prefixo /api:

    GET /plants: Retorna uma lista de todas as plantas registradas.

    POST /plants: Cria uma nova planta e seu evento inicial de "Plantio".

    GET /plants/<id>: Retorna os detalhes de uma planta específica, incluindo sua linha do tempo completa.

    PUT /plants/<id>: Atualiza os dados de uma planta.

    DELETE /plants/<id>: Remove uma planta e todos os seus eventos associados.

    POST /plants/<id>/timeline: Adiciona um novo evento (fase) à linha do tempo de uma planta existente.

    GET /plants/<id>/timeline: Retorna todos os eventos da linha do tempo de uma planta.

    PUT /timeline/<event_id>: Atualiza um evento específico da linha do tempo.

    DELETE /timeline/<event_id>: Remove um evento específico da linha do tempo.

Tecnologias e Bibliotecas

    Flask: Micro-framework web para Python, escolhido por sua simplicidade e flexibilidade.

    Flask-SQLAlchemy: Extensão que adiciona suporte ao SQLAlchemy, um poderoso ORM (Object-Relational Mapper) para interagir com o banco de dados.

    Flask-Marshmallow: Extensão para serialização/desserialização de objetos, facilitando a conversão de modelos SQLAlchemy para JSON e vice-versa.

    Flask-Migrate: Extensão para lidar com migrações de banco de dados usando Alembic.

    Flask-CORS: Extensão para gerenciar o Cross-Origin Resource Sharing (CORS), essencial para permitir a comunicação entre o app React Native e a API.

    SQLite: Banco de dados utilizado para o ambiente de desenvolvimento local pela sua simplicidade e por não requerer um servidor separado.

Instalação e Execução
Pré-requisitos

    Python 3.8+

    pip e venv (geralmente incluídos com a instalação do Python)

Passos para Instalação

    Clone o repositório (caso ainda não tenha feito):

    git clone <url-do-repositorio>
    cd app-plantio/backend

    Crie e ative um ambiente virtual:

    # Para Unix (Linux/macOS)
    python3 -m venv venv
    source venv/bin/activate

    # Para Windows
    python -m venv venv
    .\venv\Scripts\activate

    Instale as dependências:

    pip install -r requirements.txt

    Aplique as migrações do banco de dados:
    Isto criará o arquivo de banco de dados (dev.db) e as tabelas necessárias.

    # (Com o ambiente virtual ativado)
    flask db upgrade

Executando o Servidor

Com o ambiente virtual ativado e as dependências instaladas, inicie o servidor de desenvolvimento do Flask:

python run.py

O servidor estará disponível em http://0.0.0.0:5000. A API pode ser acessada pelo frontend no endereço http://<seu-ip-local>:5000/api.
Estrutura do Projeto

backend/
|-- app/                  # Contém a lógica principal da aplicação
|   |-- __init__.py       # Fábrica da aplicação (cria a instância do Flask)
|   |-- models.py         # Modelos de dados do SQLAlchemy (tabelas Plant e TimelineEvent)
|   |-- routes.py         # Definição dos endpoints da API
|   |-- schemas.py        # Esquemas de serialização do Marshmallow
|   `-- config.py         # Configurações da aplicação
|
|-- migrations/           # Arquivos de migração gerados pelo Flask-Migrate
|-- instance/             # Contém arquivos de instância, como o banco de dados
|   `-- dev.db            # Arquivo do banco de dados SQLite
|
|-- requirements.txt      # Lista de dependências Python
|-- run.py                # Ponto de entrada para iniciar o servidor
`-- venv/                 # (Opcional) Diretório do ambiente virtual

Decisões de Projeto

    Flask em vez de Node.js: Embora o desafio sugerisse Node.js, optei pelo Flask por ter mais familiaridade e agilidade com o ecossistema Python. A estrutura de fábrica (create_app) e o uso de Blueprints tornam o projeto organizado e escalável.

    SQLite em vez de PostGIS/PostgreSQL: Para o escopo de um protótipo e para simplificar a configuração do ambiente de desenvolvimento local, utilizei o SQLite. Ele não requer a instalação de um serviço de banco de dados separado.

        Observação sobre Geolocalização: O desafio pedia o uso de tipos de dados espaciais (GEOMETRY/GEOGRAPHY) do PostGIS. Como o SQLite não possui suporte nativo robusto para isso, as coordenadas de latitude e longitude foram armazenadas como campos Float. Esta foi uma decisão pragmática para cumprir o prazo e a funcionalidade principal, mas representa a principal divergência técnica em relação aos requisitos. A migração para PostGIS seria um passo crucial para levar o projeto para produção.

Limitações e Melhorias Futuras

    Banco de Dados: A principal melhoria seria migrar do SQLite para o PostgreSQL com a extensão PostGIS, conforme solicitado no desafio. Isso permitiria o uso de tipos de dados espaciais e a realização de consultas geoespaciais complexas (ex: "encontrar todas as plantas em um raio de 5km"). A biblioteca GeoAlchemy2 poderia ser usada para facilitar essa integração.

    Autenticação: A API atualmente é pública. Em um cenário real, seria necessário implementar um sistema de autenticação e autorização (ex: JWT) para proteger os endpoints e associar plantas a usuários específicos.

    Validação: A validação dos dados de entrada poderia ser mais robusta, utilizando as funcionalidades do Marshmallow para garantir que todos os campos atendam aos formatos e tipos esperados.

    Testes: Adicionar testes unitários e de integração para garantir a confiabilidade e a estabilidade da API.