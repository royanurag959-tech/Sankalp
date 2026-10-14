import asyncio
import pytest
from app.services.tinyfish_service import tinyfish_service

def test_tinyfish_status():
    status = tinyfish_service.get_status()
    assert "status" in status
    assert "endpoint" in status
    assert "mode" in status
    assert status["endpoint"] == "https://api.fetch.tinyfish.ai"

def test_tinyfish_input_validation():
    with pytest.raises(ValueError):
        asyncio.run(tinyfish_service.fetch_and_extract_resources([]))

    with pytest.raises(ValueError):
        asyncio.run(tinyfish_service.fetch_and_extract_resources(["not_a_valid_url"]))

def test_tinyfish_simulated_fetch():
    urls = ["https://nmba.dosje.gov.in", "https://telemanas.mohfw.gov.in"]
    results = asyncio.run(tinyfish_service.fetch_and_extract_resources(urls))
    assert len(results) == 2
    assert results[0]["needs_human_verification"] is True
    assert results[0]["verified_status"] == "Pending Human Review"
    assert "14446" in results[0]["extracted_contacts"]
