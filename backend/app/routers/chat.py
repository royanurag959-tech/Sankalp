from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import ChatMessage, User
from app.schemas import ChatRequest, ChatResponse
from app.auth import get_current_user_optional
from app.services.ai_service import ai_service

router = APIRouter(prefix="/chat", tags=["24/7 AI Chat Support"])

@router.post("/message", response_model=ChatResponse)
async def send_chat_message(
    chat_req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    # Save user message to database
    user_msg_record = ChatMessage(
        session_id=chat_req.session_id,
        user_id=current_user.id if current_user else None,
        role="user",
        content=chat_req.message,
        language=chat_req.language
    )
    db.add(user_msg_record)
    db.commit()

    # Generate response via AI Service (with integrated safety layer)
    ai_result = await ai_service.get_response(
        user_message=chat_req.message,
        language=chat_req.language or "en"
    )

    # Save assistant message
    asst_msg_record = ChatMessage(
        session_id=chat_req.session_id,
        user_id=current_user.id if current_user else None,
        role="assistant",
        content=ai_result["reply"],
        is_crisis_flagged=ai_result.get("is_crisis", False),
        language=chat_req.language
    )
    db.add(asst_msg_record)
    db.commit()

    return ChatResponse(
        session_id=chat_req.session_id,
        reply=ai_result["reply"],
        is_crisis=ai_result.get("is_crisis", False),
        crisis_banner=ai_result.get("crisis_banner"),
        suggested_resources=ai_result.get("suggested_resources", []),
        mode=ai_result.get("mode", "demo"),
        disclaimer=ai_result.get("disclaimer", "AI emotional support assistant.")
    )

@router.get("/history/{session_id}")
def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    return {
        "session_id": session_id,
        "messages": [
            {
                "id": m.id,
                "role": m.role,
                "content": m.content,
                "is_crisis_flagged": m.is_crisis_flagged,
                "created_at": m.created_at
            } for m in messages
        ]
    }
