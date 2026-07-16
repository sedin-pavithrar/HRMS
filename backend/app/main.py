import os
import json
from fastapi import FastAPI, Depends
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from .database import engine, Base, get_db
from .seed import seed_db
from .routes import employees, leaves, attendance, payroll

# Initialize DB tables
Base.metadata.create_all(bind=engine)

# Seed database on startup if empty
db = next(get_db())
try:
    seed_db(db)
finally:
    db.close()

app = FastAPI(
    title="HRMS POC",
    description="HRMS demonstration application for SparkEcho.",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SparkEcho Integration Contracts ---

# Health check endpoints
@app.get("/health")
@app.get("/hrms/health")
def health_check():
    return {
        "status": "UP",
        "application": "HRMS",
        "version": "1.0.0"
    }

# Metadata endpoints
@app.get("/metadata")
@app.get("/hrms/metadata")
def metadata():
    return {
        "name": "HRMS",
        "version": "1.0",
        "description": "HRMS Demo",
        "icon": "users",
        "routes": [
            {
                "title": "Dashboard",
                "path": "/hrms"
            },
            {
                "title": "Employee Management",
                "path": "/hrms/employees"
            },
            {
                "title": "Leave Management",
                "path": "/hrms/leave"
            },
            {
                "title": "Attendance",
                "path": "/hrms/attendance"
            },
            {
                "title": "Payroll",
                "path": "/hrms/payroll"
            }
        ]
    }

# Manifest endpoints
@app.get("/manifest")
@app.get("/hrms/manifest")
def manifest():
    paths = [
        os.path.join(os.path.dirname(__file__), "modules.json"),
        os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "src", "navigation", "modules.json"),
        os.path.join(os.path.dirname(__file__), "static", "modules.json")
    ]
    for path in paths:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading manifest from {path}: {e}")
    return {
        "application": "HRMS",
        "basePath": "/hrms",
        "landingPage": {
            "title": "Dashboard",
            "route": "/"
        },
        "modules": []
    }


# --- Module Routers ---
# Expose at both root and /hrms paths for proxy flexibility
for prefix in ["", "/hrms"]:
    app.include_router(employees.router, prefix=prefix)
    app.include_router(leaves.router, prefix=prefix)
    app.include_router(attendance.router, prefix=prefix)
    app.include_router(payroll.router, prefix=prefix)

# --- Serving Frontend Static Files & SPA Catch-All ---

static_dir = os.path.join(os.path.dirname(__file__), "static")

# If frontend files exist, set up static files and SPA route fallback
if os.path.exists(static_dir):
    # Mount assets folder
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/hrms/assets", StaticFiles(directory=assets_dir), name="assets")

    # SPA Catch-all: Server index.html for all frontend page requests
    @app.get("/hrms/{catchall:path}", response_class=HTMLResponse)
    def read_hrms_app(catchall: str):
        # Allow static files to be retrieved if requested under /hrms (like favicon or logos)
        file_path = os.path.join(static_dir, catchall)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))

    # Also route base /hrms and /hrms/
    @app.get("/hrms", response_class=HTMLResponse)
    @app.get("/hrms/", response_class=HTMLResponse)
    def read_hrms_root():
        return FileResponse(os.path.join(static_dir, "index.html"))
else:
    # Development placeholder when frontend is not built
    @app.get("/hrms/{catchall:path}", response_class=HTMLResponse)
    @app.get("/hrms", response_class=HTMLResponse)
    @app.get("/hrms/", response_class=HTMLResponse)
    def dev_placeholder():
        return """
        <html>
            <head><title>HRMS POC Backend</title></head>
            <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #0f172a; color: #f8fafc;">
                <h1>HRMS Backend running</h1>
                <p>Frontend static files not yet compiled. Run frontend in development mode or build production package.</p>
            </body>
        </html>
        """
