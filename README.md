# IPL Data Platform (2022 Season)

A professional full-stack platform for analyzing and visualizing IPL 2022 dataset insights, built as part of the Internship Assignment.

## 🚀 Deployed URLs
> [!IMPORTANT]
> The URLs below are **placeholders**. You must follow the [Deployment Guide](#☁️-deployment-guide) below to host the application on your own accounts and replace these with your actual live URLs.

- **Frontend**: `[Your-Vercel-URL]`
- **Backend**: `[Your-Render-URL]`
- **API Docs (Swagger)**: `[Your-Render-URL]/docs`

## ✨ Features
- **Dashboard**: Real-time insights with "Wins per Team" and "Matches per Venue" charts.
- **Standings**: Official points table with NRR and points calculated.
- **Player Stats**: Orange Cap (Most Runs) and Purple Cap (Most Wickets) leaderboards.
- **Match Center**: Paginated match history with winners and venue details.
- **Team Grid**: Full franchise list with logos.

## 🛠 Tech Stack
- **Database**: PostgreSQL (Primes for production, handles SQLite for local).
- **Backend**: Python (FastAPI) + SQLAlchemy ORM + Alembic Migrations.
- **Frontend**: React + Vite + Recharts + Lucide Icons.
- **Documentation**: OpenAPI (Swagger).
- **Deployment**: Configured for Render & Vercel.

## 📝 Submission Checklist Check
- [x] **Database & Data Modeling**: Relational schema defined in `models.py`.
- [x] **API Development**: 7+ endpoints with pagination and filtering.
- [x] **Migrations**: Alembic set up for schema versioning.
- [x] **Swagger UI**: Integrated and available at `/docs`.
- [x] **Frontend Insights**: 2 charts (Recharts) and structured tables.
- [x] **Loading/Error States**: Fully handled in the UI.
- [x] **GitHub Ops**: Clean repository structure with clear README.

## ⚙️ Local Setup

1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app/seed.py  # Seeds the local SQLite database
   uvicorn app.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ☁️ Deployment Guide

### 1. Database (PostgreSQL)
- Create a project on [Supabase](https://supabase.com/).
- Copy the Connection String and set it as `DATABASE_URL`.

### 2. Backend (Render)
- Link this repo to **Render**.
- Create a **Web Service**.
- Build Command: `pip install -r backend/requirements.txt`
- Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0`
- Add `DATABASE_URL` in Environment Variables.

### 3. Frontend (Vercel)
- Link this repo to **Vercel**.
- Root Directory: `frontend/`.
- Add `VITE_API_URL` (your Render URL) in Environment Variables.

---
*Developed by Madhav Khanna*
