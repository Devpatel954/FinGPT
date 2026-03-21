from fastapi import APIRouter, Query, HTTPException

from app.services.prediction_service import predict_ticker

router = APIRouter(prefix="/prediction", tags=["prediction"])

_VALID_RANGES = {"7d", "14d", "30d"}


@router.get("/")
async def get_prediction(
    ticker: str = Query(default="NVDA", description="Stock ticker symbol"),
    range: str = Query(default="7d", description="Date range: 7d | 14d | 30d"),
):
    ticker = ticker.upper().strip()
    if not ticker.isalpha() or len(ticker) > 5:
        raise HTTPException(status_code=422, detail="Invalid ticker symbol")
    if range not in _VALID_RANGES:
        raise HTTPException(status_code=422, detail=f"range must be one of {_VALID_RANGES}")
    try:
        return predict_ticker(ticker, range)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
