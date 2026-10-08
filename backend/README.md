# PitchCoach Django Backend

A production-ready Django REST backend for **PitchCoach**, featuring **Function-Based Views (FBV)**, native **MySQL** persistence with JSON telemetry fields, and 100% turnkey deployment readiness for **Render**.

---

## Architecture Overview

- **Framework**: Django 5.1 + Django REST Framework
- **Architecture**: **Function-Based Views** (`@api_view`) exclusively across all endpoints
- **Database**:
  - **Local Development**: MySQL 8.0 on `127.0.0.1:3306` (with PyMySQL & utf8mb4 charset)
  - **Render Production**: External MySQL (e.g. Aiven, PlanetScale, Railway, AWS RDS) or Render PostgreSQL via `DATABASE_URL` / `dj-database-url`
  - **Graceful Fallback**: SQLite fallback if local MySQL password is not yet configured
- **AI Engine**: Google Gemini API (`gemini-3.8-flash`) + calibrated fallback heuristic engine
- **WSGI / Production Server**: Gunicorn + WhiteNoise for static files
- **CORS**: Fully configured with `django-cors-headers` for Next.js frontend communication

---

## API Endpoints (Function-Based Views)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health/` | Service health & database connectivity check (for Render) |
| `POST` | `/api/evaluate-pitch/` | Runs rubric & telemetry evaluation; persists session to MySQL |
| `POST` | `/api/judge-questions/` | Generates 3 hyper-targeted judge cross-examination questions |
| `GET` | `/api/history/` | Retrieves all recorded pitch runs from MySQL for the Dashboard |
| `GET` | `/api/history/<session_id>/` | Retrieves full evaluation rubric for a specific run |
| `DELETE` | `/api/history/<session_id>/` | Deletes a specific rehearsal run from MySQL |
| `DELETE` | `/api/history/clear/` | Clears all runs from MySQL |

---

## Local Setup with MySQL

### 1. Configure MySQL Credentials
Edit [`backend/.env`](./.env) and set your local MySQL root password:
```env
DB_NAME=pitchcoach_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

### 2. Auto-Create MySQL Database
Run the setup script:
```bash
python setup_mysql.py
```
This automatically executes:
```sql
CREATE DATABASE IF NOT EXISTS `pitchcoach_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Apply Migrations
```bash
python manage.py migrate
```

### 4. Start the Django Server
```bash
python manage.py runserver
```
The API is live at `http://127.0.0.1:8000/`.

---

## Deploying to Render

This backend is pre-configured for **Render**:

### Method 1: Render Blueprint (Infrastructure as Code)
1. Push your repository to GitHub.
2. In Render Dashboard, click **New +** -> **Blueprint**.
3. Select this repository. Render will automatically read [`render.yaml`](./render.yaml).

### Method 2: Manual Web Service Setup
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn pitch_backend.wsgi:application --bind 0.0.0.0:$PORT`
   - **Health Check Path**: `/api/health/`
4. Set Environment Variables:
   - `SECRET_KEY`: *(Generate or use random string)*
   - `GEMINI_API_KEY`: *(Your Google AI Studio Gemini API key)*
   - `DATABASE_URL`: *(Connection string to your MySQL or PostgreSQL database)*
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `.onrender.com`
