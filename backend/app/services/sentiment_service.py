"""
Sentiment service — runs FinBERT on financial news articles.
"""
import uuid
from datetime import datetime
from typing import List

from app.utils.model_loader import get_sentiment_pipeline
from app.utils.preprocess import clean_text, normalise_score, score_to_int
from app.utils.mock_data import get_articles, get_all_articles

# Simple keyword extraction (no external model needed)
_FINANCIAL_PHRASES = [
    "earnings", "revenue", "profit", "loss", "guidance", "outlook",
    "growth", "decline", "acquisition", "merger", "restructuring",
    "layoffs", "expansion", "supply chain", "inflation", "interest rate",
    "AI", "data center", "cloud", "chip", "demand", "supply",
]


def _extract_key_phrases(text: str) -> List[str]:
    text_lower = text.lower()
    return [p for p in _FINANCIAL_PHRASES if p.lower() in text_lower][:5]


def _build_breakdown(label: str, confidence: float) -> dict:
    """Distribute confidence across the three sentiment buckets."""
    remaining = round(1.0 - confidence, 3)
    half = round(remaining / 2, 3)
    if label == "positive":
        return {"positive": confidence, "neutral": half, "negative": half}
    if label == "negative":
        return {"negative": confidence, "neutral": half, "positive": half}
    return {"neutral": confidence, "positive": half, "negative": half}


def analyze_ticker(ticker: str, mode: str) -> dict:
    pipe = get_sentiment_pipeline()
    articles = get_articles(ticker)

    # Fall back to all articles if ticker has nothing specific
    if not articles:
        articles = get_all_articles()[:6]

    results = []
    for art in articles:
        text = clean_text(art["headline"] + ". " + art["content"])[:512]
        out = pipe(text)[0]
        label = out["label"].lower()
        conf = round(out["score"], 4)

        results.append({
            "id": art["id"],
            "ticker": art["ticker"],
            "headline": art["headline"],
            "source": art["source"],
            "timestamp": art["timestamp"],
            "sentiment": label,
            "confidence": conf,
            "score": score_to_int(label),
            "key_phrases": _extract_key_phrases(art["content"]),
            "breakdown": _build_breakdown(label, conf),
        })

    # Aggregate metrics
    confs = [r["confidence"] for r in results]
    avg_conf = round(sum(confs) / len(confs), 4) if confs else 0.0
    bull = sum(1 for r in results if r["sentiment"] == "positive")
    bear = sum(1 for r in results if r["sentiment"] == "negative")
    neu  = sum(1 for r in results if r["sentiment"] == "neutral")

    # Volatility = std-dev of scores mapped to 0-100
    scores = [r["score"] for r in results]
    mean_s = sum(scores) / len(scores) if scores else 0
    variance = sum((s - mean_s) ** 2 for s in scores) / len(scores) if scores else 0
    volatility = round(variance ** 0.5 * 50, 1)  # scale to 0-50 range

    return {
        "ticker": ticker.upper(),
        "mode": mode,
        "articles": results,
        "metrics": {
            "average_confidence": avg_conf,
            "bullish_count": bull,
            "bearish_count": bear,
            "neutral_count": neu,
            "volatility_index": volatility,
        },
    }
