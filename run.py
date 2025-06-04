import os
import subprocess
import threading
import time
from backend.app import create_app
from backend.config import DB_CONFIG

app = create_app()

# --- Manually drop SQL functions ---
def drop_pg_functions():
    config = DB_CONFIG
    drop_statements = [
        "DROP FUNCTION IF EXISTS async.orchestrator_info() CASCADE;",
        "DROP FUNCTION IF EXISTS async.concurrency_pool_info() CASCADE;",
        "DROP FUNCTION IF EXISTS async.worker_info() CASCADE;",
        "DROP FUNCTION IF EXISTS async.server_logs(integer) CASCADE;"  # This is the right signature
    ]

    for stmt in drop_statements:
        print("> Running:", stmt)
        subprocess.run([
            "psql",
            "-U", config['user'],
            "-d", config['dbname'],
            "-h", config['host'],
            "-p", str(config['port']),
            "-c", stmt
        ], check=True)

# --- Reload SQL ---
def load_sql_files():
    config = DB_CONFIG
    sql_dir = "backend/sql"
    sql_files = [f for f in os.listdir(sql_dir) if f.endswith(".sql")]
    sql_files.sort()

    for file in sql_files:
        path = os.path.join(sql_dir, file)
        print(f"> Loading {path}...")
        subprocess.run([
            "psql",
            "-U", config['user'],
            "-d", config['dbname'],
            "-h", config['host'],
            "-p", str(config['port']),
            "-f", path
        ], check=True)

# --- Run frontend ---
def run_vite():
    subprocess.run(["npm", "run", "dev"], cwd="frontend")

# --- Run backend ---
def run_flask():
    app.run(debug=True, use_reloader=False)

if __name__ == "__main__":
    try:
        drop_pg_functions()
        load_sql_files()
    except Exception as e:
        print("SQL Load Error:", e)

    vite_thread = threading.Thread(target=run_vite)
    vite_thread.start()

    time.sleep(5)
    run_flask()
