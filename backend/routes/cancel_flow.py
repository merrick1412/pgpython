from flask import Blueprint, jsonify
from backend.db import get_db_connection
bp = Blueprint('cancel_flow', __name__)

@bp.route('/api/flows/<int:flow_id>/cancel', methods=['POST'])
def cancel_flow(flow_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT flow.cancel(%s);", (flow_id,))
        conn.commit()
        return jsonify({'status': 'cancelled', 'flow_id': flow_id}), 200
    finally:
        conn.close()