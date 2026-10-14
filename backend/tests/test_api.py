import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database

# Ensure database tables and seed data exist for test execution
Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "Sankalp" in data["project"]
    assert "Nasha Mukt Bharat" in data["theme"]

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_guest_demo_login():
    response = client.post("/api/v1/auth/guest-demo")
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "demo@sankalp.in"

def test_assessment_questions():
    response = client.get("/api/v1/assessment/questions")
    assert response.status_code == 200
    data = response.json()
    assert len(data["questions"]) >= 5

def test_assessment_submit_low_risk():
    answers = [
        {"question_id": i, "question_text": f"Q{i}", "selected_option_index": 0, "selected_option_text": "Never", "score": 0}
        for i in range(1, 9)
    ]
    response = client.post("/api/v1/assessment/submit", json={"answers": answers})
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "Low"
    assert "disclaimer" in data

def test_assessment_submit_high_risk():
    answers = [
        {"question_id": i, "question_text": f"Q{i}", "selected_option_index": 3, "selected_option_text": "Daily", "score": 4}
        for i in range(1, 9)
    ]
    response = client.post("/api/v1/assessment/submit", json={"answers": answers})
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "High"
    assert "14446" in data["immediate_action"]

def test_directory_listing_and_search():
    response = client.get("/api/v1/directory/resources")
    assert response.status_code == 200
    resources = response.json()
    assert len(resources) > 0
    # National helpline exists
    assert any("Tele-MANAS" in r["name"] or "14416" in r["phone"] for r in resources)

def test_wellness_endpoints():
    resp_aff = client.get("/api/v1/wellness/affirmations")
    assert resp_aff.status_code == 200
    assert len(resp_aff.json()["affirmations"]) > 0

    resp_br = client.get("/api/v1/wellness/breathing-guides")
    assert resp_br.status_code == 200
    assert "exercises" in resp_br.json()
