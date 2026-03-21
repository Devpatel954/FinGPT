import logging
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routes import alerts, earnings, keywords, prediction, search, sentiment
from app.utils.model_loader import get_sentiment_pipeline, get_zeroshot_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FinGPT API",
    description="Financial NLP backend — FinBERT sentiment, keyword extraction, earnings analysis, and price prediction.",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────
app.include_router(sentiment.router)
app.include_router(prediction.router)
app.include_router(keywords.router)
app.include_router(earnings.router)
app.include_router(search.router)
app.include_router(alerts.router)


# ── Startup ───────────────────────────────────────────────
@app.on_event("startup")
async def preload_models():
    """Warm up model pipelines so the first request is not slow."""
    logger.info("Pre-loading FinBERT sentiment pipeline …")
    get_sentiment_pipeline()
    logger.info("FinBERT loaded.")
    # Zero-shot is heavy — only pre-load if explicitly enabled
    if os.getenv("PRELOAD_ZEROSHOT", "false").lower() == "true":
        logger.info("Pre-loading zero-shot pipeline …")
        get_zeroshot_pipeline()
        logger.info("Zero-shot pipeline loaded.")


# ── Health check ──────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}


@app.get("/", tags=["health"])
async def root():
    return {"message": "FinGPT API is running. Visit /docs for the interactive API docs."}
