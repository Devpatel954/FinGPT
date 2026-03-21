from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import TextRequest
from app.services.keyword_service import extract_keywords

router = APIRouter(prefix="/keywords", tags=["keywords"])


@router.post("/")
async def extract_keywords_route(
    body: TextRequest,
    use_zeroshot: bool = Query(default=False, description="Enable zero-shot topic classification"),
):
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="text must not be empty")
    if len(text) > 50_000:
        raise HTTPException(status_code=422, detail="text exceeds 50 000 character limit")
    try:
        return extract_keywords(text, use_zeroshot=use_zeroshot)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
