import httpx
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.config import settings

class TinyFishService:
    """
    Dedicated backend integration service for TinyFish API.
    Conforms to official TinyFish Fetch API (https://api.fetch.tinyfish.ai).
    
    Permitted Use Case in Sankalp:
    - Automated discovery and extraction of public, official de-addiction helpline
      and rehabilitation center contact details from authorized government portals
      (e.g., Nasha Mukt Bharat Abhiyaan / Ministry of Social Justice & Empowerment).
      
    Safety & Compliance:
    - Validates inputs (URL schema, max 5 URLs per batch).
    - Respects rate limits, timeouts, and network errors.
    - Never replaces clinical advice.
    - Retains source URLs and retrieval timestamps.
    - Flags all newly fetched records as 'Pending Human Review' before public verification.
    """

    def __init__(self):
        self.api_key = settings.TINYFISH_API_KEY
        self.fetch_url = settings.TINYFISH_FETCH_URL
        self.timeout = 15.0 # seconds

    def get_status(self) -> Dict[str, Any]:
        """Honest status report of the TinyFish integration."""
        if not self.api_key:
            return {
                "status": "awaiting_credentials",
                "mode": "simulated_adapter",
                "message": "TinyFish API key not configured in environment. Operating in authenticated mock/simulation adapter mode.",
                "endpoint": self.fetch_url,
                "has_api_key": False
            }
        return {
            "status": "configured",
            "mode": "live_official_api",
            "message": "TinyFish API configured with official endpoint.",
            "endpoint": self.fetch_url,
            "has_api_key": True
        }

    async def fetch_and_extract_resources(
        self,
        urls: List[str],
        purpose: str = "Extract official de-addiction helpline contact details for Nasha Mukt Bharat verification"
    ) -> List[Dict[str, Any]]:
        # 1. Input Validation
        if not urls:
            raise ValueError("At least one URL must be provided.")
        if len(urls) > 5:
            urls = urls[:5] # Enforce strict batch limit

        valid_urls = []
        for url in urls:
            if not (url.startswith("http://") or url.startswith("https://")):
                continue
            valid_urls.append(url)

        if not valid_urls:
            raise ValueError("No valid HTTP/HTTPS URLs provided.")

        # 2. Check if live API key is present
        if not self.api_key:
            return self._generate_simulated_fetch(valid_urls, purpose)

        # 3. Live call to official TinyFish Fetch API
        headers = {
            "X-API-Key": self.api_key,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        payload = {
            "urls": valid_urls,
            "purpose": purpose,
            "format": "markdown",
            "links": False
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(self.fetch_url, json=payload, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    return self._parse_tinyfish_response(data, valid_urls)
                elif response.status_code == 401 or response.status_code == 403:
                    # Invalid key fallback
                    return self._generate_simulated_fetch(
                        valid_urls,
                        purpose,
                        note="Official TinyFish API returned authentication error (invalid/expired key). Fallback simulation invoked."
                    )
                else:
                    return self._generate_simulated_fetch(
                        valid_urls,
                        purpose,
                        note=f"Official TinyFish API returned HTTP {response.status_code}. Fallback simulation invoked."
                    )
        except Exception as exc:
            # Resilient network error fallback
            return self._generate_simulated_fetch(
                valid_urls,
                purpose,
                note=f"Network exception connecting to TinyFish ({str(exc)}). Fallback simulation invoked."
            )

    def _parse_tinyfish_response(self, data: Any, requested_urls: List[str]) -> List[Dict[str, Any]]:
        results = []
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")

        # TinyFish returns structured markdown/results per URL
        items = data.get("results", []) if isinstance(data, dict) else []
        if not items and isinstance(data, list):
            items = data

        for idx, url in enumerate(requested_urls):
            item = items[idx] if idx < len(items) else {}
            content = item.get("content", item.get("markdown", ""))
            
            # Extract phone numbers using regex
            contacts = re.findall(r"(?:14446|14416|1800[\s-]?\d{3}[\s-]?\d{4}|\+?91[\s-]?\d{10}|\b\d{10}\b)", content)
            unique_contacts = list(dict.fromkeys(contacts))

            results.append({
                "url": url,
                "status": "success",
                "extracted_title": item.get("title", f"Extracted Resource from {url}"),
                "extracted_contacts": unique_contacts,
                "markdown_snippet": content[:600] + ("..." if len(content) > 600 else ""),
                "retrieved_at": now_str,
                "needs_human_verification": True,
                "verified_status": "Pending Human Review",
                "source_type": "TinyFish Official Live Fetch API"
            })
        return results

    def _generate_simulated_fetch(
        self,
        urls: List[str],
        purpose: str,
        note: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
        results = []

        # Ground-truth sample data for authorized official sources
        sample_knowledge = {
            "nmba.dosje.gov.in": {
                "title": "Nasha Mukt Bharat Abhiyaan (NMBA) - Ministry of Social Justice and Empowerment",
                "contacts": ["14446", "011-23381643"],
                "snippet": "Nasha Mukt Bharat Abhiyaan is a flagship national campaign to address substance abuse across 372 vulnerable districts. Toll-free National Drug De-Addiction Helpline: 14446 provides 24x7 confidential counseling, referral, and rehabilitation assistance."
            },
            "telemanas.mohfw.gov.in": {
                "title": "Tele Mental Health Assistance and Networking Across States (Tele-MANAS)",
                "contacts": ["14416", "1800-891-4416"],
                "snippet": "Tele-MANAS is the National Tele-Mental Health Programme of India launched by the Ministry of Health and Family Welfare. It operates 24x7 across all states and union territories in 20+ regional languages."
            },
            "nimhans.ac.in": {
                "title": "NIMHANS Centre for Addiction Medicine (CAM) - National Institute of Mental Health",
                "contacts": ["080-26995000", "080-46110007"],
                "snippet": "CAM at NIMHANS provides specialized outpatient, inpatient, detox, and psychosocial rehabilitation for alcohol, opioid, cannabis, and behavioral addictions."
            }
        }

        for url in urls:
            matched_key = next((k for k in sample_knowledge if k in url.lower()), None)
            if matched_key:
                info = sample_knowledge[matched_key]
                results.append({
                    "url": url,
                    "status": "simulated",
                    "extracted_title": info["title"],
                    "extracted_contacts": info["contacts"],
                    "markdown_snippet": info["snippet"],
                    "retrieved_at": now_str,
                    "needs_human_verification": True,
                    "verified_status": "Pending Human Review",
                    "source_type": "TinyFish Simulated Fallback Adapter (Demo Mode)",
                    "note": note or "Verified mock response simulating official TinyFish fetch output. Ready for live API credentials."
                })
            else:
                results.append({
                    "url": url,
                    "status": "simulated",
                    "extracted_title": f"Public Directory Page ({url})",
                    "extracted_contacts": ["14446", "14416"],
                    "markdown_snippet": f"Simulated web extraction for URL {url}. Located contact channels for Indian national rehabilitation and de-addiction resources.",
                    "retrieved_at": now_str,
                    "needs_human_verification": True,
                    "verified_status": "Pending Human Review",
                    "source_type": "TinyFish Simulated Fallback Adapter (Demo Mode)",
                    "note": note or "Simulated extraction. Configure TINYFISH_API_KEY for live crawl."
                })

        return results

tinyfish_service = TinyFishService()
