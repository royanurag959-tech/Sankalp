from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, RecoveryCheckin, RecoveryGoal, JournalEntry, AssessmentResult
from app.schemas import UserRegister, UserLogin, TokenResponse, UserProfile
from app.auth import verify_password, get_password_hash, create_access_token, get_current_user
import json

router = APIRouter(prefix="/auth", tags=["Authentication & Profile"])

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name or "Friend in Recovery",
        preferred_language=user_in.preferred_language or "en",
        role=user_in.role or "user",
        emergency_contact_name=user_in.emergency_contact_name,
        emergency_contact_phone=user_in.emergency_contact_phone,
        consent_given=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(access_token=token, user=UserProfile.from_orm(user))

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token({"sub": str(user.id), "email": user.email})
    return TokenResponse(access_token=token, user=UserProfile.from_orm(user))

@router.post("/guest-demo", response_model=TokenResponse)
def guest_demo_login(db: Session = Depends(get_db)):
    """One-click guest login for hackathon judges and rapid testing."""
    demo_user = db.query(User).filter(User.email == "demo@sankalp.in").first()
    if not demo_user:
        demo_user = User(
            email="demo@sankalp.in",
            hashed_password=get_password_hash("sankalp2026"),
            full_name="Aarav Sharma",
            role="user",
            preferred_language="en",
            consent_given=True,
            emergency_contact_name="Family Member",
            emergency_contact_phone="14416"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    token = create_access_token({"sub": str(demo_user.id), "email": demo_user.email})
    return TokenResponse(access_token=token, user=UserProfile.from_orm(demo_user))

@router.get("/me", response_model=UserProfile)
def get_me(current_user: User = Depends(get_current_user)):
    return UserProfile.from_orm(current_user)

@router.put("/profile", response_model=UserProfile)
def update_profile(
    full_name: str = None,
    preferred_language: str = None,
    emergency_contact_name: str = None,
    emergency_contact_phone: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if full_name is not None:
        current_user.full_name = full_name
    if preferred_language is not None:
        current_user.preferred_language = preferred_language
    if emergency_contact_name is not None:
        current_user.emergency_contact_name = emergency_contact_name
    if emergency_contact_phone is not None:
        current_user.emergency_contact_phone = emergency_contact_phone

    db.commit()
    db.refresh(current_user)
    return UserProfile.from_orm(current_user)

@router.get("/export-data")
def export_user_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allows user to export all their personal recovery data in JSON format."""
    checkins = db.query(RecoveryCheckin).filter(RecoveryCheckin.user_id == current_user.id).all()
    goals = db.query(RecoveryGoal).filter(RecoveryGoal.user_id == current_user.id).all()
    journals = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).all()
    assessments = db.query(AssessmentResult).filter(AssessmentResult.user_id == current_user.id).all()

    return {
        "profile": {
            "email": current_user.email,
            "full_name": current_user.full_name,
            "preferred_language": current_user.preferred_language,
            "created_at": str(current_user.created_at)
        },
        "assessments_count": len(assessments),
        "recovery_checkins": [
            {
                "date": c.checkin_date,
                "mood": c.mood,
                "craving_intensity": c.craving_intensity,
                "triggers": json.loads(c.triggers_json or "[]"),
                "activities": json.loads(c.activities_json or "[]"),
                "notes": c.notes
            } for c in checkins
        ],
        "goals": [
            {"title": g.title, "category": g.category, "streak": g.current_streak, "target": g.target_days}
            for g in goals
        ],
        "journal_entries": [
            {"title": j.title, "mood_tag": j.mood_tag, "date": str(j.created_at)}
            for j in journals
        ]
    }

@router.delete("/delete-account")
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Complete account and data erasure for strict privacy protection."""
    db.delete(current_user)
    db.commit()
    return {"status": "success", "message": "All your personal records and profile have been permanently deleted from Sankalp."}
