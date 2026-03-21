"""
Semantic search service.
Ranks articles against a natural language query using a combination of:
  1. TF-IDF cosine similarity (fast, always available)
  2. Zero-shot classification for semantic re-ranking (optional)
"""
import math
import re
from typing import List

from app.utils.mock_data import get_all_articles
from app.utils.model_loader import get_sentiment_pipeline

# ── TF-IDF helpers ────────────────────────────────────────

_STOP = {
    "the","a","an","and","or","but","in","on","at","to","for","of","with",
    "by","from","as","is","was","are","were","be","has","have","had","will",
    "would","could","should","find","show","about","this","that","it","its",
    "they","their","we","our","you","your","he","she","which","who","how",
    "what","when","where","why","also","both","all","any","more","some",
}

def _tokenise(text: str) -> List[str]:
    return [w for w in re.findall(r"[a-z]+", text.lower()) if w not in _STOP and len(w) > 2]

def _tf(tokens: List[str]) -> dict:
    freq: dict = {}
    for t in tokens:
        freq[t] = freq.get(t, 0) + 1
    total = len(tokens) or 1
    return {k: v / total for k, v in freq.items()}

def _idf(docs: List[List[str]]) -> dict:
    N = len(docs)
    df: dict = {}
    for doc in docs:
        for term in set(doc):
            df[term] = df.get(term, 0) + 1
    return {term: math.log(N / (1 + count)) for term, count in df.items()}

def _cosine(vec_a: dict, vec_b: dict) -> float:
    keys = set(vec_a) & set(vec_b)
    if not keys:
        return 0.0
    dot = sum(vec_a[k] * vec_b[k] for k in keys)
    mag_a = math.sqrt(sum(v ** 2 for v in vec_a.values()))
    mag_b = math.sqrt(sum(v ** 2 for v in vec_b.values()))
    return dot / (mag_a * mag_b + 1e-9)


# ── Sentiment hint refinement ─────────────────────────────

_SENTIMENT_HINTS = {
    "negative": ["negative", "bearish", "risk", "decline", "fall", "drop", "warning", "downgrade", "loss", "recall"],
    "positive": ["positive", "bullish", "growth", "beat", "record", "strong", "upgrade", "outperform", "rally"],
}

def _sentiment_hint(query_tokens: List[str]) -> str | None:
    for label, hints in _SENTIMENT_HINTS.items():
        if any(h in query_tokens for h in hints):
            return label
    return None


# ── Main search function ──────────────────────────────────

def search_articles(query: str, limit: int = 10) -> dict:
    pipe = get_sentiment_pipeline()
    articles = get_all_articles()

    query_tokens = _tokenise(query)
    hint = _sentiment_hint(query_tokens)

    # Build corpus for IDF
    corpus_tokens = [_tokenise(a["headline"] + " " + a["content"]) for a in articles]
    idf = _idf(corpus_tokens)

    # Query TF-IDF vector
    qtf = _tf(query_tokens)
    qvec = {t: qtf[t] * idf.get(t, 0.0) for t in qtf}

    scored = []
    for i, art in enumerate(articles):
        dtf = _tf(corpus_tokens[i])
        dvec = {t: dtf[t] * idf.get(t, 0.0) for t in dtf}
        sim = _cosine(qvec, dvec)

        # Ticker mention boost
        if art["ticker"].lower() in query.lower():
            sim *= 1.4

        scored.append((sim, art))

    # Sort by similarity descending
    scored.sort(key=lambda x: x[0], reverse=True)
    top = [(sim, art) for sim, art in scored if sim > 0.0][:limit]

    results = []
    for sim, art in top:
        # Run FinBERT on headline for sentiment label
        out = pipe(art["headline"][:512])[0]
        label = out["label"].lower()
        sent_score = round(out["score"] * 100)

        # Penalise if hint doesn't match detected sentiment
        relevance = sim
        if hint and label != hint:
            relevance *= 0.6

        results.append({
            "id": art["id"],
            "headline": art["headline"],
            "ticker": art["ticker"],
            "source": art["source"],
            "date": art["timestamp"][:10],
            "context": art["content"][:200],
            "sentiment": label,
            "score": sent_score,
            "relevance": round(min(1.0, relevance * 8), 3),
        })

    # Re-sort after sentiment penalty
    results.sort(key=lambda x: x["relevance"], reverse=True)

    return {
        "query": query,
        "results": results,
        "total": len(results),
    }
