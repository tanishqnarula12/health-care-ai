import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export const initDb = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS Symptoms (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(id),
        symptoms TEXT[],
        ai_questions JSONB,
        predicted_conditions JSONB,
        risk_score INT,
        severity VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS HealthLogs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(id),
        symptoms TEXT[],
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ChatHistory (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(id),
        message TEXT,
        response TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS Predictions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(id),
        disease VARCHAR(100),
        probability FLOAT,
        severity VARCHAR(50)
      );
    `);
        console.log('Database tables initialized');
    } catch (err) {
        console.error('Database initialization error', err);
    } finally {
        client.release();
    }
};

initDb();
