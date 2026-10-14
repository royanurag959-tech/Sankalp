from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime, timedelta
from app.database import get_db
from app.models import RecoveryCheckin, RecoveryGoal, User
from app.schemas import CheckinCreate, CheckinResponse, GoalCreate, GoalResponse
from app.auth import get_current_user

router = APIRouter(prefix="/tracker", tags=["Recovery & Habit Tracker"])

@router.get("/checkins", response_model=List[CheckinResponse])
def get_user_checkins(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    checkins = db.query(RecoveryCheckin).filter(
        RecoveryCheckin.user_id == current_user.id
    ).order_by(RecoveryCheckin.checkin_date.desc()).all()

    result = []
    for c in checkins:
        result.append(CheckinResponse(
            id=c.id,
            checkin_date=c.checkin_date,
            mood=c.mood,
            craving_intensity=c.craving_intensity,
            triggers=json.loads(c.triggers_json or "[]"),
            activities_completed=json.loads(c.activities_json or "[]"),
            notes=c.notes,
            created_at=c.created_at
        ))
    return result

@router.post("/checkin", response_model=CheckinResponse)
def create_or_update_checkin(
    data: CheckinCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if a checkin already exists for this date; allow updating it
    existing = db.query(RecoveryCheckin).filter(
        RecoveryCheckin.user_id == current_user.id,
        RecoveryCheckin.checkin_date == data.checkin_date
    ).first()

    if existing:
        existing.mood = data.mood
        existing.craving_intensity = data.craving_intensity
        existing.triggers_json = json.dumps(data.triggers)
        existing.activities_json = json.dumps(data.activities_completed)
        existing.notes = data.notes
        db.commit()
        db.refresh(existing)
        target = existing
    else:
        target = RecoveryCheckin(
            user_id=current_user.id,
            checkin_date=data.checkin_date,
            mood=data.mood,
            craving_intensity=data.craving_intensity,
            triggers_json=json.dumps(data.triggers),
            activities_json=json.dumps(data.activities_completed),
            notes=data.notes
        )
        db.add(target)
        db.commit()
        db.refresh(target)

    # Update goal streaks automatically
    active_goals = db.query(RecoveryGoal).filter(
        RecoveryGoal.user_id == current_user.id,
        RecoveryGoal.is_active == True
    ).all()
    for g in active_goals:
        g.current_streak += 1
    db.commit()

    return CheckinResponse(
        id=target.id,
        checkin_date=target.checkin_date,
        mood=target.mood,
        craving_intensity=target.craving_intensity,
        triggers=json.loads(target.triggers_json or "[]"),
        activities_completed=json.loads(target.activities_json or "[]"),
        notes=target.notes,
        created_at=target.created_at
    )

@router.delete("/checkin/{checkin_id}")
def delete_checkin(
    checkin_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    checkin = db.query(RecoveryCheckin).filter(
        RecoveryCheckin.id == checkin_id,
        RecoveryCheckin.user_id == current_user.id
    ).first()
    if not checkin:
        raise HTTPException(status_code=404, detail="Check-in record not found.")

    db.delete(checkin)
    db.commit()
    return {"status": "success", "message": "Check-in record deleted."}

@router.get("/stats")
def get_tracker_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Calculate streaks, 7-day and 30-day trends, milestones with zero guilt messaging."""
    checkins = db.query(RecoveryCheckin).filter(
        RecoveryCheckin.user_id == current_user.id
    ).order_by(RecoveryCheckin.checkin_date.asc()).all()

    total_checkins = len(checkins)
    streak_count = 0
    if checkins:
        # Calculate consecutive days ending today or yesterday
        today = datetime.utcnow().date()
        date_set = {datetime.strptime(c.checkin_date, "%Y-%m-%d").date() for c in checkins}
        curr = today
        if curr not in date_set:
            curr = today - timedelta(days=1)
        while curr in date_set:
            streak_count += 1
            curr -= timedelta(days=1)

    # Format chart data
    chart_data = []
    for c in checkins[-14:]: # Last 14 days
        chart_data.append({
            "date": c.checkin_date[5:], # MM-DD
            "mood": c.mood,
            "craving": c.craving_intensity
        })

    # Milestones badges
    milestones = [
        {"id": "day1", "name": "First Step (पहला कदम)", "unlocked": total_checkins >= 1, "desc": "Completed your first check-in"},
        {"id": "day3", "name": "Building Momentum", "unlocked": streak_count >= 3 or total_checkins >= 3, "desc": "3 days of conscious awareness"},
        {"id": "week1", "name": "One Week Resilient", "unlocked": streak_count >= 7 or total_checkins >= 7, "desc": "7 days of dedicated recovery progress"},
        {"id": "month1", "name": "30-Day Sankalp Champion", "unlocked": streak_count >= 30 or total_checkins >= 30, "desc": "A month of healthy, positive habits"}
    ]

    return {
        "total_checkins": total_checkins,
        "current_streak_days": streak_count,
        "encouragement_message": (
            "Every single day you choose your health is a victory. Even if you miss a day, your journey continues right now."
            if streak_count == 0 else
            f"You have checked in for {streak_count} consecutive days! Honor your dedication to yourself today."
        ),
        "milestones": milestones,
        "chart_data": chart_data
    }

@router.get("/goals", response_model=List[GoalResponse])
def get_user_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goals = db.query(RecoveryGoal).filter(RecoveryGoal.user_id == current_user.id).all()
    if not goals:
        # Provide default goal if none exist
        default_goal = RecoveryGoal(
            user_id=current_user.id,
            title="Clean & Mindful Living",
            category="Sobriety",
            target_days=30,
            current_streak=1,
            is_active=True
        )
        db.add(default_goal)
        db.commit()
        db.refresh(default_goal)
        return [GoalResponse.from_orm(default_goal)]
    return [GoalResponse.from_orm(g) for g in goals]

@router.post("/goals", response_model=GoalResponse)
def create_goal(
    goal_in: GoalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    goal = RecoveryGoal(
        user_id=current_user.id,
        title=goal_in.title,
        category=goal_in.category,
        target_days=goal_in.target_days,
        current_streak=0,
        is_active=True
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return GoalResponse.from_orm(goal)
