from fastapi import APIRouter

from backend.automation import trigger_lead_automation
from backend.database import insert_lead
from backend.schemas import LeadRequest

router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("")
def create_lead(payload: LeadRequest):
    lead = insert_lead(
        payload.name.strip(),
        payload.email.strip(),
        payload.phone.strip() if payload.phone else "",
        payload.interest.strip() if payload.interest else "",
    )
    trigger_lead_automation(lead)
    return {"message": "Lead captured successfully", "lead": lead}
