""" For testing purposes only."""
from flask import Blueprint, jsonify
from backend.db import get_db_connection
from psycopg2.extras import RealDictCursor
# Create a Blueprint for the helloworld route
bp = Blueprint('helloworld', __name__)
# Register the Blueprint with the Flask app

@bp.route('/helloworld', methods=['GET'])
def get_helloworld():   
    """Retrieve the 'helloworld' value from the database."""
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT value FROM test_table WHERE key = 'helloworld';")
        result = cursor.fetchone()
        if result:
            return jsonify({'helloworld': result['value']})
        else:
            return jsonify({'error': 'Value not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        conn.close()