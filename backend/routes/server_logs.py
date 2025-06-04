from flask import Blueprint, jsonify
from backend.db import get_db_connection
from psycopg2.extras import RealDictCursor
bp = Blueprint('server_logs', __name__)
@bp.route('/server-logs', methods=['GET'])
def server_logs():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT async.server_logs(1000) AS data;")
        row = cursor.fetchone()
        print("Raw row from server_logs:", row)
        if row and row['data'] is not None:
            return jsonify(row['data'])
        else:
            return jsonify([])  # Return empty array instead of throwing
    finally:
        conn.close()