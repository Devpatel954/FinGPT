from fastapi import APIRouter, Query, HTTPException

from app.services.sentiment_service import analyze_ticker

router = APIRouter(prefix="/sentiment", tags=["sentiment"])


@router.get("/")
async def get_sentiment(
    ticker: str = Query(default="NVDA", description="Stock ticker symbol"),
    mode: str = Query(default="realtime", description="Analysis mode: realtime | historical"),
):
    ticker = ticker.upper().strip()
    if not ticker.isalpha() or len(ticker) > 5:
        raise HTTPException(status_code=422, detail="Invalid ticker symbol")
    try:
        return analyze_ticker(ticker, mode)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
