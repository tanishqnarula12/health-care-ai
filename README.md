# Lumina Health AI MVP

A FULLY FUNCTIONAL, DEPLOYMENT-READY AI HEALTHCARE WEB APPLICATION. This repository contains a production-ready SaaS MVP for an AI-powered health assistant focused on early diagnosis, symptom checking, and rural accessibility.

## Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, TypeScript
- **AI Service**: Python, FastAPI
- **Database**: PostgreSQL
- **Containerization**: Docker

## Architecture
- **Frontend** connects to the **Backend** REST API.
- **Backend** processes requests, connects to **PostgreSQL** for user data, and proxies complex AI inferences to the **AI Service**.
- **AI Service** handles natural language processing, symptom-to-disease mappings, and text-to-speech tasks via generative models.

## Folder Structure
- `/frontend/` - Next.js App
- `/backend/` - Node.js Express API
- `/ai-service/` - Python FastAPI Microservice
- `/database/` - PostgreSQL Schema Info
- `/docker/` - Deployment configurations
- `/docs/` - Additional documentation

## Features
- AI Chatbot for Medical Guidance
- Symptom Analysis & Early Prediction Engine
- Health Logs and Reports Repository
- Rural Accessibility (Voice Modes)
- JWT Authentication

## Running Locally

### Prerequisites
- Docker & Docker Compose
- Node.js & npm

### Starting using Docker
You can start the Backend, AI Service, and Database with one command:
```bash
docker-compose up --build
```
This will launch:
- Postgres Database on port 5432
- Node Backend on localhost:5000
- Python FastAPI on localhost:8000

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:3000`.

## Deployment Setup
### Vercel (Frontend)
The `/frontend` folder is a standard Next.js application, readily deployable to Vercel via the Vercel GitHub integration or `vercel config build`.

### Render / Railway (Backend & AI Service)
Connect Render/Railway to your Git provider:
1. Create a "Web Service" pointing to `/backend` for Node API.
2. Create a "Web Service" pointing to `/ai-service` for Python API.
3. Supply `.env` secrets correctly.

### Database
Provision a managed PostgreSQL via Railway, Render, Supabase, or AWS RDS. Add the `DATABASE_URL` string to your Backend web service environment variables.

## Environment Variables
Ensure `.env` files are updated with appropriate secrets before running the application. See template inside each service for defaults.
