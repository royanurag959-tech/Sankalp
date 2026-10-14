from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Auth Schemas
class UserRegister(BaseModel):
    email: str
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    preferred_language: Optional[str] = "en"
    role: Optional[str] = "user"
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    preferred_language: str
    consent_given: bool
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

# Assessment Schemas
class AssessmentQuestionAnswer(BaseModel):
    question_id: int
    question_text: str
    selected_option_index: int
    selected_option_text: str
    score: int

class AssessmentSubmission(BaseModel):
    answers: List[AssessmentQuestionAnswer]
    notes: Optional[str] = None

class AssessmentResponse(BaseModel):
    id: Optional[int] = None
    total_score: int
    risk_level: str # "Low", "Mild", "Moderate", "High"
    risk_title: str
    risk_description: str
    recommendations: List[str]
    immediate_action: Optional[str] = None
    helplines: List[Dict[str, str]]
    disclaimer: str
    created_at: Optional[datetime] = None

# Recovery Tracker Schemas
class CheckinCreate(BaseModel):
    checkin_date: str # YYYY-MM-DD
    mood: int = Field(..., ge=1, le=5)
    craving_intensity: int = Field(..., ge=0, le=10)
    triggers: List[str] = []
    activities_completed: List[str] = []
    notes: Optional[str] = None

class CheckinResponse(BaseModel):
    id: int
    checkin_date: str
    mood: int
    craving_intensity: int
    triggers: List[str]
    activities_completed: List[str]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class GoalCreate(BaseModel):
    title: str
    category: str = "Sobriety"
    target_days: int = 30

class GoalResponse(BaseModel):
    id: int
    title: str
    category: str
    target_days: int
    current_streak: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Wellness Schemas
class JournalCreate(BaseModel):
    title: str
    content: str
    mood_tag: str = "Reflective"

class JournalResponse(BaseModel):
    id: int
    title: str
    content: str
    mood_tag: str
    created_at: datetime

    class Config:
        from_attributes = True

# Chat Schemas
class ChatRequest(BaseModel):
    session_id: str
    message: str
    language: Optional[str] = "en" # "en", "hi", "hinglish"

class ChatResponse(BaseModel):
    session_id: str
    reply: str
    is_crisis: bool = False
    crisis_banner: Optional[Dict[str, Any]] = None
    suggested_resources: List[Dict[str, str]] = []
    mode: str = "demo" # "demo", "gemini", "openai"
    disclaimer: str

# Directory Schemas
class DirectoryResourceCreate(BaseModel):
    name: str
    category: str
    phone: str
    alternate_phone: Optional[str] = None
    address: Optional[str] = None
    state: str
    city: str
    operational_hours: str = "24/7"
    languages: List[str] = ["Hindi", "English"]
    website: Optional[str] = None
    source_url: Optional[str] = None
    verified_status: str = "Pending Human Review"
    notes: Optional[str] = None

class DirectoryResourceResponse(BaseModel):
    id: int
    name: str
    category: str
    phone: str
    alternate_phone: Optional[str] = None
    address: Optional[str] = None
    state: str
    city: str
    operational_hours: str
    languages: List[str]
    website: Optional[str] = None
    source_url: Optional[str] = None
    verified_status: str
    verification_date: Optional[str] = None
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# TinyFish API Schemas
class TinyFishFetchRequest(BaseModel):
    urls: List[str]
    purpose: Optional[str] = "Extract and verify official de-addiction helpline details for Nasha Mukt Bharat directory"
    format: Optional[str] = "markdown"

class TinyFishFetchResult(BaseModel):
    url: str
    status: str # "success", "failed", "simulated"
    extracted_title: Optional[str] = None
    extracted_contacts: List[str] = []
    markdown_snippet: Optional[str] = None
    retrieved_at: str
    needs_human_verification: bool = True
