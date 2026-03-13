-- Lumina Health Care AI
-- Initial PostgreSQL Database Schema
-- Ready for local PostgreSQL or Supabase deployment

-- 1. EXTENSIONS
-- Required for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE log_category AS ENUM ('Vitals', 'Symptoms');
CREATE TYPE report_category AS ENUM ('Bloodwork', 'Imaging', 'Prescriptions', 'Other');
CREATE TYPE report_source AS ENUM ('File Upload', 'EMR Integration');
CREATE TYPE chat_role AS ENUM ('user', 'assistant');

-- 3. TABLES

-- Users Table
-- Note: If using Supabase Auth later, you might link this directly to auth.users
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Global Health Vitals State (The most recent metrics for the dashboard)
CREATE TABLE IF NOT EXISTS user_vitals_state (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    blood_oxygen INTEGER,
    resting_heart_rate INTEGER,
    sleep_hours INTEGER,
    sleep_minutes INTEGER,
    activity_score INTEGER,
    blood_pressure_sys INTEGER,
    blood_pressure_dia INTEGER,
    health_risk_score INTEGER,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Health Logs / Timeline Entries
CREATE TABLE IF NOT EXISTS health_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type log_category NOT NULL,
    description TEXT,
    -- Captured vitals snapshot during a log event
    blood_pressure_sys INTEGER,
    blood_pressure_dia INTEGER,
    resting_heart_rate INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Medical Reports / Document Uploads & EMR
CREATE TABLE IF NOT EXISTS medical_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category report_category NOT NULL,
    source report_source NOT NULL,
    summary TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI Chat History
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role chat_role NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- AI Symptom Checker Assessments
CREATE TABLE IF NOT EXISTS symptom_assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    symptoms_description TEXT NOT NULL,
    ai_analysis_notes TEXT,
    risk_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TRIGGERS & FUNCTIONS
-- Function to automatically update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to users table
CREATE TRIGGER update_user_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();

-- Apply trigger to user_vitals_state table
CREATE TRIGGER update_user_vitals_state_modtime
    BEFORE UPDATE ON user_vitals_state
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
