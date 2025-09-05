from app import create_app
from app import db


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
    db.create_all()
