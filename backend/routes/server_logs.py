from flask import Blueprint, jsonify
from backend.db import get_db_connection
from psycopg2.extras import RealDictCursor
bp = Blueprint('server_logs', __name__)
@bp.route('/server-logs', methods=['GET'])
def server_logs():
    conn = get_db_connection()
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM async.server_logs(1000);")
        logs = cursor.fetchall()
        formatted = [
    {
        "happened": row["happened"],
        "level": row["level"],
        "message": row["message"]
    }
    for row in reversed(logs)
]
        return jsonify(formatted)
    finally:
        conn.close()