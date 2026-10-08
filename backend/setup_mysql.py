#!/usr/bin/env python
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import pymysql

# Load .env
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR.parent / ".env.local")

db_name = os.getenv("DB_NAME", "pitchcoach_db")
db_user = os.getenv("DB_USER", "root")
db_pass = os.getenv("DB_PASSWORD", "")
db_host = os.getenv("DB_HOST", "127.0.0.1")
db_port = int(os.getenv("DB_PORT", "3306"))

print(f"Connecting to MySQL at {db_host}:{db_port} as user '{db_user}'...")

try:
    conn = pymysql.connect(
        host=db_host,
        port=db_port,
        user=db_user,
        password=db_pass,
        charset="utf8mb4"
    )
    with conn.cursor() as cursor:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
        print(f"✓ MySQL Database `{db_name}` is ready!")
    conn.close()
    print("✓ Setup complete. You can now run: python manage.py migrate")
except Exception as e:
    print(f"✗ Failed to connect to MySQL: {e}")
    print("\nIf access is denied, please provide your MySQL root password in backend/.env under DB_PASSWORD.")
    sys.exit(1)
