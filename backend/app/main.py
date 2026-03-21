import logging

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

from app.routes import alerts, earnings, keywords, prediction, search, sentiment
from app.utils.model_loader import get_sentiment_pipeline

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
        "https://fin-gpt-murex.vercel.app",  # Vercel prod
        "https://*.vercel.app",               # Vercel preview URLs
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
    """Warm up VADER on startup so the first request is instant."""
    logger.info("Pre-loading VADER sentiment analyzer …")
    get_sentiment_pipeline()
    logger.info("VADER ready.")


# ── Health check ──────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health():
    return {"status": "ok"}


@app.get("/", tags=["health"])
async def root():
    return {"message": "FinGPT API is running. Visit /docs for the interactive API docs."}
