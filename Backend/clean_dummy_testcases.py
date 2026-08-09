import os
import sys

try:
    import psycopg2
except ImportError:
    print("psycopg2 is not installed. Run: pip install psycopg2-binary")
    sys.exit(1)

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", "5432"))
DB_NAME = os.getenv("DB_NAME", os.getenv("DB_DATABASE", "ai_interview_platform"))
DB_USER = os.getenv("DB_USER", os.getenv("DB_USERNAME", "postgres"))
DB_PASS = os.getenv("DB_PASS", os.getenv("DB_PASSWORD", "sujith3005"))

def clean_database():
    print(f"Connecting to database {DB_NAME} at {DB_HOST}:{DB_PORT} as {DB_USER}...")
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()
        
        query = """
            DELETE FROM test_cases 
            WHERE input LIKE 'Hidden input variation%' 
               OR expected_output LIKE 'Expected output variation%';
        """
        cur.execute(query)
        deleted_count = cur.rowcount
        conn.commit()
        
        print(f"Successfully deleted {deleted_count} dummy hidden test case rows from test_cases table.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error during database cleanup: {e}")

if __name__ == "__main__":
    clean_database()
