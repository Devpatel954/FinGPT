"""
Prediction service — aggregates sentiment trends and simulates price correlation.
Uses pandas for EMA smoothing and correlation, numpy for numerical ops.
"""
import random
from datetime import datetime, timedelta

import pandas as pd

from app.utils.model_loader import get_sentiment_pipeline
from app.utils.preprocess import clean_text, normalise_score
from app.utils.mock_data import get_articles, get_all_articles

# Seeded base prices per ticker
_BASE_PRICES = {
    "NVDA": 875.0, "TSLA": 215.0, "AAPL": 192.0,
    "MSFT": 420.0, "META": 505.0, "GOOGL": 175.0,
    "AMD": 165.0,  "AMZN": 185.0, "NFLX": 650.0,
    "JPM": 202.0,  "BA": 175.0,   "GS": 465.0,
}
_RANGE_DAYS = {"7d": 7, "14d": 14, "30d": 30}


def _generate_price_series(base: float, sentiment_trend: list, days: int) -> list:
    """
    Simulate a price series influenced by sentiment scores.
    Sentiment score in [-1, 1] nudges the random walk.
    """
    series = []
    price = base
    dt = datetime.utcnow() - timedelta(days=days)
    for i in range(days):
        sent = sentiment_trend[i] if i < len(sentiment_trend) else 0.0
        drift = sent * 0.005        # sentiment nudge
        noise = random.gauss(0, 0.012)  # daily volatility ~1.2%
        price = round(price * (1 + drift + noise), 2)
        series.append({
            "date": (dt + timedelta(days=i)).strftime("%Y-%m-%d"),
            "price": price,
            "sentiment": round(sent, 3),
        })
    return series


def predict_ticker(ticker: str, range_str: str) -> dict:
    random.seed(hash(ticker) % 10000)   # deterministic per ticker
    pipe = get_sentiment_pipeline()
    days = _RANGE_DAYS.get(range_str, 7)
    base = _BASE_PRICES.get(ticker.upper(), 200.0)

    articles = get_articles(ticker)
    if not articles:
        articles = get_all_articles()[:8]

    # Get sentiment scores for available articles via ML model
    raw_scores = []
    for art in articles:
        text = clean_text(art["headline"] + ". " + art["content"])[:512]
        out = pipe(text)[0]
        raw_scores.append(normalise_score(out["label"], out["score"]))

    # Cycle article scores across `days`, add small Gaussian noise
    base_trend = [
        (raw_scores[i % len(raw_scores)] if raw_scores else 0.0) + random.gauss(0, 0.05)
        for i in range(days)
    ]
    # EMA(span=3) smooths noise while preserving trend direction
    sentiment_trend = (
        pd.Series(base_trend)
        .ewm(span=3, adjust=False)
        .mean()
        .clip(-1.0, 1.0)
        .round(3)
        .tolist()
    )

    avg_sentiment = round(float(pd.Series(sentiment_trend).mean()), 4)

    # Determine direction
    if avg_sentiment > 0.15:
        direction, explanation = "bullish", (
            f"Aggregate sentiment across {len(articles)} recent news items is strongly positive. "
            "Momentum indicators suggest continued upward price pressure."
        )
    elif avg_sentiment < -0.15:
        direction, explanation = "bearish", (
            f"Negative sentiment dominates across {len(articles)} recent articles. "
            "Risk-off signals and negative news flow suggest downward pressure."
        )
    else:
        direction, explanation = "neutral", (
            f"Mixed sentiment signals detected across {len(articles)} articles. "
            "No clear directional bias — monitor for sentiment shift."
        )

    confidence = round(min(0.95, 0.50 + abs(avg_sentiment) * 1.5), 3)

    # Pearson correlation between price returns and sentiment (via pandas)
    price_series = _generate_price_series(base, sentiment_trend, days)
    prices = pd.Series([p["price"] for p in price_series])
    returns_s = prices.pct_change().dropna()
    sent_s = pd.Series(sentiment_trend[1 : len(returns_s) + 1])
    if len(returns_s) >= 3 and len(sent_s) >= 3:
        correlation = round(float(returns_s.corr(sent_s)), 3)
        if pd.isna(correlation):
            correlation = 0.0
    else:
        correlation = 0.0

    return {
        "ticker": ticker.upper(),
        "direction": direction,
        "confidence": confidence,
        "correlation": max(-1.0, min(1.0, correlation)),
        "explanation": explanation,
        "price_data": price_series,
        "sentiment_avg": avg_sentiment,
    }
