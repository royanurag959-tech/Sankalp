import httpx
from typing import Dict, Any, List
from app.config import settings
from app.services.safety_service import analyze_safety

EMPATHETIC_SYSTEM_PROMPT = """
You are "Sankalp Sathi" (संकल्प साथी), an empathetic, confidential AI recovery companion built for India's Nasha Mukt Bharat initiative.
Your mission is to provide non-judgmental, trauma-informed emotional support, evidence-based coping techniques (like urge surfing, the 15-minute delay rule, HALT - Hungry/Angry/Lonely/Tired check, 4-7-8 breathing), and encouragement for individuals facing substance use struggles and their families.

Key Guidelines:
1. Tone: Compassionate, respectful, culturally sensitive, non-blaming, and hopeful. Never shame, judge, or lecture.
2. Language: Naturally support English, Hindi (हिंदी), and everyday Hinglish according to how the user speaks.
3. Clinical Boundaries: You are an AI peer companion, NOT a doctor, psychiatrist, or licensed addiction medicine specialist. You do NOT diagnose, prescribe, or supervise detox.
4. Always encourage connecting with real professionals and government helplines: Tele-MANAS (14416) and National Drug De-addiction Helpline (14446).
"""

class AIService:
    def __init__(self):
        self.provider = settings.AI_PROVIDER
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY

    async def get_response(self, user_message: str, language: str = "en", history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        # Step 1: Rule-based Safety Layer
        safety_eval = analyze_safety(user_message)
        if safety_eval["is_crisis"]:
            return {
                "reply": (
                    "मैं समझ सकता हूँ कि आप इस समय अत्यधिक तनाव या दर्द से गुजर रहे हैं। आपकी सुरक्षा और जान सबसे पहले है। "
                    "कृपया तुरंत किसी पेशेवर काउंसलर से बात करें। यह सेवा पूरी तरह मुफ्त, गोपनीय और 24x7 उपलब्ध है।\n\n"
                    "I hear that you are in deep distress or danger right now. Please know you are not alone. "
                    "I urge you to connect immediately with India's free, 24x7 crisis helplines below. Real human counselors are waiting to support you without judgment."
                ),
                "is_crisis": True,
                "crisis_banner": safety_eval["banner"],
                "suggested_resources": [
                    {"name": "Tele-MANAS (Govt of India)", "phone": "14416", "type": "Psychological Crisis Helpline"},
                    {"name": "Nasha Mukti Helpline", "phone": "14446", "type": "Substance De-addiction Helpline"},
                    {"name": "Emergency Services", "phone": "112", "type": "Ambulance & Police"}
                ],
                "mode": "safety_override",
                "disclaimer": "Sankalp Sathi is an AI companion and cannot handle clinical or life-threatening emergencies. Please call 14416 or 112 immediately."
            }

        # Step 2: Try Live Gemini API if key is configured
        if self.gemini_key and len(self.gemini_key) > 5:
            try:
                reply = await self._call_gemini(user_message, language, history)
                return {
                    "reply": reply,
                    "is_crisis": False,
                    "mode": "gemini_live",
                    "disclaimer": "AI companion response. Not a medical or clinical diagnosis."
                }
            except Exception:
                pass # Gracefully fall back to demo mode

        # Step 3: Default Smart Contextual Demo Mode
        reply = self._generate_contextual_demo_reply(user_message, language)
        return {
            "reply": reply,
            "is_crisis": False,
            "mode": "demo",
            "disclaimer": "Demonstration AI mode. Sankalp Sathi offers empathetic support and evidence-based coping tips; not a substitute for clinical advice."
        }

    async def _call_gemini(self, user_message: str, language: str, history: List[Dict[str, str]] = None) -> str:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
        prompt = f"{EMPATHETIC_SYSTEM_PROMPT}\nUser preferred language: {language}\nUser message: {user_message}"
        payload = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            data = resp.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]

    def _generate_contextual_demo_reply(self, message: str, language: str) -> str:
        msg = message.lower()
        is_hindi = language == "hi" or any(w in msg for w in ["kya", "kaise", "hai", "mujhe", "madad", "chhodna", "lat", "nasha", "sharab", "bhai"])

        # Craving or urge scenario
        if any(w in msg for w in ["craving", "urge", "mann kar raha", "talab", "relapse", "smoke", "drink", "alcohol", "weed"]):
            if is_hindi:
                return (
                    "यह तड़प (craving) स्वाभाविक है, पर याद रखें: यह एक लहर की तरह है — यह उठेगी और 15-20 मिनट में शांत हो जाएगी (Urge Surfing)।\n\n"
                    "तुरंत ये 3 कदम आजमाएं:\n"
                    "1. एक गिलास ठंडा पानी घूंट-घूंट करके पिएं।\n"
                    "2. 4-7-8 गहरी सांस लें (4 सेकंड सांस लें, 7 सेकंड रोकें, 8 सेकंड में धीरे छोड़ें)।\n"
                    "3. अभी किसी ऐसे दोस्त या मेंटर को कॉल करें जो आपके सफर में मदद कर सके।\n\n"
                    "आप इस पल को पार कर सकते हैं। आपका संकल्प मजबूत है।"
                )
            else:
                return (
                    "I hear you. Experiencing a craving is completely natural during recovery, but remember: cravings are like ocean waves — they crest, peak, and fade within 15 to 20 minutes (Urge Surfing).\n\n"
                    "Try these three grounding steps right now:\n"
                    "1. Drink a glass of cold water slowly.\n"
                    "2. Practice the 4-7-8 breathing exercise in our Wellness Tools tab.\n"
                    "3. Use the 'Delay 15 Minutes' technique: tell yourself 'I will just wait 15 minutes before making any choice.'\n\n"
                    "You've shown tremendous bravery just by talking about it. You can ride this wave out."
                )

        # Guilt, shame, or relapse setback
        if any(w in msg for w in ["guilt", "shame", "failed", "relapsed", "galti", "tut gaya", "himmat har gaya", "cheat"]):
            if is_hindi:
                return (
                    "कृपया खुद को दोषी न ठहराएं। रिकवरी एक सीधी रेखा नहीं होती, इसमें कभी-कभी उतार-चढ़ाव आते हैं। एक बार की चूक का मतलब यह नहीं कि आपकी सारी मेहनत बेकार हो गई।\n\n"
                    "आज एक नया दिन है। अपनी भावना को जर्नल में लिखें या टेली-मानस (14416) पर बिना किसी झिझक के काउंसलर से बात करें। हम सब आपके साथ हैं।"
                )
            else:
                return (
                    "Please be gentle with yourself. A setback or slip does not erase the strength and progress you have already built. Recovery is a journey of learning, not perfection.\n\n"
                    "What matters most is what you do right now. Be kind to yourself, check in on your triggers in the Recovery Tracker, and remember that professional support (14446 / 14416) is always one call away."
                )

        # Family / Parent support
        if any(w in msg for w in ["parent", "family", "beta", "brother", "bhai", "sister", "dost", "friend", "help someone"]):
            if is_hindi:
                return (
                    "परिवार का सहयोग रिकवरी में सबसे बड़ी ताकत होता है। जब भी उनसे बात करें:\n"
                    "• दोषारोपण या गुस्से के बजाय सहानुभूति से बात करें ('मुझे तुम्हारी चिंता है' कहें, न कि 'तुमने सब बर्बाद कर दिया')।\n"
                    "• धैर्य रखें और उन्हें पेशेवर रीहैब या काउंसलिंग के लिए प्रोत्साहित करें।\n"
                    "• हमारे 'Parent & Family' सेक्शन में विस्तृत गाइड उपलब्ध है।"
                )
            else:
                return (
                    "Supporting a loved one through addiction requires immense patience and empathy. Avoid confrontational blaming; instead, use 'I' statements expressing care rather than anger.\n\n"
                    "Encourage them gently to take our confidential self-assessment or speak to a counselor on 14446. Check out our 'Parent & Guardian' resources for healthy boundary guidelines."
                )

        # Default supportive response
        if is_hindi:
            return (
                "नमस्ते! मैं संकल्प साथी हूँ। मैं आपके साथ बिना किसी फैसले (non-judgmental) के बात करने के लिए यहाँ हूँ।\n\n"
                "चाहे आप अपनी दिनचर्या, तनाव, क्रेविंग या किसी अपने की मदद के बारे में बात करना चाहें, मैं सुनने के लिए तैयार हूँ। आप आज कैसा महसूस कर रहे हैं?"
            )
        else:
            return (
                "Hello! I am Sankalp Sathi, your compassionate peer recovery companion. I am here to listen without judgment.\n\n"
                "Whether you want to talk about stress, managing cravings, finding verified rehabilitation centers in India, or just taking a breath, I'm right here with you. How are you feeling today?"
            )

ai_service = AIService()
