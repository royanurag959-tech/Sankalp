import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sankalp - AI Recovery Companion"
    VERSION: str = "1.0.0"
    THEME: str = "Nasha Mukt Bharat — Help Today, A Better Tomorrow"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sankalp-national-hackathon-secure-key-2026-recovery")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database (SQLite for immediate, reliable local zero-config persistence)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sankalp.db")
    
    # AI Engine Configuration
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "demo")  # 'demo', 'gemini', 'openai'
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # TinyFish API (Web Research & Verification of Public Helplines)
    TINYFISH_API_KEY: str = os.getenv("TINYFISH_API_KEY", "")
    TINYFISH_FETCH_URL: str = os.getenv("TINYFISH_FETCH_URL", "https://api.fetch.tinyfish.ai")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
