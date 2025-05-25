import psycopg2

from backend.config import DB_CONFIG
def get_db_connection():
    """Establish a connection to the database."""
    return psycopg2.connect(**DB_CONFIG)