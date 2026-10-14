# Sankalp (संकल्प) — AI-Powered Support & Recovery Companion

> **Theme**: Nasha Mukt Bharat — Help Today, A Better Tomorrow.  
> **Mission**: An empathetic, confidential, accessible, multilingual, and trauma-informed platform built for Indian youth, individuals fighting substance dependency, and their families.

---

### 🌐 Live Production Deployment
- **Live Web Application (Mobile & Desktop)**: [https://sankalp-frontend-dyy3.onrender.com](https://sankalp-frontend-dyy3.onrender.com)
- **Deployment Platform**: Render.com (Global CDN + High Availability)
- **Supported Devices**: Fully responsive on all Android, iOS, Windows, Mac, and Linux browsers.

---

## 1. Problem Statement & Solution

### The Challenge
Addiction affects millions across Indian states, but individuals and families face crippling social stigma, fear of legal repercussions, lack of accessible counselors, and difficulties finding verified government de-addiction resources (such as IRCA centers and psychiatric hospitals). Early warning signs often go unaddressed, and family members struggle with communication, unintentionally falling into blame or enabling traps.

### Our Solution
**Sankalp** acts as an empathetic digital bridge:
- **Responsible AI Self-Assessment**: Non-judgmental, screening-framework inspired questionnaire that provides personalized risk levels (Low, Mild, Moderate, High) and clear next steps without making clinical diagnoses or stigmatizing the user.
- **24/7 Empathetic AI Companion ("Sankalp Sathi")**: Supports English, Hindi (हिन्दी), and Hinglish with evidence-based urge surfing, 4-7-8 calming routines, and an independent rule-based emergency safety layer that immediately intervenes when crisis or overdose signals are detected.
- **Zero-Guilt Recovery Tracker**: Daily mood (1–5) and craving (0–10) logging, trigger chip analysis, milestone badges, and interactive trend charts. If a user slips, Sankalp reinforces that recovery is a learning journey, never displaying guilt-inducing messages.
- **Mental Wellness Tools**: Animated visual breathing coach (Box 4-4-4-4, 4-7-8 Relaxation, Calming 5-5), 5-4-3-2-1 sensory grounding for sudden urges, daily bilingual affirmations, and a private encrypted-at-rest journal.
- **Verified Directory & TinyFish Web Inspector**: Real Indian government helplines (Tele-MANAS `14416`, Nasha Mukti `14446`, Kiran `1800-599-0019`, AIIMS, NIMHANS, and regional IRCAs). Integrated with the official TinyFish Fetch API for verified public portal extraction with human-review safeguards.
- **Parent & Guardian Support Sanctuary**: Communication dos & don'ts, warning sign identification, and strict adherence to anti-surveillance privacy principles (no secret location tracking or unauthorized reading of personal journals).

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons, Recharts (data visualization).
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Pydantic v2, Python-Jose (JWT authentication), Passlib (secure password hashing).
- **Database**: SQLite (persisted zero-configuration database with indices and relational schemas) or PostgreSQL.
- **AI & Safety Architecture**: Rule-based regex emergency classifier + configurable LLM provider (Gemini / OpenAI / Empathetic Contextual Demo Engine).
- **Web Research Layer**: TinyFish Fetch API (`https://api.fetch.tinyfish.ai`) dedicated service with modular simulation fallback.
- **Testing**: Pytest (15 unit and integration tests passing with 100% success).

---

## 3. Database Schema

The database model is defined in `backend/app/models.py` with relational cascades and indexes:

| Table | Primary Fields | Purpose |
|---|---|---|
| `users` | `id`, `email`, `hashed_password`, `full_name`, `role`, `preferred_language`, `emergency_contact_phone`, `consent_given` | User credentials and privacy preferences |
| `assessment_results` | `id`, `user_id`, `total_score`, `risk_level`, `answers_json`, `recommendations_json`, `created_at` | Confidential self-reflection records |
| `recovery_checkins` | `id`, `user_id`, `checkin_date`, `mood`, `craving_intensity`, `triggers_json`, `activities_json`, `notes` | Daily habit, mood, and urge tracking |
| `recovery_goals` | `id`, `user_id`, `title`, `category`, `target_days`, `current_streak`, `is_active` | Personal sobriety and wellness milestones |
| `journal_entries` | `id`, `user_id`, `title`, `content`, `mood_tag`, `created_at` | Private reflections and coping thoughts |
| `directory_resources` | `id`, `name`, `category`, `phone`, `state`, `city`, `operational_hours`, `verified_status`, `source_url`, `verification_date` | Verified Indian helplines and IRCA centers |
| `chat_messages` | `id`, `session_id`, `user_id`, `role`, `content`, `is_crisis_flagged`, `language`, `created_at` | Dialogue history with safety audit tags |

---

## 4. TinyFish API Integration Documentation

### Overview
In accordance with the project specification, Sankalp includes a dedicated backend integration service (`app/services/tinyfish_service.py`) and API router (`app/routers/tinyfish.py`) connecting to the official TinyFish Fetch API.

### Specification & Endpoints
- **Official Fetch Endpoint**: `https://api.fetch.tinyfish.ai`
- **Authentication**: `X-API-Key: <TINYFISH_API_KEY>` header.
- **Request Format**:
  ```json
  {
    "urls": ["https://nmba.dosje.gov.in"],
    "purpose": "Extract and verify official de-addiction helpline details for Nasha Mukt Bharat directory",
    "format": "markdown"
  }
  ```
- **Response Handling**: The service parses structured markdown and JSON results, extracts verified phone contacts via regular expression analysis, and stores the source URL with retrieval timestamps.

### Safety & Clinical Compliance Guardrails
1. **Human Review Mandatory**: In strict compliance with healthcare safety rules, any resource extracted via TinyFish is tagged with `verified_status: "Pending Human Review"` before being shown as officially verified to public callers.
2. **Rate Limits & Batch Enforcements**: Input URLs are validated for HTTP/HTTPS format and capped at 5 URLs per batch.
3. **Modular Adapter & Honest Status**: If `TINYFISH_API_KEY` is not set or network errors occur, the service transparently switches to the clearly labeled `simulated_adapter` mode with genuine sample data from official portals (`nmba.dosje.gov.in`, `telemanas.mohfw.gov.in`), ensuring the application never breaks.

---

## 5. Safety, Security & Responsible AI

- **Independent Rule-Based Safety Layer**: Any incoming message containing keywords or Hinglish phrases associated with suicide, self-harm, or overdose (`"mar jana"`, `"overdose"`, `"suicide"`, `"zeher"`, `"slit"`) triggers an emergency safety override that instantly renders a crisis intervention banner with one-click direct dialing to Tele-MANAS (`14416`), Nasha Mukti (`14446`), and National Emergency (`112`).
- **No Diagnostic Claims**: The AI companion explicitly states its limitations as a peer support tool, never diagnosing psychiatric conditions or suggesting pharmaceutical adjustments.
- **Data Privacy & DPDP Compliance**:
  * Users can export their entire recovery history at any time as clean JSON (`/api/v1/auth/export-data`).
  * Permanent one-click account and data erasure (`DELETE /api/v1/auth/delete-account`).
  * Anti-Surveillance Guarantee: Zero covert tracking or secret data sharing with parents without explicit user consent.

---

## 6. Local Installation & Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Quick Start (Windows)
Double-click `start.bat` or run:
```powershell
# 1. Start Backend
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

# 2. In a separate terminal, start Frontend
cd frontend
npm.cmd install
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```
Open your browser at `http://localhost:5173`.

### Running Tests
To run all 15 automated unit and integration tests:
```powershell
cd backend
python -m pytest
```

---

## 7. Hackathon Demonstration Flow (For Evaluators & Judges)

1. **Landing Page Inspection**:
   - Notice the Nasha Mukt Bharat branding, the "Help Today, A Better Tomorrow" tagline, and the persistent 24/7 Crisis Support banner.
   - Switch language between **English** and **हिन्दी** via the top navbar.
2. **One-Click Fast Demo Login**:
   - Click "Sign In / Join" → Click **"Explore as Demo User (Aarav)"**.
   - Instantly enters the authenticated User Dashboard with active streak tracking.
3. **AI Self-Assessment**:
   - Navigate to "Self-Assessment".
   - Answer the 8 non-stigmatizing habit questions.
   - Observe the dynamic score calculation, the risk profile badge, personalized recommendations, and the clear medical disclaimer.
4. **24/7 AI Companion & Crisis Interceptor**:
   - Open "AI Companion (Sankalp Sathi)".
   - Test regular coping: Type `"I am feeling a strong craving, what should I do?"` or click a quick prompt to receive urge-surfing and 4-7-8 breathing tips.
   - Test Crisis Intervention: Type `"I feel like ending my life, cannot take it anymore"`.
   - Observe the immediate safety override: the AI companion halts standard responses and reveals the urgent emergency card with direct dials for **14416** and **14446**.
5. **Mental Wellness Sanctuary**:
   - Open "Wellness Tools" → Test the animated **Breathing Coach** with expanding visual circle and real-time countdown.
   - Test the **5-4-3-2-1 Sensory Grounding Tool** with interactive urge checkboxes.
   - Write a private entry in the **Private Journal** and view saved logs.
6. **Recovery Tracker**:
   - Open "Tracker" → Click **"Record Check-in"**.
   - Select mood (1–5), adjust the craving slider (0–10), pick trigger tags and healthy activities.
   - View the interactive Recharts area graph and the zero-guilt encouragement banner.
7. **Directory & TinyFish Web Inspector**:
   - Search for centers in Delhi, Maharashtra, Punjab, etc.
   - Click **"TinyFish Web Verifier"** → Pick the `nmba.dosje.gov.in` preset → Click **"Fetch via TinyFish"**.
   - Review extracted contacts and import to the directory with the mandatory **"Pending Human Review"** badge.
8. **Parent Sanctuary & Data Export**:
   - View the "For Parents" guide for communication dos/don'ts and privacy pledge.
   - Visit "Profile" → Click **"Export My Recovery Data (JSON)"** to download full encrypted user history.

---

## 8. Scalability, Limitations & Future Roadmap

- **Scalability**: Stateless FastAPI backend is containerized and horizontally scalable behind Nginx or AWS ALB. SQLite can be switched to PostgreSQL or Supabase with a single line change in `DATABASE_URL`.
- **Operational Costs**: Zero cost for local demo mode. In production with live LLM and TinyFish, caching repeated web queries minimizes token expenditure.
- **Limitations**: Sankalp is not a replacement for intensive inpatient psychiatric care or medically supervised detox for severe alcohol/opioid withdrawal.
- **Future Roadmap**: Multilingual voice conversations in 10+ regional Indian dialects (Bhojpuri, Marathi, Punjabi, Tamil), offline SMS/IVR fallback for rural youth, and Bluetooth integration with wearable stress monitors.
