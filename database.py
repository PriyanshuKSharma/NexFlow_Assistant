import sqlite3
from datetime import datetime
import pandas as pd

DB_NAME = "nexflow_data.db"

def init_db():
    """Initializes the database and creates the necessary tables."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            interest TEXT,
            status TEXT DEFAULT 'New',
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def insert_lead(name, email, phone, interest):
    """Inserts a new lead into the database."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()
    cursor.execute('''
        INSERT INTO leads (name, email, phone, interest, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (name, email, phone, interest, created_at))
    conn.commit()
    conn.close()
    return True

def get_all_leads():
    """Retrieves all leads from the database as a pandas DataFrame."""
    conn = sqlite3.connect(DB_NAME)
    query = "SELECT * FROM leads ORDER BY created_at DESC"
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df
