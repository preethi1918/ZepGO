# ZepGO Backend - FastAPI & XGBoost ML Engine
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend codebase
COPY backend/ backend/

# Train or verify ML model artifacts if not present
RUN python -m backend.app.ml.train_model

ENV PORT=8000
ENV HOST=0.0.0.0
EXPOSE 8000

# Run FastAPI with Uvicorn (supports dynamic PORT injected by cloud container platforms)
CMD ["sh", "-c", "python -m uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
