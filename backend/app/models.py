from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    role = Column(String(50), default="user") # "user", "parent", "admin"
    preferred_language = Column(String(20), default="en") # "en", "hi", "hinglish"
    consent_given = Column(Boolean, default=True)
    emergency_contact_name = Column(String(255), nullable=True)
    emergency_contact_phone = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assessments = relationship("AssessmentResult", back_populates="user", cascade="all, delete-orphan")
    checkins = relationship("RecoveryCheckin", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("RecoveryGoal", back_populates="user", cascade="all, delete-orphan")
    journals = relationship("JournalEntry", back_populates="user", cascade="all, delete-orphan")

class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    total_score = Column(Integer, nullable=False)
    risk_level = Column(String(50), nullable=False) # "Low", "Mild", "Moderate", "High"
    answers_json = Column(Text, nullable=False) # JSON string of user responses
    recommendations_json = Column(Text, nullable=False) # JSON string of steps
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="assessments")

class RecoveryCheckin(Base):
    __tablename__ = "recovery_checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    checkin_date = Column(String(20), nullable=False, index=True) # YYYY-MM-DD
    mood = Column(Integer, default=3) # 1 to 5 scale
    craving_intensity = Column(Integer, default=0) # 0 to 10 scale
    triggers_json = Column(Text, default="[]") # JSON list of trigger tags
    activities_json = Column(Text, default="[]") # JSON list of activities
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="checkins")

class RecoveryGoal(Base):
    __tablename__ = "recovery_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), default="Sobriety") # Sobriety, Mindfulness, Fitness, Community
    target_days = Column(Integer, default=30)
    current_streak = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="goals")

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    mood_tag = Column(String(50), default="Reflective")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="journals")

class DirectoryResource(Base):
    __tablename__ = "directory_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True) # "National Helpline", "Rehab Center", "Counseling", "Support Group", "Hospital"
    phone = Column(String(50), nullable=False)
    alternate_phone = Column(String(50), nullable=True)
    address = Column(String(500), nullable=True)
    state = Column(String(100), nullable=False, index=True)
    city = Column(String(100), nullable=False, index=True)
    operational_hours = Column(String(100), default="24/7")
    languages_json = Column(String(255), default='["Hindi", "English"]')
    website = Column(String(255), nullable=True)
    source_url = Column(String(255), nullable=True)
    verified_status = Column(String(50), default="Verified") # "Verified", "Pending Human Review", "Community Sourced"
    verification_date = Column(String(50), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), index=True, nullable=False)
    user_id = Column(Integer, nullable=True)
    role = Column(String(20), nullable=False) # "user", "assistant", "system"
    content = Column(Text, nullable=False)
    is_crisis_flagged = Column(Boolean, default=False)
    language = Column(String(20), default="en")
    created_at = Column(DateTime, default=datetime.utcnow)
