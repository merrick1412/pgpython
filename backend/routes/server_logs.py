from flask import Blueprint, jsonify
from backend.db import get_db_connection
from psycopg2.extras import RealDictCursor
bp = Blueprint('server_logs', __name__)
@bp.route('/server-logs', methods=['GET'])
def server_logs():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT happened, message FROM async.server_logs(1000);")
        rows = cursor.fetchall()
        formatted = [f"[{r['happened']}] {r['message']}" for r in reversed(rows)]
        return jsonify(formatted)
    finally:
        conn.close()