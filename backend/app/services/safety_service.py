import re
from typing import Dict, Any, Optional

CRISIS_PATTERNS = [
    # English keywords and phrases
    r"\b(suicide|suicidal|kill myself|end my life|want to die|hang myself|slit my wrist|take all pills|overdose)\b",
    r"\b(can't take it anymore|don't want to live|better off dead|ending it all|goodbye world)\b",
    r"\b(severe withdrawal|seizures|hallucinations|cannot breathe|unconscious|heart beating uncontrollably)\b",
    
    # Hindi / Hinglish phrases
    r"(mar\s*jana\s*chahta|marne\s*ka\s*mann|jaan\s*dena|khatam\s*karna\s*chahta|zindagi\s*se\s*tang)",
    r"(jeena\s*nahi\s*chahta|zeher|nashaa\s*zyada\s*ho\s*gaya|overdose\s*ho\s*gaya)",
    r"(khudkushi|aatmhatya|aatm\s*hatya|jaan\s*le\s*lunga)"
]

CRISIS_BANNER_INFO = {
    "title": "Immediate Help Available — You Are Not Alone (तत्काल सहायता उपलब्ध)",
    "description": "If you or someone around you is in immediate distress, experiencing severe withdrawal symptoms, or feeling overwhelmed, please connect with free, 24x7 verified national helplines immediately.",
    "helplines": [
        {
            "name": "Tele-MANAS (Mental Health Helpline)",
            "number": "14416",
            "toll_free": "1800-891-4416",
            "desc": "Govt of India 24x7 Multi-lingual psychological crisis support",
            "urgent": True
        },
        {
            "name": "National Drug De-addiction Helpline (Nasha Mukti)",
            "number": "14446",
            "toll_free": "14446",
            "desc": "Ministry of Social Justice & Empowerment, Govt of India",
            "urgent": True
        },
        {
            "name": "KIRAN Helpline",
            "number": "1800-599-0019",
            "toll_free": "1800-599-0019",
            "desc": "Mental health rehabilitation helpline (13 languages)",
            "urgent": True
        },
        {
            "name": "National Emergency Services",
            "number": "112",
            "toll_free": "112",
            "desc": "Immediate police and ambulance emergency response",
            "urgent": True
        }
    ],
    "message": "Sankalp Sathi is an AI companion and cannot handle clinical or life-threatening emergencies. Please reach out to one of the above human counselors right now. They care and are ready to help."
}

def analyze_safety(text: str) -> Dict[str, Any]:
    """
    Independent rule-based safety layer that evaluates incoming user input
    for urgent risk, self-harm signals, overdose, or medical emergency.
    """
    clean_text = text.lower()
    for pattern in CRISIS_PATTERNS:
        if re.search(pattern, clean_text, re.IGNORECASE):
            return {
                "is_crisis": True,
                "banner": CRISIS_BANNER_INFO,
                "priority": "HIGH_EMERGENCY"
            }
            
    return {
        "is_crisis": False,
        "banner": None,
        "priority": "NORMAL"
    }
