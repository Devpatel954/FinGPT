"""
Singleton model loader — loads HuggingFace pipelines once at startup.
All services import from here to avoid redundant model loads.
"""
import os
import logging
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("fingpt.models")

HF_TOKEN = os.getenv("HF_TOKEN")

_sentiment_pipeline = None
_zeroshot_pipeline = None


def get_sentiment_pipeline():
    """Return cached FinBERT sentiment pipeline."""
    global _sentiment_pipeline
    if _sentiment_pipeline is None:
        logger.info("Loading FinBERT (ProsusAI/finbert)...")
        from transformers import pipeline
        _sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="ProsusAI/finbert",
            token=HF_TOKEN,
            truncation=True,
            max_length=512,
        )
        logger.info("FinBERT loaded.")
    return _sentiment_pipeline


def get_zeroshot_pipeline():
    """Return cached zero-shot classification pipeline."""
    global _zeroshot_pipeline
    if _zeroshot_pipeline is None:
        logger.info("Loading zero-shot pipeline (facebook/bart-large-mnli)...")
        from transformers import pipeline
        _zeroshot_pipeline = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            token=HF_TOKEN,
        )
        logger.info("Zero-shot pipeline loaded.")
    return _zeroshot_pipeline
