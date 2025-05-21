from flask import Blueprint, jsonify
from backend.db import get_db_connection
bp = Blueprint('get_running_flows', __name__)

@bp.route('/api/flows/running', methods=['GET'])
def get_running_flows():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM flow.v_flow_status
            WHERE complete = 'No'
            ORDER BY flow_id DESC
        """)
        columns = [desc[0] for desc in cursor.description]
        results = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return jsonify(results)
    finally:
        conn.close()