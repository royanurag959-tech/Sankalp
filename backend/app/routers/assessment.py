from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.database import get_db
from app.models import AssessmentResult, User
from app.schemas import AssessmentSubmission, AssessmentResponse
from app.auth import get_current_user_optional, get_current_user

router = APIRouter(prefix="/assessment", tags=["AI Self-Assessment"])

ASSESSMENT_QUESTIONS = [
    {
        "id": 1,
        "category": "Frequency",
        "question": "How often in the past month have you engaged with substances (tobacco, alcohol, prescription drugs, or other substances)?",
        "question_hi": "पिछले महीने में आपने कितनी बार नशीले पदार्थों या शराब/तंबाकू का सेवन किया?",
        "options": [
            {"text": "Never / Rarely (0-1 time)", "score": 0},
            {"text": "Occasionally (2-4 times a month)", "score": 1},
            {"text": "Frequently (2-3 times a week)", "score": 2},
            {"text": "Daily or almost daily", "score": 4}
        ]
    },
    {
        "id": 2,
        "category": "Cravings & Urges",
        "question": "Do you feel strong urges, thoughts, or intense cravings that feel difficult to resist?",
        "question_hi": "क्या आप तीव्र तलब या ऐसी इच्छा महसूस करते हैं जिसे रोकना मुश्किल लगता है?",
        "options": [
            {"text": "Never", "score": 0},
            {"text": "Rarely, only in specific social settings", "score": 1},
            {"text": "Sometimes, especially during stress or boredom", "score": 2},
            {"text": "Very frequently / Daily", "score": 4}
        ]
    },
    {
        "id": 3,
        "category": "Daily Life Impact",
        "question": "Has this habit affected your studies, job responsibilities, energy, or household duties?",
        "question_hi": "क्या इस आदत ने आपकी पढ़ाई, नौकरी की ज़िम्मेदारियों, ऊर्जा या घर के कामों को प्रभावित किया है?",
        "options": [
            {"text": "Not at all", "score": 0},
            {"text": "Mildly (occasional fatigue or mild delay)", "score": 1},
            {"text": "Noticeably (missed deadlines, decreased focus)", "score": 2},
            {"text": "Significantly (frequent absence or neglect of duties)", "score": 4}
        ]
    },
    {
        "id": 4,
        "category": "Emotional Coping",
        "question": "Do you tend to turn to substances to cope with stress, anxiety, sadness, or loneliness?",
        "question_hi": "क्या आप तनाव, चिंता, उदासी या अकेलेपन से निपटने के लिए इसका सहारा लेते हैं?",
        "options": [
            {"text": "Never, I use healthy coping mechanisms", "score": 0},
            {"text": "Rarely", "score": 1},
            {"text": "Frequently when things get overwhelming", "score": 2},
            {"text": "Almost always; it feels like my primary escape", "score": 4}
        ]
    },
    {
        "id": 5,
        "category": "Control & Attempts",
        "question": "Have you tried to reduce or stop your usage, but found it difficult to maintain?",
        "question_hi": "क्या आपने इसका उपयोग कम करने या छोड़ने की कोशिश की है, लेकिन इसे बनाए रखना कठिन लगा?",
        "options": [
            {"text": "Never needed to / not applicable", "score": 0},
            {"text": "I can easily take breaks without difficulty", "score": 1},
            {"text": "I have tried once or twice with mixed results", "score": 2},
            {"text": "Repeatedly tried, but found it very challenging on my own", "score": 4}
        ]
    },
    {
        "id": 6,
        "category": "Interpersonal Relationships",
        "question": "Have friends, family, or colleagues expressed worry or concern about your habits?",
        "question_hi": "क्या दोस्तों, परिवार या साथियों ने आपकी आदतों के बारे में चिंता व्यक्त की है?",
        "options": [
            {"text": "No, never", "score": 0},
            {"text": "A close friend made a casual remark", "score": 1},
            {"text": "Yes, family members have expressed concern", "score": 2},
            {"text": "Yes, it has caused recurring conflicts or strain", "score": 4}
        ]
    },
    {
        "id": 7,
        "category": "Physical & Emotional Health",
        "question": "Have you experienced sleep disturbances, guilt, mood swings, or physical discomfort?",
        "question_hi": "क्या आपने नींद में परेशानी, अपराधबोध, मूड में बदलाव या शारीरिक बेचैनी महसूस की है?",
        "options": [
            {"text": "None", "score": 0},
            {"text": "Occasional mild sleep issues or fatigue", "score": 1},
            {"text": "Moderate feelings of regret or morning fatigue", "score": 2},
            {"text": "Frequent mood drops, tremors, or intense guilt", "score": 4}
        ]
    },
    {
        "id": 8,
        "category": "Readiness for Positive Change",
        "question": "How do you feel about exploring supportive recovery tools or speaking to a counselor?",
        "question_hi": "सपोर्ट टूल्स का उपयोग करने या किसी काउंसलर से बात करने के बारे में आप कैसा महसूस करते हैं?",
        "options": [
            {"text": "Just curious and exploring information", "score": 0},
            {"text": "Thinking about making healthy changes soon", "score": 1},
            {"text": "Ready to build positive habits with guidance", "score": 2},
            {"text": "Seeking supportive help right now", "score": 3}
        ]
    }
]

@router.get("/questions")
def get_questions():
    """Return confidential, non-stigmatizing assessment questionnaire."""
    return {"questions": ASSESSMENT_QUESTIONS}

