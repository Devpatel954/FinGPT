from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import SearchRequest
from app.services.search_service import search_articles

router = APIRouter(prefix="/search", tags=["search"])


@router.post("/")
async def search_route(
    body: SearchRequest,
    limit: int = Query(default=10, ge=1, le=50, description="Max results to return"),
):
    query = body.query.strip()
    if not query:
        raise HTTPException(status_code=422, detail="query must not be empty")
    if len(query) > 500:
        raise HTTPException(status_code=422, detail="query exceeds 500 character limit")
    try:
        return search_articles(query, limit=limit)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
