import pytest
from app.services.safety_service import analyze_safety

def test_normal_message_safety():
    res = analyze_safety("I want to learn more about breathing exercises to calm my mind.")
    assert res["is_crisis"] is False
    assert res["banner"] is None
    assert res["priority"] == "NORMAL"

def test_crisis_message_english():
    res = analyze_safety("I feel like I want to commit suicide and end my life.")
    assert res["is_crisis"] is True
    assert res["priority"] == "HIGH_EMERGENCY"
    assert res["banner"] is not None
    assert any(h["number"] == "14416" for h in res["banner"]["helplines"])

def test_crisis_message_hinglish():
    res = analyze_safety("Mujhe lagta hai ab mar jana chahta hu, bardasht nahi ho raha")
    assert res["is_crisis"] is True
    assert res["priority"] == "HIGH_EMERGENCY"

def test_overdose_detection():
    res = analyze_safety("Someone took too many pills and had an overdose, cannot breathe")
    assert res["is_crisis"] is True
    assert res["priority"] == "HIGH_EMERGENCY"
