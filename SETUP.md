# ZepGO – Setup & Installation Guide

This guide explains how to run the ZepGO platform locally, using Docker, or in production environments.

---

## 1. Prerequisites

- **Node.js**: v18.0+ or v20.0+ (`node -v`)
- **npm**: v9.0+ (`npm -v`)
- **Python**: v3.10+ or v3.11+ (`python --version`)
- **Git**

---

## 2. Quick Start (Development Mode)

### Step 2.1: Clone & Environment Setup
```bash
git clone https://github.com/preethi1918/ZepGO.git
cd ZepGO
cp .env.example .env
```

### Step 2.2: Backend Setup (FastAPI & XGBoost)
```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment (optional but recommended)
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS / Linux:
# source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Train the ML models and generate artifacts
python -m backend.app.ml.train_model

# Run the test suite (14 verified tests)
python -m pytest backend/tests

# Start the FastAPI server on port 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will now be active at `http://127.0.0.1:8000`.
- Health check: `http://127.0.0.1:8000/health`
- Swagger UI Docs: `http://127.0.0.1:8000/docs`

### Step 2.3: Frontend Setup (React & Vite)
Open a new terminal window at the project root:
```bash
# Install frontend dependencies
npm install

# Build to verify compilation
npm run build

# Start the Vite development server
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:5173
```

---

## 3. Docker Deployment (Single Command)

To run the complete stack with multi-container orchestration:
```bash
docker-compose up --build
```
- Frontend UI: `http://localhost:80`
- Backend API: `http://localhost:8000`

---

## 4. Default Demo Persona Credentials

| Attribute | Demo Value |
|---|---|
| **User Name** | Preethi |
| **Email** | `preethi@zepgo.io` |
| **Password** | `password123` |
| **Default EV** | Tata Nexon EV Max (40.5 kWh, CCS2) |
| **Current SOC** | 62% |
| **Active Route** | Salem → Coimbatore (142 km, NH544) |
| **Recommended Hub**| Zeon Charging Hub - Salem Highway |

---

## 5. Troubleshooting

- **Port 8000 in use**: Specify `--port 8001` and update `VITE_API_URL` in `.env`.
- **Offline / Backend offline**: ZepGO features an automatic client-side fallback layer. If the backend server is stopped, all physics calculations and route comparisons continue running in the frontend.
