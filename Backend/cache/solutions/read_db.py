import psycopg2
import json

DB_HOST = "localhost"
DB_PORT = 5432
DB_NAME = "ai_interview_platform"
DB_USER = "postgres"
DB_PASS = "sujith3005"

def main():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS
        )
        cur = conn.cursor()
        
        print("--- Tables ---")
        cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        print([r[0] for r in cur.fetchall()])
        
        print("\n--- Sample Questions ---")
        cur.execute("SELECT id, title, slug, difficulty FROM questions LIMIT 5")
        for r in cur.fetchall():
            print(r)
            
        print("\n--- Sample Language Templates ---")
        cur.execute("SELECT id, question_id, language, starter_code, driver_code FROM language_templates LIMIT 2")
        for r in cur.fetchall():
            print("Question ID:", r[1], "Lang:", r[2])
            print("Starter Code:\n", r[3][:100], "...")
            print("Driver Code:\n", r[4], "...")
            print("-" * 40)
            
        cur.close()
        conn.close()
    except Exception as e:
        print("Database connection error:", e)

if __name__ == "__main__":
    main()
