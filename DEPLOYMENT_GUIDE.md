# Lumina Health AI MVP - Comprehensive Deployment Guide

This guide provides step-by-step instructions to deploy the complete Lumina Health AI application to production. We will use **Vercel** for the frontend, **Render** for the backend and AI service, and **Supabase** for the database.

## Prerequisites
- GitHub account
- Vercel account (for Frontend)
- Render account (for Backend & AI Service)
- Supabase account (for Database)
- Gemini API Key

---

## Step 1: Database Deployment (Supabase)

1. Go to [Supabase](https://supabase.com/).
2. Click **New Project**, select an organization, and give your project a name and secure database password.
3. Wait for the database to provision.
4. Go to **Project Settings -> Database** to find your connection string.
5. In your Supabase SQL Editor, run the schema script located at `database_schema.sql` in the repository root to initialize your tables.
6. Copy the `Database connection string (URI)` (make sure to replace the `[YOUR-PASSWORD]` placeholder with your actual password). You will need this for the Backend.

---

## Step 2: AI Service Deployment (Render)

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New -> Web Service**.
3. Connect your GitHub repository.
4. Set up the service details:
   - **Name**: `lumina-ai-service`
   - **Root Directory**: `ai-service`
   - **Environment**: Python
   - **Build Command**: `pip install -r requirements.txt` (or appropriate if using poetry, etc)
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT` (Adjust the command if the entry point is different)
5. Expand **Advanced** and add Environment Variables:
   - `GEMINI_API_KEY`: Your Gemini API Key (e.g., `AIzaSyBr...`)
6. Click **Create Web Service**. Wait for the deployment to finish and copy the `onrender.com` URL (e.g., `https://lumina-ai-service.onrender.com`).

---

## Step 3: Backend Deployment (Render)

1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New -> Web Service**.
3. Connect the same GitHub repository.
4. Set up the service details:
   - **Name**: `lumina-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build` (if TypeScript is used)
   - **Start Command**: `npm start` or `node dist/index.js` (adjust based on your `package.json` scripts)
5. Expand **Advanced** and add Environment Variables:
   - `DATABASE_URL`: The connection string you copied from Supabase in Step 1.
   - `JWT_SECRET`: Generate a secure random string and paste it here.
   - `AI_SERVICE_URL`: The Render URL of your deployed AI Service from Step 2 (e.g., `https://lumina-ai-service.onrender.com`).
6. Click **Create Web Service**. Wait for the backend to deploy and copy its Render URL.

---

## Step 4: Frontend Deployment (Vercel)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New -> Project**.
3. Import your GitHub repository.
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: Select `frontend`
5. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: The Render URL of your deployed Backend from Step 3.
6. Click **Deploy**. Vercel will build and deploy your application.
7. Once finished, Vercel will provide your final production domain.

---

## Step 5: Final Testing

1. Open your Vercel production URL in your browser.
2. Sign up or log in to generate database entries.
3. Test the AI features (Chat or Reports) to ensure the Frontend successfully communicates with the Backend, which securely routes Prompts down to the AI Service.

Congratulations! Your complete Lumina Health AI application is live!
