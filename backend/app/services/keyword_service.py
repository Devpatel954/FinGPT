"""
Keyword extraction service.
Uses zero-shot classification to categorise extracted phrases.
Falls back to regex pattern matching for speed on first-run.
"""
import re
from typing import List

from app.utils.model_loader import get_zeroshot_pipeline
from app.utils.preprocess import clean_text

CATEGORIES = ["Risk Factors", "M&A Signals", "Guidance Changes", "Regulatory Flags", "Positive Signals"]

# Seed phrase bank per category
_SEED_PATTERNS = {
    "Risk Factors": [
        "supply chain", "disruption", "shortage", "recall", "layoffs",
        "restructuring", "write-down", "impairment", "headwind", "uncertainty",
        "litigation", "lawsuit", "default", "downgrade", "volatile",
    ],
    "M&A Signals": [
        "acquisition", "merger", "takeover", "spin-off", "divestiture",
        "joint venture", "strategic partnership", "buyout", "deal", "consolidation",
    ],
    "Guidance Changes": [
        "guidance", "outlook", "forecast", "raised", "lowered", "revised",
        "target", "projection", "estimate", "consensus", "full-year",
    ],
    "Regulatory Flags": [
        "antitrust", "SEC", "FDA", "FTC", "GDPR", "regulation", "penalty",
        "fine", "investigation", "compliance", "enforcement", "ruling",
    ],
    "Positive Signals": [
        "record revenue", "beat", "exceeded", "strong demand", "growth",
        "expansion", "market share", "upgrade", "outperform", "momentum",
    ],
}


def _fast_extract(text: str) -> List[dict]:
    """Rule-based keyword extraction — fast, no model needed."""
    text_lower = text.lower()
    found = []
    for category, phrases in _SEED_PATTERNS.items():
        for phrase in phrases:
            for match in re.finditer(re.escape(phrase), text_lower):
                # Get surrounding context (the actual-case version)
                start, end = match.start(), match.end()
                found.append({
                    "phrase": text[start:end],
                    "category": category,
                    "weight": 0.75,
                    "start": start,
                    "end": end,
                })
    # Deduplicate by phrase+category
    seen = set()
    unique = []
    for kw in found:
        key = (kw["phrase"].lower(), kw["category"])
        if key not in seen:
            seen.add(key)
            unique.append(kw)
    return unique


def _zeroshot_categorise(phrases: List[str]) -> List[dict]:
    """Re-categorise phrases using zero-shot classification."""
    pipe = get_zeroshot_pipeline()
    results = []
    for phrase in phrases[:20]:  # limit to avoid latency spike
        out = pipe(phrase, candidate_labels=CATEGORIES)
        top_label = out["labels"][0]
        top_score = round(out["scores"][0], 4)
        results.append({
            "phrase": phrase,
            "category": top_label,
            "weight": top_score,
            "start": None,
            "end": None,
        })
    return results


def extract_keywords(text: str, use_zeroshot: bool = False) -> dict:
    cleaned = clean_text(text)

    if use_zeroshot:
        # Extract candidate ngrams first, then classify
        words = cleaned.split()
        candidates = []
        for n in (2, 3):
            for i in range(len(words) - n + 1):
                phrase = " ".join(words[i : i + n])
                if not any(w.lower() in {"the", "a", "an", "and", "or", "in", "of", "to"} for w in phrase.split()):
                    candidates.append(phrase)
        keywords = _zeroshot_categorise(list(set(candidates))[:30])
    else:
        keywords = _fast_extract(cleaned)

    # Group by category
    categories: dict = {cat: [] for cat in CATEGORIES}
    for kw in keywords:
        categories[kw["category"]].append(kw["phrase"])

    return {
        "keywords": keywords,
        "categories": categories,
        "highlighted_text": cleaned,
    }
