import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Mock database interactions if no local postgres is running
class MockPool {
  async connect() {
    return {
      query: async () => ({ rows: [] }),
      release: () => { }
    };
  }

  async query(text: string, params?: any[]) {
    console.log("Mock SQL Execution:", text);
    // Fake returning rows for RETURNING * clauses
    if (text.includes("INSERT INTO symptom_assessments")) {
      return { rows: [{ id: 'mock-uuid', risk_score: params![3] }] };
    }
    if (text.includes("INSERT INTO chat_messages")) {
      return { rows: [{ id: 'mock-uuid', content: params![1] }] };
    }
    return { rows: [] };
  }
}

export const pool = process.env.DATABASE_URL ? new Pool({
  connectionString: process.env.DATABASE_URL
}) : new MockPool() as unknown as Pool;

export const initDb = async () => {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL provided. Running with Mock In-Memory Database for local testing.");
    return;
  }

  const client = await pool.connect();
  try {
    console.log("Postgres connected.");
  } catch (err) {
    console.error('Database initialization error', err);
  } finally {
    client.release();
  }
};

initDb();
