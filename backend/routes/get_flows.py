from flask import Blueprint, jsonify
from backend.db import get_db_connection
bp = Blueprint('get_flows', __name__)

@bp.route('/api/flows', methods=['GET'])
def get_flows():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT flow.flows(50);")  # call stored function, displays 50
        result = cursor.fetchone()
        return jsonify(result[0])  # unwrap JSONB result
    finally:
        conn.close()