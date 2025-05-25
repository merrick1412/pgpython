from flask import Blueprint, jsonify
from backend.db import get_db_connection
bp = Blueprint('get_graphviz', __name__)

@bp.route('/api/flows/<int:flow_id>/graph', methods=['GET'])
def get_graphviz(flow_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT flow.graphviz(%s);", (flow_id,))
        result = cursor.fetchone()
        return result[0], 200, {'Content-Type': 'text/plain'}
    finally:
        conn.close()