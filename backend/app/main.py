from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.routers import auth, assessment, chat, tracker, wellness, directory, tinyfish, resources

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables
    Base.metadata.create_all(bind=engine)
    # Seed initial authentic directory listings and demo account
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Empathetic, confidential, AI-powered addiction prevention, emotional support, and recovery companion platform for Nasha Mukt Bharat.",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(assessment.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)
app.include_router(tracker.router, prefix=settings.API_V1_STR)
app.include_router(wellness.router, prefix=settings.API_V1_STR)
app.include_router(directory.router, prefix=settings.API_V1_STR)
app.include_router(tinyfish.router, prefix=settings.API_V1_STR)
app.include_router(resources.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "theme": settings.THEME,
        "version": settings.VERSION,
        "status": "operational",
        "emergency_helpline": "14416 (Tele-MANAS) / 14446 (Nasha Mukti Helpline)"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "api_v1": settings.API_V1_STR
    }
