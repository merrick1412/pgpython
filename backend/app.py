from flask import Flask, jsonify
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/button-clicked", methods=["POST"])
def button_clicked():
    conn = psycopg2.connect(
        dbname="hello_world",
        user="student",
        password="rpstudent",
        host="localhost"
    )
    cur = conn.cursor()
    cur.execute("SELECT * FROM ")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    print("button clicked!")
    return jsonify(rows)