from flask import Blueprint, jsonify
from backend.db import get_db_connection
bp = Blueprint('get_tasks', __name__)

@bp.route('/api/flows/<int:flow_id>/tasks', methods=['GET'])
def get_tasks(flow_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT flow.task_list(%s);", (flow_id,))
        result = cursor.fetchone()
        return jsonify(result[0])
    finally:
        conn.close()