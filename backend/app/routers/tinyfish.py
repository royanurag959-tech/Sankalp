from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
import json
from datetime import datetime
from app.database import get_db
from app.models import DirectoryResource, User
from app.schemas import TinyFishFetchRequest, TinyFishFetchResult, DirectoryResourceResponse
from app.services.tinyfish_service import tinyfish_service
from app.auth import get_current_user_optional, get_current_user

router = APIRouter(prefix="/tinyfish", tags=["TinyFish API Web Verification Engine"])

@router.get("/status")
def get_tinyfish_status():
    """
    Returns verified status of the TinyFish integration:
    - Official documentation endpoint: https://api.fetch.tinyfish.ai
    - Authentication header: X-API-Key
    - Mode: live_official_api or simulated_adapter
    """
    return tinyfish_service.get_status()

@router.post("/fetch", response_model=List[TinyFishFetchResult])
async def fetch_public_resources(
    request: TinyFishFetchRequest,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Invokes TinyFish Fetch API (or simulated adapter fallback) to extract
    official helpline and rehabilitation contacts from authorized public portals.
    """
    try:
        results = await tinyfish_service.fetch_and_extract_resources(
            urls=request.urls,
            purpose=request.purpose or "Extract official de-addiction helpline details"
        )
        return [TinyFishFetchResult(**r) for r in results]
    except ValueError as val_err:
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"TinyFish service error: {str(exc)}")

@router.post("/import-to-directory", response_model=DirectoryResourceResponse)
def import_extracted_resource(
    item: TinyFishFetchResult,
    category: str = "Rehab Center",
    state: str = "All India (National)",
    city: str = "Pan-India",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Imports extracted web data into the Sankalp directory with STRICT requirement:
    Always flagged as 'Pending Human Review' before public presentation.
    """
    phone_number = item.extracted_contacts[0] if item.extracted_contacts else "14446"
    alt_phone = item.extracted_contacts[1] if len(item.extracted_contacts) > 1 else None

    new_res = DirectoryResource(
        name=item.extracted_title or f"Resource from {item.url}",
        category=category,
        phone=phone_number,
        alternate_phone=alt_phone,
        address=f"Extracted via TinyFish from official portal: {item.url}",
        state=state,
        city=city,
        operational_hours="Public Hours / Verify with Center",
        languages_json='["Hindi", "English"]',
        website=item.url,
        source_url=item.url,
        verified_status="Pending Human Review", # Human review mandatory
        verification_date=None,
        notes=f"Retrieved via TinyFish API at {item.retrieved_at}. Snippet: {item.markdown_snippet}"
    )
    db.add(new_res)
    db.commit()
    db.refresh(new_res)

    return DirectoryResourceResponse(
        id=new_res.id,
        name=new_res.name,
        category=new_res.category,
        phone=new_res.phone,
        alternate_phone=new_res.alternate_phone,
        address=new_res.address,
        state=new_res.state,
        city=new_res.city,
        operational_hours=new_res.operational_hours,
        languages=["Hindi", "English"],
        website=new_res.website,
        source_url=new_res.source_url,
        verified_status=new_res.verified_status,
        verification_date=new_res.verification_date,
        notes=new_res.notes
    )
