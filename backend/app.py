from flask import Flask, jsonify, Blueprint
from backend.db import get_db_connection
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint('helloworld_bp', __name__)
    app.register_blueprint(Blueprint('getflows', __name__))
    app.register_blueprint(Blueprint('gettasks', __name__))  
    return app

if __name__ == '__main__':
    app.run(debug=True)
