import importlib
import pkgutil
from flask import Flask, jsonify, Blueprint
from backend.db import get_db_connection
from flask_cors import CORS

def register_blueprints(app, package_name, package_path):
    """Auto-register all blueprints in a package."""
    for _, module_name, _ in pkgutil.iter_modules(package_path):
        module = importlib.import_module(f"{package_name}.{module_name}")
        bp = getattr(module, "bp", None)
        if bp:
            app.register_blueprint(bp)

def create_app():
    app = Flask(__name__)
    CORS(app)
    from backend import routes
    register_blueprints(app, 'backend.routes', routes.__path__)
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
