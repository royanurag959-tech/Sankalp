from fastapi import APIRouter

router = APIRouter(prefix="/resources", tags=["Educational Resources & Family Guidance"])

EDUCATIONAL_ARTICLES = [
    {
        "id": "stages-of-change",
        "category": "Recovery Science",
        "title": "Understanding the 5 Stages of Addiction Recovery (Prochaska & DiClemente)",
        "title_hi": "नशे से मुक्ति के 5 चरण: समझें अपनी रिकवरी यात्रा",
        "summary": "Recovery is rarely an overnight transformation. Knowing which stage you or your loved one is in helps set compassionate, realistic goals.",
        "content": (
            "1. Precontemplation: The individual doesn't yet see their substance use as a problem.\n"
            "2. Contemplation: Awareness begins. Weighing pros and cons of changing.\n"
            "3. Preparation: Making small steps, researching helplines (like Sankalp or 14446), and committing to change.\n"
            "4. Action: Actively engaging in counseling, detox, avoiding triggers, and daily check-ins.\n"
            "5. Maintenance & Relapse Prevention: Integrating healthy lifestyle habits, peer support, and resilience strategies."
        ),
        "target_audience": "Individuals in Recovery & Counselors",
        "read_time": "4 min"
    },
    {
        "id": "youth-peer-pressure",
        "category": "Youth & Students",
        "title": "Navigating Campus Peer Pressure & Saying 'No' with Confidence",
        "title_hi": "युवा और सहकर्मी दबाव: आत्मविश्वास से 'ना' कहना सीखें",
        "summary": "Practical boundaries and assertiveness strategies for college students and youth across India.",
        "content": (
            "Peer pressure often manifests subtly in social gatherings. Effective strategies include:\n"
            "• The Broken Record Technique: Calmly repeat 'No thanks, I don't drink/smoke' without feeling pressured to invent excuses.\n"
            "• Designate an Exit Code: Have an agreed signal with a close, sober friend to leave an uncomfortable party.\n"
            "• Shift Focus to Shared Hobbies: Connect through sports, music, coding, or art where substance use is not the center of bonding."
        ),
        "target_audience": "Students & Young Adults",
        "read_time": "3 min"
    },
    {
        "id": "medical-detox-importance",
        "category": "Healthcare & Safety",
        "title": "Why Unsupervised 'Cold Turkey' Detox Can Be Dangerous",
        "title_hi": "बिना डॉक्टरी सलाह के अचानक नशा छोड़ना क्यों जोखिम भरा हो सकता है?",
        "summary": "Understanding withdrawal syndrome and the critical role of medical detoxification in heavy alcohol or opioid dependence.",
        "content": (
            "For severe alcohol or benzodiazepine dependence, abrupt cessation can cause dangerous withdrawal symptoms including seizures and delirium tremens (DTs). "
            "Medical detoxification at accredited government hospitals (e.g. AIIMS NDDTC, NIMHANS) or registered IRCAs provides supervised pharmacological support to safely taper off without life-threatening physical distress."
        ),
        "target_audience": "All",
        "read_time": "5 min"
    }
]

MYTH_VS_FACTS = [
    {
        "id": 1,
        "myth": "Addiction is simply a lack of willpower or moral weakness.",
        "myth_hi": "नशा केवल इच्छाशक्ति की कमी या चरित्र की कमजोरी है।",
        "fact": "Addiction is a chronic, treatable neurobiological disorder affecting the brain's reward and decision circuitry. With evidence-based medical and psychological support, recovery is entirely possible.",
        "fact_hi": "एडिक्शन एक न्यूरोबायोलॉजिकल स्थिति है जो मस्तिष्क के रिवॉर्ड सिस्टम को प्रभावित करती है। उचित उपचार और समर्थन से कोई भी व्यक्ति पूरी तरह ठीक हो सकता है।"
    },
    {
        "id": 2,
        "myth": "Rehabilitation centers lock people away and use harsh punishment.",
        "myth_hi": "नशा मुक्ति केंद्र लोगों को बंद करके सजा देते हैं।",
        "fact": "Modern accredited IRCAs (Integrated Rehabilitation Centres) and hospital departments adhere to strict humane clinical guidelines, focusing on therapy, yoga, counseling, and respectful care.",
        "fact_hi": "आधुनिक मान्यता प्राप्त पुनर्वास केंद्र वैज्ञानिक चिकित्सा, काउंसलिंग, योग और मानवीय सम्मान पर आधारित चिकित्सा प्रदान करते हैं।"
    },
    {
        "id": 3,
        "myth": "If someone relapses, their recovery has completely failed.",
        "myth_hi": "यदि किसी से दोबारा चूक (relapse) हो जाए, तो सब कुछ खत्म हो जाता है।",
        "fact": "Relapse is often a common part of the chronic recovery learning curve. It signals a need to adjust coping strategies or support triggers, not that the person has failed.",
        "fact_hi": "रिकवरी के दौरान चूक होना सीखने का हिस्सा हो सकता है। यह असफलता नहीं, बल्कि नए सिरे से संकल्प को मजबूत करने और ट्रिगर्स को समझने का अवसर है।"
    },
    {
        "id": 4,
        "myth": "Seeking counseling or calling helplines will leak your identity to the police or employers.",
        "myth_hi": "हेल्पलाइन पर कॉल करने से पुलिस या दफ्तर में पता चल जाएगा।",
        "fact": "National helplines like Tele-MANAS (14416) and Nasha Mukti (14446) are strictly confidential and toll-free. They do not report callers to police or employers.",
        "fact_hi": "टेली-मानस (14416) और राष्ट्रीय नशा मुक्ति हेल्पलाइन (14446) 100% गोपनीय और सुरक्षित हैं। वे कोई भी जानकारी साझा नहीं करते।"
    }
]

PARENT_GUIDELINES = {
    "title": "Parent & Guardian Compassionate Support Sanctuary",
    "subtitle": "How to support your loved one without blame, stigma, or burnout",
    "privacy_pledge": "Sankalp Privacy Pledge: We strictly protect the dignity and privacy of individuals in recovery. Sankalp will never secretly spy, share location, or leak personal journal records to anyone.",
    "warning_signs": [
        "Unexplained withdrawal from family dinners, hobbies, and social interactions",
        "Sudden shifts in sleep cycles, frequent mood swings, or extreme defensiveness",
        "Secretive behavior, sudden financial requests, or disappearing valuables",
        "Drop in academic or workplace performance and persistent fatigue"
    ],
    "communication_dos": [
        "DO pick a calm, sober moment to talk — never start difficult conversations during intoxication or withdrawal.",
        "DO speak with 'I' statements: 'I love you and I feel worried about your health' instead of 'You are ruining this family.'",
        "DO listen more than you speak. Acknowledge that they might be experiencing deep pain or fear.",
        "DO encourage them to call 14446 together or consult a counselor at an accredited center."
    ],
    "communication_donts": [
        "DON'T preach, guilt-trip, threaten, or lecture in public.",
        "DON'T enable the addiction by giving unconditional cash or lying to cover their absences.",
        "DON'T neglect your own mental health — consider joining family support groups like Al-Anon or local IRCA family counseling."
    ]
}

@router.get("/articles")
def get_articles():
    return {"articles": EDUCATIONAL_ARTICLES}

@router.get("/myths-facts")
def get_myths_facts():
    return {"myths_facts": MYTH_VS_FACTS}

@router.get("/parent-guidelines")
def get_parent_guidelines():
    return {"parent_guidelines": PARENT_GUIDELINES}
