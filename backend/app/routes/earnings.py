from fastapi import APIRouter, HTTPException

from app.models.schemas import TextRequest
from app.services.earnings_service import analyze_earnings

router = APIRouter(prefix="/earnings", tags=["earnings"])


@router.post("/")
async def analyze_earnings_route(body: TextRequest):
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="text must not be empty")
    if len(text) > 100_000:
        raise HTTPException(status_code=422, detail="text exceeds 100 000 character limit")
    try:
        return analyze_earnings(text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
