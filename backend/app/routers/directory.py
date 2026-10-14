from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
import json
from datetime import datetime
from app.database import get_db
from app.models import DirectoryResource, User
from app.schemas import DirectoryResourceCreate, DirectoryResourceResponse
from app.auth import get_current_user_optional, get_current_user

router = APIRouter(prefix="/directory", tags=["Community & Helpline Directory"])

@router.get("/resources", response_model=List[DirectoryResourceResponse])
def get_directory_resources(
    query: Optional[str] = None,
    category: Optional[str] = None,
    state: Optional[str] = None,
    verified_only: bool = False,
    db: Session = Depends(get_db)
):
    q = db.query(DirectoryResource)

    if verified_only:
        q = q.filter(DirectoryResource.verified_status == "Verified")

    if category and category != "All":
        q = q.filter(DirectoryResource.category == category)

    if state and state != "All":
        q = q.filter(or_(DirectoryResource.state == state, DirectoryResource.state == "All India (National)"))

    if query:
        search_fmt = f"%{query}%"
        q = q.filter(
            or_(
                DirectoryResource.name.ilike(search_fmt),
                DirectoryResource.city.ilike(search_fmt),
                DirectoryResource.state.ilike(search_fmt),
                DirectoryResource.notes.ilike(search_fmt)
            )
        )

    resources = q.all()

    result = []
    for r in resources:
        langs = json.loads(r.languages_json or "[]")
        result.append(DirectoryResourceResponse(
            id=r.id,
            name=r.name,
            category=r.category,
            phone=r.phone,
            alternate_phone=r.alternate_phone,
            address=r.address,
            state=r.state,
            city=r.city,
            operational_hours=r.operational_hours,
            languages=langs,
            website=r.website,
            source_url=r.source_url,
            verified_status=r.verified_status,
            verification_date=r.verification_date,
            notes=r.notes
        ))
    return result

@router.post("/resources", response_model=DirectoryResourceResponse)
def submit_resource(
    res_in: DirectoryResourceCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Submissions from users or public contributors are tagged 'Pending Human Review'
    to prevent unverified or harmful directory listings.
    """
    new_res = DirectoryResource(
        name=res_in.name,
        category=res_in.category,
        phone=res_in.phone,
        alternate_phone=res_in.alternate_phone,
        address=res_in.address,
        state=res_in.state,
        city=res_in.city,
        operational_hours=res_in.operational_hours,
        languages_json=json.dumps(res_in.languages),
        website=res_in.website,
        source_url=res_in.source_url,
        verified_status="Pending Human Review", # Strict compliance: never auto-verify
        verification_date=None,
        notes=res_in.notes
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
        languages=res_in.languages,
        website=new_res.website,
        source_url=new_res.source_url,
        verified_status=new_res.verified_status,
        verification_date=new_res.verification_date,
        notes=new_res.notes
    )

@router.put("/verify/{resource_id}")
def verify_resource_status(
    resource_id: int,
    status: str = "Verified",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Human review confirmation endpoint."""
    res = db.query(DirectoryResource).filter(DirectoryResource.id == resource_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found.")

    res.verified_status = status
    if status == "Verified":
        res.verification_date = datetime.utcnow().strftime("%Y-%m-%d")
    db.commit()
    return {"status": "success", "message": f"Resource status updated to {status}."}
