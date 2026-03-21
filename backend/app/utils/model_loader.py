"""
Model loader — uses VADER for lightweight, zero-download sentiment analysis.
VADER is wrapped to mimic the HuggingFace pipeline interface so all services
work without changes: pipe(text) → [{'label': str, 'score': float}]
"""
import logging

logger = logging.getLogger("fingpt.models")

_vader_analyzer = None


def _make_vader_pipe():
    """Build a VADER-backed callable that mimics HF pipeline output."""
    from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
    analyzer = SentimentIntensityAnalyzer()
    logger.info("VADER SentimentIntensityAnalyzer ready.")

    def _pipe(text: str):
        vs = analyzer.polarity_scores(str(text)[:512])
        compound = vs["compound"]
        if compound >= 0.05:
            label, conf = "positive", max(vs["pos"], 0.55)
        elif compound <= -0.05:
            label, conf = "negative", max(vs["neg"], 0.55)
        else:
            label, conf = "neutral", max(vs["neu"], 0.55)
        return [{"label": label, "score": round(min(conf, 0.99), 4)}]

    return _pipe


def get_sentiment_pipeline():
    """Return cached VADER pipeline (same interface as HF pipeline)."""
    global _vader_analyzer
    if _vader_analyzer is None:
        _vader_analyzer = _make_vader_pipe()
    return _vader_analyzer


def get_zeroshot_pipeline():
    """Stub — zero-shot model removed; keyword_service uses rule-based extraction."""
    raise RuntimeError("Zero-shot pipeline removed. Use rule-based extraction instead.")
