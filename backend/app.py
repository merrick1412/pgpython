from flask import Flask, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

DB_CONFIG = {
    'dbname': 'hello_world', 
    'user': 'student',
    'password': 'rpstudent',
    'host': '34.125.49.223',  # or your database server's IP
    'port': 5432          # default PostgreSQL port
}

def get_db_connection():
    """Establish a connection to the database."""
    return psycopg2.connect(**DB_CONFIG)

@app.route('/helloworld', methods=['GET'])
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

@app.route('/api/flows', methods=['GET'])
def get_flows():
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT flow.flows(50);")  # call stored function, displays 50
        result = cursor.fetchone()
        return jsonify(result[0])  # unwrap JSONB result
    finally:
        conn.close()

@app.route('/api/flows/<int:flow_id>/tasks', methods=['GET'])
def get_tasks(flow_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT flow.task_list(%s);", (flow_id,))
        result = cursor.fetchone()
        return jsonify(result[0])
    finally:
        conn.close()

@app.route('/api/flows/<int:flow_id>/graph', methods=['GET'])
def get_graphviz(flow_id):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT flow.graphviz(%s);", (flow_id,))
        result = cursor.fetchone()
        return result[0], 200, {'Content-Type': 'text/plain'}
    finally:
        conn.close()


if __name__ == '__main__':
    app.run(debug=True)
