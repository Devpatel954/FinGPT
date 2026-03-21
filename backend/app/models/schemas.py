from pydantic import BaseModel
from typing import Optional, List


# ── Request Models ─────────────────────────────────────────

class TextRequest(BaseModel):
    text: str

class SearchRequest(BaseModel):
    query: str

class AlertCreateRequest(BaseModel):
    ticker: str
    condition: str          # "Sentiment drops below" | "Sentiment rises above"
    threshold: float        # 0-100


# ── Shared sub-models ──────────────────────────────────────

class SentimentScore(BaseModel):
    label: str              # positive | negative | neutral
    confidence: float       # 0.0 – 1.0
    score: int              # -1 | 0 | 1


class ArticleSentiment(BaseModel):
    id: str
    ticker: str
    headline: str
    source: str
    timestamp: str
    sentiment: str
    confidence: float
    score: int
    key_phrases: List[str]
    breakdown: dict         # {positive: float, negative: float, neutral: float}


class SentimentMetrics(BaseModel):
    average_confidence: float
    bullish_count: int
    bearish_count: int
    neutral_count: int
    volatility_index: float


# ── Route Response Models ──────────────────────────────────

class SentimentResponse(BaseModel):
    ticker: str
    mode: str
    articles: List[ArticleSentiment]
    metrics: SentimentMetrics


class PricePoint(BaseModel):
    date: str
    price: float
    sentiment: float        # normalised -1 to 1


class PredictionResponse(BaseModel):
    ticker: str
    direction: str          # bullish | bearish | neutral
    confidence: float
    correlation: float
    explanation: str
    price_data: List[PricePoint]
    sentiment_avg: float


class Keyword(BaseModel):
    phrase: str
    category: str
    weight: float
    start: Optional[int] = None
    end: Optional[int] = None


class KeywordsResponse(BaseModel):
    keywords: List[Keyword]
    categories: dict        # {category: [keywords]}
    highlighted_text: str


class TranscriptChunk(BaseModel):
    index: int
    speaker: Optional[str]
    text: str
    sentiment: str
    score: float            # -1 to 1
    timestamp: Optional[str]


class EarningsInsight(BaseModel):
    type: str               # positive | warning | negative
    text: str


class EarningsResponse(BaseModel):
    overall_sentiment: str
    overall_score: float
    tone_shift_detected: bool
    chunks: List[TranscriptChunk]
    insights: List[EarningsInsight]
    timeline: List[dict]    # [{label, score}]


class SearchResult(BaseModel):
    id: str
    headline: str
    ticker: str
    source: str
    date: str
    context: str
    sentiment: str
    score: int
    relevance: float        # 0.0 – 1.0


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total: int


class Alert(BaseModel):
    id: str
    ticker: str
    condition: str
    threshold: float
    current_score: float
    triggered: bool
    created_at: str
    delivery: str = "email"


class AlertResponse(BaseModel):
    alerts: List[Alert]
    total: int
