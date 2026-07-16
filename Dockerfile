# --- Stage 1: Build React Frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /frontend

# Install dependencies
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy source and build
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Serve with FastAPI Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend/ ./backend/

# Copy built frontend assets into FastAPI's static folder
COPY --from=frontend-builder /frontend/dist/ ./backend/app/static/
# Copy navigation configuration for manifest API
COPY frontend/src/navigation/modules.json ./backend/app/modules.json

EXPOSE 8000

ENV PYTHONPATH=/app
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
