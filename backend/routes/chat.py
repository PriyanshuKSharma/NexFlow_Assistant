from fastapi import APIRouter, Depends

from backend.ai import get_ai_response
from backend.auth import get_current_user
from backend.schemas import ChatRequest

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("")
def chat(payload: ChatRequest, current_user=Depends(get_current_user)):
    return {
        "reply": get_ai_response(payload.message),
        "user": {
            "id": current_user["id"],
            "name": current_user["name"],
        },
    }
