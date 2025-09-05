from app import create_app
from app import db


if __name__ == '__main__':
    app = create_app()
    app.run(host = '0.0.0.0', port = 5000, debug=True)
    db.create_all()
