from fastapi import APIRouter, Depends

from backend.auth import require_admin
from backend.database import get_all_leads

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/leads")
def list_leads(current_user=Depends(require_admin)):
    leads = get_all_leads()
    return {
        "leads": leads,
        "metrics": {
            "total_leads": len(leads),
            "new_leads": len([lead for lead in leads if lead.get("status") == "New"]),
            "admin": current_user["email"],
        },
    }