@router.post("/submit", response_model=AssessmentResponse)
def submit_assessment(
    submission: AssessmentSubmission,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    total_score = sum(ans.score for ans in submission.answers)

    # Determine preliminary risk indicator
    if total_score <= 7:
        risk_level = "Low"
        risk_title = "Healthy Habits & Low Risk Profile (कम जोखिम)"
        risk_description = "Your responses suggest that your substance engagement is either minimal or non-disruptive. Maintaining awareness and healthy stress-management habits is recommended."
        recommendations = [
            "Continue engaging in regular physical exercise, mindfulness, and healthy sleep schedules.",
            "Explore our guided breathing exercises in the Wellness Tools tab whenever everyday stress arises.",
            "Stay informed about positive peer environments and keep conversations open with friends and mentors."
        ]
        immediate_action = "Maintain your current healthy routines and practice daily gratitude."
    elif total_score <= 15:
        risk_level = "Mild"
        risk_title = "Mild Vulnerability / Habit Forming (हल्का जोखिम)"
        risk_description = "Your responses indicate some recurring patterns or emotional reliance that could benefit from early mindful attention before becoming a deeper dependency."
        recommendations = [
            "Identify personal triggers (e.g., social pressure, post-work fatigue, exam stress) using our Recovery Tracker.",
            "Practice the 'Urge Surfing' technique and the 15-minute delay rule when cravings arise.",
            "Reach out to trusted friends, or have a confidential chat with Sankalp Sathi AI to reflect on habit patterns."
        ]
        immediate_action = "Set a 14-day wellness goal in the Tracker and record your daily moods."
    elif total_score <= 23:
        risk_level = "Moderate"
        risk_title = "Moderate Risk / Significant Impact (मध्यम जोखिम)"
        risk_description = "Substance use appears to be creating noticeable stress on your daily life, emotional well-being, or relationships. Structured support can make a major positive difference."
        recommendations = [
            "Consider speaking with a professional counselor. National Helplines like Tele-MANAS (14416) offer free, supportive, confidential guidance.",
            "Break the secrecy cycle: choose one non-judgmental friend, counselor, or family member to confide in.",
            "Establish daily recovery milestones and practice guided box breathing during high-stress peaks."
        ]
        immediate_action = "Connect with a counselor via Tele-MANAS (14416) or explore verified community support groups."
    else:
        risk_level = "High"
        risk_title = "High Support Recommended / Potential Dependency (उच्च समर्थन अनुशंसित)"
        risk_description = "Your responses indicate that substance use is causing considerable distress and impact. You deserve compassionate, professional medical and psychological support without judgment."
        recommendations = [
            "We strongly recommend connecting with a medical professional or visiting an accredited Integrated Rehabilitation Centre (IRCA) or hospital like AIIMS / NIMHANS.",
            "Call the National Drug De-addiction Helpline at 14446 (Toll-Free, 24x7) to receive personalized counseling and medical referrals.",
            "Avoid abrupt unassisted withdrawal if physical dependency is present; speak to an addiction medicine doctor for safe detoxification."
        ]
        immediate_action = "Call the National Toll-Free Helpline at 14446 or Tele-MANAS at 14416 right now. Help is completely confidential and free."

    helplines = [
        {"name": "National Drug De-Addiction Helpline (Nasha Mukti)", "number": "14446", "hours": "24/7 Toll-Free"},
        {"name": "Tele-MANAS Psychological Support", "number": "14416", "hours": "24/7 Toll-Free"},
        {"name": "KIRAN Mental Health Rehabilitation", "number": "1800-599-0019", "hours": "24/7 Toll-Free"}
    ]

    disclaimer = (
        "IMPORTANT MEDICAL DISCLAIMER: This assessment is an educational self-reflection tool inspired by validated screening frameworks. "
        "It does NOT constitute a clinical diagnosis, psychiatric evaluation, or medical advice. "
        "Sankalp never judges or labels you. Please consult qualified healthcare providers for medical guidance."
    )

    # Persist if user is logged in
    assessment_record = None
    if current_user:
        assessment_record = AssessmentResult(
            user_id=current_user.id,
            total_score=total_score,
            risk_level=risk_level,
            answers_json=json.dumps([a.dict() for a in submission.answers]),
            recommendations_json=json.dumps(recommendations)
        )
        db.add(assessment_record)
        db.commit()
        db.refresh(assessment_record)

    return AssessmentResponse(
        id=assessment_record.id if assessment_record else None,
        total_score=total_score,
        risk_level=risk_level,
        risk_title=risk_title,
        risk_description=risk_description,
        recommendations=recommendations,
        immediate_action=immediate_action,
        helplines=helplines,
        disclaimer=disclaimer,
        created_at=assessment_record.created_at if assessment_record else None
    )

@router.get("/history", response_model=List[AssessmentResponse])
def get_assessment_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    results = db.query(AssessmentResult).filter(AssessmentResult.user_id == current_user.id).order_by(AssessmentResult.created_at.desc()).all()
    history = []
    for r in results:
        recs = json.loads(r.recommendations_json or "[]")
        history.append(AssessmentResponse(
            id=r.id,
            total_score=r.total_score,
            risk_level=r.risk_level,
            risk_title=f"{r.risk_level} Risk Level Assessment",
            risk_description="Past confidential self-assessment summary.",
            recommendations=recs,
            immediate_action=None,
            helplines=[],
            disclaimer="Educational assessment record.",
            created_at=r.created_at
        ))
    return history
