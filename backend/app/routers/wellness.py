from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models import JournalEntry, User
from app.schemas import JournalCreate, JournalResponse
from app.auth import get_current_user

router = APIRouter(prefix="/wellness", tags=["Mental Wellness Tools"])

AFFIRMATIONS = [
    {
        "en": "I am stronger than any temporary craving. This feeling will pass.",
        "hi": "मैं किसी भी अस्थायी तलब से अधिक शक्तिशाली हूँ। यह क्षण बीत जाएगा।"
    },
    {
        "en": "Every healthy choice I make today is an investment in my tomorrow.",
        "hi": "आज मेरा हर स्वस्थ निर्णय मेरे आने वाले कल की नींव है।"
    },
    {
        "en": "I forgive myself for the past and choose peace, clarity, and strength right now.",
        "hi": "मैं अपने अतीत को क्षमा करता हूँ और वर्तमान में शांति और स्पष्टता चुनता हूँ।"
    },
    {
        "en": "Healing is not about perfection, it is about staying true to my Sankalp.",
        "hi": "सच्चा सुधार पूर्णता में नहीं, बल्कि अपने संकल्प के प्रति सच्चे रहने में है।"
    },
    {
        "en": "I have the courage to ask for help when I need it. Seeking support is bravery.",
        "hi": "मुझमें जरूरत पड़ने पर मदद मांगने का साहस है। सहायता मांगना कमजोरी नहीं, बहादुरी है।"
    }
]

BREATHING_EXERCISES = [
    {
        "id": "box",
        "title": "Box Breathing (4-4-4-4)",
        "title_hi": "समान वृत्ति प्राणायाम (Box Breathing)",
        "desc": "Used by athletes and first responders to immediately regulate the nervous system and curb intense adrenaline or panic.",
        "inhale": 4,
        "hold_in": 4,
        "exhale": 4,
        "hold_out": 4,
        "cycles": 4
    },
    {
        "id": "relax478",
        "title": "4-7-8 Deep Relaxation Breath",
        "title_hi": "4-7-8 गहरी शांति तकनीक",
        "desc": "Natural tranquilizer for the nervous system. Dr. Andrew Weil's technique to soothe rapid heart rate and overcome cravings.",
        "inhale": 4,
        "hold_in": 7,
        "exhale": 8,
        "hold_out": 0,
        "cycles": 4
    },
    {
        "id": "calm",
        "title": "Calming Resonant Breath (5-5)",
        "title_hi": "संतुलित श्वास तकनीक (5-5)",
        "desc": "Brings heart rate variability into coherence. Perfect for easing restlessness, anxiety, and racing thoughts.",
        "inhale": 5,
        "hold_in": 0,
        "exhale": 5,
        "hold_out": 0,
        "cycles": 6
    }
]

GROUNDING_54321 = {
    "title": "5-4-3-2-1 Sensory Grounding for Sudden Urges",
    "title_hi": "5-4-3-2-1 इंद्रिय संतुलन अभ्यास",
    "desc": "When cravings feel overwhelming, bring your mind into the present physical reality:",
    "steps": [
        {"count": 5, "label": "Things you can SEE around you", "label_hi": "5 चीजें जो आप अभी देख सकते हैं (उदा. खिड़की, मेज, पौधा)"},
        {"count": 4, "label": "Things you can physically TOUCH", "label_hi": "4 चीजें जिन्हें आप छू सकते हैं (उदा. कपड़े की बनावट, ठंडी दीवार)"},
        {"count": 3, "label": "Sounds you can HEAR right now", "label_hi": "3 ध्वनियां जो आप सुन सकते हैं (उदा. पंखे की आवाज, चिड़िया, सांस)"},
        {"count": 2, "label": "Things you can SMELL", "label_hi": "2 सुगंध जो आप महसूस कर सकते हैं (उदा. ताजी हवा, चाय, साबुन)"},
        {"count": 1, "label": "Positive thing you can TASTE or say to yourself", "label_hi": "1 सकारात्मक विचार जो आप खुद से कह सकते हैं: 'मैं सुरक्षित हूँ'"}
    ]
}

@router.get("/affirmations")
def get_daily_affirmations():
    return {"affirmations": AFFIRMATIONS}

@router.get("/breathing-guides")
def get_breathing_guides():
    return {
        "exercises": BREATHING_EXERCISES,
        "grounding": GROUNDING_54321
    }

# Journal CRUD
@router.get("/journals", response_model=List[JournalResponse])
def get_journals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    journals = db.query(JournalEntry).filter(
        JournalEntry.user_id == current_user.id
    ).order_by(JournalEntry.created_at.desc()).all()
    return [JournalResponse.from_orm(j) for j in journals]

@router.post("/journals", response_model=JournalResponse)
def create_journal(
    entry: JournalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    journal = JournalEntry(
        user_id=current_user.id,
        title=entry.title,
        content=entry.content,
        mood_tag=entry.mood_tag
    )
    db.add(journal)
    db.commit()
    db.refresh(journal)
    return JournalResponse.from_orm(journal)

@router.delete("/journals/{journal_id}")
def delete_journal(
    journal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    journal = db.query(JournalEntry).filter(
        JournalEntry.id == journal_id,
        JournalEntry.user_id == current_user.id
    ).first()
    if not journal:
        raise HTTPException(status_code=404, detail="Journal entry not found.")
    db.delete(journal)
    db.commit()
    return {"status": "success", "message": "Journal entry deleted."}
