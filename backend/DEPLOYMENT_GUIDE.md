# 🚀 Cloud Deployment Guide: AgriSmart AI (Backend & Frontend)

This guide walks you through deploying both the **FastAPI Backend (CNN Model)** and **React Frontend Dashboard** to the cloud so they run 24/7 with public HTTPS links.

---

## 📌 Architecture Overview

```
[ User Device / Mobile / Laptop ]
                 │
                 ▼
[ Frontend: Vercel / Netlify ]  (React + Vite Dashboard)
   URL: https://agrismart-ai.vercel.app
                 │  API Requests (POST /api/predict/single, POST /api/predict/three-zone)
                 ▼
[ Backend: Render.com / Cloud Run ]  (FastAPI + TensorFlow CNN)
   URL: https://agrismart-backend.onrender.com
```

---

## Part 1: Deploy Backend to Render (Free & Recommended)

Render provides free hosting for Dockerized web services with automatic SSL and continuous deployment from GitHub.

### Step 1: Push Code to GitHub
1. Open terminal in this project root:
   ```bash
   git init
   git add .
   git commit -m "Add AgriSmart AI Backend and Frontend"
   ```
2. Create a new repository on [GitHub](https://github.com/new) (e.g., `agrismart-ai`).
3. Link and push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/agrismart-ai.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Connect your repository `agrismart-ai`.
4. Configure the settings:
   - **Name:** `agrismart-ai-backend`
   - **Region:** Singapore or Frankfurt (choose closest to India)
   - **Root Directory:** `backend`
   - **Environment:** `Docker`
   - **Instance Type:** `Free`
5. Click **Deploy Web Service**.
6. In 2–4 minutes, Render will build the Docker container and give you a public URL like:
   `https://agrismart-ai-backend.onrender.com`
7. Test it by opening:
   `https://agrismart-ai-backend.onrender.com/health` → Should show `{"status": "healthy"}`.

---

## Part 2: Deploy Frontend to Vercel (Free & Instant)

Vercel provides lightning-fast CDN deployment for React / Vite projects.

### Step 1: Connect Repository on Vercel
1. Go to [Vercel](https://vercel.com) and log in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your `agrismart-ai` repository.

### Step 2: Configure Environment Variables
1. In the Vercel project configuration screen:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (leave default)
2. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://agrismart-ai-backend.onrender.com`)
3. Click **Deploy**!
4. In under 60 seconds, your site will be live at `https://agrismart-ai.vercel.app`!

---

## Part 3: Alternative Backend: Google Cloud Run

If you prefer Google Cloud (the project already has `cloudbuild.yaml`):

```bash
# 1. Login to Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Deploy directly from the backend folder
cd backend
gcloud run deploy agrismart-backend \
    --source . \
    --region asia-south1 \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2 \
    --port 8000
```
When finished, Google Cloud prints your HTTPS URL:
`https://agrismart-backend-xxxxx-el.a.run.app`.

---

## Part 4: Testing Locally Before Deploying

### Run Backend Locally:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
# Backend runs at http://localhost:8000
# Interactive Swagger docs: http://localhost:8000/docs
```

### Run Frontend Locally:
```bash
# In the main project directory:
npm install
npm run dev
# Frontend runs at http://localhost:5173
```
