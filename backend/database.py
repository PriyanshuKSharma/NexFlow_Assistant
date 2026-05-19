import sqlite3
from datetime import datetime
import os
from pathlib import Path

DB_PATH = Path(os.getenv("DATABASE_PATH", Path(__file__).resolve().parent.parent / "nexflow_data.db"))


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'user',
                created_at TEXT NOT NULL
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS leads (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                interest TEXT,
                status TEXT DEFAULT 'New',
                created_at TEXT NOT NULL
            )
            """
        )


def create_user(name, email, password_hash):
    created_at = datetime.now().isoformat()
    with get_connection() as conn:
        users_count = conn.execute("SELECT COUNT(*) AS total FROM users").fetchone()["total"]
        role = "admin" if users_count == 0 else "user"
        cursor = conn.execute(
            """
            INSERT INTO users (name, email, password_hash, role, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, email.lower(), password_hash, role, created_at),
        )
        return get_user_by_id(cursor.lastrowid)


def get_user_by_email(email):
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email.lower(),)).fetchone()
        return dict(row) if row else None


def get_user_by_id(user_id):
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        return dict(row) if row else None


def insert_lead(name, email, phone, interest):
    created_at = datetime.now().isoformat()
    with get_connection() as conn:
        cursor = conn.execute(
            """
            INSERT INTO leads (name, email, phone, interest, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, email, phone, interest, created_at),
        )
        return get_lead_by_id(cursor.lastrowid)


def get_lead_by_id(lead_id):
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
        return dict(row) if row else None


def get_all_leads():
    with get_connection() as conn:
        rows = conn.execute("SELECT * FROM leads ORDER BY created_at DESC").fetchall()
        return [dict(row) for row in rows]
