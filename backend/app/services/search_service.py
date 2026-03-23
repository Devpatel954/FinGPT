"""
Semantic search service.
Ranks articles by TF-IDF cosine similarity using scikit-learn's TfidfVectorizer
(bigrams, sublinear TF, English stop-words) — significantly more accurate than
the previous hand-rolled TF-IDF implementation.
"""
import re
from typing import Optional

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from app.utils.mock_data import get_all_articles
from app.utils.model_loader import get_sentiment_pipeline


# ── Sentiment hint detection ──────────────────────────────────────────────────

_HINT_KEYWORDS = {
    "negative": {"negative", "bearish", "risk", "decline", "fall", "drop",
                 "warning", "downgrade", "loss", "recall", "crash", "plunge"},
    "positive": {"positive", "bullish", "growth", "beat", "record", "strong",
                 "upgrade", "outperform", "rally", "surge", "jump", "soar"},
}


def _sentiment_hint(query: str) -> Optional[str]:
    tokens = set(re.findall(r"[a-z]+", query.lower()))
    for label, keywords in _HINT_KEYWORDS.items():
        if tokens & keywords:
            return label
    return None


# ── Main search function ──────────────────────────────────────────────────────

def search_articles(query: str, limit: int = 10) -> dict:
    pipe = get_sentiment_pipeline()
    articles = get_all_articles()
    hint = _sentiment_hint(query)

    # Build corpus: headline + content gives richer signal than headline alone
    corpus = [a["headline"] + " " + a["content"] for a in articles]

    # Fit sklearn TF-IDF on corpus, transform both corpus and query
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        sublinear_tf=True,
        stop_words="english",
        max_features=8_000,
    )
    doc_matrix = vectorizer.fit_transform(corpus)
    query_vec  = vectorizer.transform([query])

    # Cosine similarity: shape (1, n_docs) → (n_docs,)
    sims = cosine_similarity(query_vec, doc_matrix)[0]

    # Ticker mention boost
    for i, art in enumerate(articles):
        if art["ticker"].lower() in query.lower():
            sims[i] = min(1.0, sims[i] * 1.4)

    # Rank by similarity, exclude near-zero matches
    ranked_indices = np.argsort(sims)[::-1]
    top_indices = [i for i in ranked_indices if sims[i] > 0.01][:limit]

    results = []
    for i in top_indices:
        art = articles[i]
        sim = float(sims[i])

        out = pipe(art["headline"][:512])[0]
        label = out["label"].lower()
        sent_score = round(out["score"] * 100)

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

    results.sort(key=lambda x: x["relevance"], reverse=True)

    return {
        "query": query,
        "results": results,
        "total": len(results),
    }
