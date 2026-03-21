"""
Text preprocessing utilities shared across services.
"""
import re
from typing import List


def clean_text(text: str) -> str:
    """Remove URLs, excessive whitespace, and special chars."""
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def chunk_text(text: str, max_words: int = 80) -> List[str]:
    """
    Split text into chunks of ~max_words words, respecting sentence boundaries.
    """
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    chunks, current, count = [], [], 0
    for sent in sentences:
        words = len(sent.split())
        if count + words > max_words and current:
            chunks.append(" ".join(current))
            current, count = [sent], words
        else:
            current.append(sent)
            count += words
    if current:
        chunks.append(" ".join(current))
    return chunks


def extract_speaker(line: str) -> tuple[str | None, str]:
    """
    Detect 'SPEAKER NAME: text' pattern common in earnings call transcripts.
    Returns (speaker, text).
    """
    match = re.match(r"^([A-Z][A-Z\s\.]{2,30}):\s+(.+)", line.strip())
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return None, line.strip()


def normalise_score(label: str, confidence: float) -> float:
    """
    Convert FinBERT label + confidence into a -1…1 score.
    """
    mapping = {"positive": 1.0, "negative": -1.0, "neutral": 0.0}
    direction = mapping.get(label.lower(), 0.0)
    return round(direction * confidence, 4)


def score_to_int(label: str) -> int:
    return {"positive": 1, "negative": -1, "neutral": 0}.get(label.lower(), 0)


FINANCIAL_STOP_WORDS = {
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
    "has", "have", "had", "will", "would", "could", "should", "may", "might",
    "its", "it", "this", "that", "these", "those", "said", "says", "also",
    "company", "corp", "inc", "ltd",
}
