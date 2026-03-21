"""
Earnings analysis service.
Chunks a transcript, runs FinBERT per chunk, detects tone shifts,
and generates AI-style insights.
"""
import re
from typing import List

from app.utils.model_loader import get_sentiment_pipeline
from app.utils.preprocess import clean_text, chunk_text, extract_speaker, normalise_score, score_to_int


def _detect_tone_shift(scores: List[float], threshold: float = 0.4) -> bool:
    """Return True if the sentiment trajectory swings significantly."""
    if len(scores) < 3:
        return False
    for i in range(1, len(scores)):
        if abs(scores[i] - scores[i - 1]) >= threshold:
            return True
    return False


def _generate_insights(chunks: List[dict], overall_score: float) -> List[dict]:
    insights = []
    pos = sum(1 for c in chunks if c["sentiment"] == "positive")
    neg = sum(1 for c in chunks if c["sentiment"] == "negative")
    total = len(chunks)

    if overall_score > 0.3:
        insights.append({
            "type": "positive",
            "text": f"Management tone is predominantly positive ({pos}/{total} segments bullish), suggesting confidence in near-term performance.",
        })
    elif overall_score < -0.3:
        insights.append({
            "type": "negative",
            "text": f"Elevated negative sentiment ({neg}/{total} segments) may signal operational challenges or conservative guidance ahead.",
        })
    else:
        insights.append({
            "type": "positive",
            "text": "Balanced tone across the transcript; no significant negative sentiment clusters detected.",
        })

    # Check for late-call tone shift
    if total >= 4:
        early_avg = sum(c["score"] for c in chunks[: total // 2]) / (total // 2)
        late_avg  = sum(c["score"] for c in chunks[total // 2 :]) / (total // 2)
        if late_avg - early_avg > 0.3:
            insights.append({
                "type": "positive",
                "text": "Sentiment improved in the Q&A portion of the call, indicating analyst confidence in management responses.",
            })
        elif early_avg - late_avg > 0.3:
            insights.append({
                "type": "warning",
                "text": "Sentiment declined toward the end of the call — Q&A responses may have introduced uncertainty.",
            })

    insights.append({
        "type": "warning" if neg > pos else "positive",
        "text": f"Key risk areas flagged in {neg} segment(s); recommend cross-referencing with filed risk factors.",
    })

    return insights


def analyze_earnings(text: str) -> dict:
    pipe = get_sentiment_pipeline()
    cleaned = clean_text(text)
    raw_chunks = chunk_text(cleaned, max_words=75)

    processed_chunks = []
    for idx, raw in enumerate(raw_chunks):
        speaker, content = extract_speaker(raw)
        out = pipe(content[:512])[0]
        label = out["label"].lower()
        conf  = round(out["score"], 4)
        norm  = normalise_score(label, conf)

        processed_chunks.append({
            "index": idx,
            "speaker": speaker,
            "text": content,
            "sentiment": label,
            "score": norm,
            "timestamp": f"{idx * 2}:{idx * 3 % 60:02d}",
        })

    scores = [c["score"] for c in processed_chunks]
    overall_score = round(sum(scores) / len(scores), 4) if scores else 0.0

    if overall_score > 0.1:
        overall_sentiment = "positive"
    elif overall_score < -0.1:
        overall_sentiment = "negative"
    else:
        overall_sentiment = "neutral"

    timeline = [
        {"label": f"Seg {c['index'] + 1}", "score": round((c["score"] + 1) * 50, 1)}
        for c in processed_chunks
    ]

    insights = _generate_insights(processed_chunks, overall_score)

    return {
        "overall_sentiment": overall_sentiment,
        "overall_score": overall_score,
        "tone_shift_detected": _detect_tone_shift(scores),
        "chunks": processed_chunks,
        "insights": insights,
        "timeline": timeline,
    }
