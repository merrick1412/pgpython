from flask import Blueprint, jsonify
from backend.db import get_db_connection
from psycopg2.extras import RealDictCursor
bp = Blueprint('orchestrator_info', __name__)
@bp.route('/orchestrator-info', methods=['GET'])
def orchestrator_info():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT async.orchestrator_info() AS data;")
        return jsonify(cursor.fetchone()['data'])
    finally:
        conn.close()
