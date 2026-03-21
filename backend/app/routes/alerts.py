from fastapi import APIRouter, HTTPException, Path

from app.models.schemas import AlertCreateRequest
from app.utils.mock_data import add_alert, delete_alert, get_alerts

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/")
async def list_alerts():
    return {"alerts": get_alerts()}


@router.post("/", status_code=201)
async def create_alert(body: AlertCreateRequest):
    ticker = body.ticker.upper().strip()
    if not ticker.isalpha() or len(ticker) > 5:
        raise HTTPException(status_code=422, detail="Invalid ticker symbol")
    condition = body.condition.strip()
    if not condition:
        raise HTTPException(status_code=422, detail="condition must not be empty")
    alert = add_alert(ticker=ticker, condition=condition, threshold=body.threshold)
    return alert


@router.delete("/{alert_id}", status_code=204)
async def remove_alert(alert_id: str = Path(..., description="Alert UUID")):
    removed = delete_alert(alert_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Alert not found")
