// Mock data for FinGPT dashboard

export const sentimentTimelineData = [
  { date: 'Mar 11', AAPL: 72, TSLA: 45, MSFT: 68, NVDA: 81 },
  { date: 'Mar 12', AAPL: 68, TSLA: 52, MSFT: 71, NVDA: 76 },
  { date: 'Mar 13', AAPL: 75, TSLA: 38, MSFT: 65, NVDA: 88 },
  { date: 'Mar 14', AAPL: 80, TSLA: 61, MSFT: 74, NVDA: 84 },
  { date: 'Mar 15', AAPL: 77, TSLA: 55, MSFT: 79, NVDA: 91 },
  { date: 'Mar 16', AAPL: 83, TSLA: 49, MSFT: 82, NVDA: 87 },
  { date: 'Mar 17', AAPL: 79, TSLA: 63, MSFT: 77, NVDA: 93 },
];

export const sectorSentimentData = [
  { sector: 'Technology', positive: 78, neutral: 14, negative: 8 },
  { sector: 'Healthcare', positive: 62, neutral: 22, negative: 16 },
  { sector: 'Finance', positive: 55, neutral: 28, negative: 17 },
  { sector: 'Energy', positive: 41, neutral: 31, negative: 28 },
  { sector: 'Consumer', positive: 67, neutral: 20, negative: 13 },
  { sector: 'Industrials', positive: 59, neutral: 25, negative: 16 },
];

export const heatmapData = [
  { ticker: 'AAPL', score: 79, change: +2.3, volume: 'High' },
  { ticker: 'MSFT', score: 82, change: +1.8, volume: 'High' },
  { ticker: 'NVDA', score: 93, change: +5.1, volume: 'Very High' },
  { ticker: 'GOOGL', score: 71, change: -0.4, volume: 'Medium' },
  { ticker: 'AMZN', score: 68, change: +0.9, volume: 'Medium' },
  { ticker: 'META', score: 74, change: +3.2, volume: 'High' },
  { ticker: 'TSLA', score: 47, change: -4.7, volume: 'Very High' },
  { ticker: 'AMD', score: 85, change: +4.0, volume: 'High' },
  { ticker: 'NFLX', score: 61, change: -1.2, volume: 'Medium' },
  { ticker: 'JPM', score: 58, change: +0.5, volume: 'Low' },
  { ticker: 'GS', score: 52, change: -0.8, volume: 'Low' },
  { ticker: 'BA', score: 38, change: -3.1, volume: 'Medium' },
];

export const topNewsItems = [
  {
    id: 1,
    ticker: 'NVDA',
    headline: 'NVIDIA Reports Record Data Center Revenue, Beats Q4 Estimates',
    source: 'Reuters',
    time: '2h ago',
    sentiment: 'positive',
    score: 94,
  },
  {
    id: 2,
    ticker: 'AAPL',
    headline: 'Apple Vision Pro Sales Exceed Analyst Projections in Q1',
    source: 'Bloomberg',
    time: '4h ago',
    sentiment: 'positive',
    score: 81,
  },
  {
    id: 3,
    ticker: 'MSFT',
    headline: 'Microsoft Azure AI Services Expand to 12 New Markets',
    source: 'WSJ',
    time: '5h ago',
    sentiment: 'positive',
    score: 77,
  },
  {
    id: 4,
    ticker: 'TSLA',
    headline: 'Tesla Misses Delivery Targets Amid Production Slowdown',
    source: 'CNBC',
    time: '6h ago',
    sentiment: 'negative',
    score: -68,
  },
  {
    id: 5,
    ticker: 'BA',
    headline: 'Boeing Faces New FAA Scrutiny Over 737 MAX Quality Controls',
    source: 'FT',
    time: '8h ago',
    sentiment: 'negative',
    score: -74,
  },
];

export const tickers = ['AAPL', 'TSLA', 'MSFT', 'NVDA', 'GOOGL', 'META', 'AMZN'];

export const pipelineStages = [
  {
    id: 1,
    icon: 'Newspaper',
    title: 'News Ingestion',
    description: 'Real-time financial news aggregated from 50+ sources including Reuters, Bloomberg, WSJ, SEC filings, and earnings call transcripts.',
    color: 'blue',
  },
  {
    id: 2,
    icon: 'Filter',
    title: 'Data Cleaning',
    description: 'Raw text is normalized, deduplicated, and enriched with entity recognition to extract company names, tickers, and financial events.',
    color: 'purple',
  },
  {
    id: 3,
    icon: 'Brain',
    title: 'NLP Analysis',
    description: 'Fine-tuned LLM models score each article for sentiment polarity, intensity, and relevance across financial context.',
    color: 'green',
  },
  {
    id: 4,
    icon: 'BarChart2',
    title: 'Dashboard Visualization',
    description: 'Aggregated scores are rendered as interactive charts, heatmaps, and trend lines across tickers, sectors, and time ranges.',
    color: 'orange',
  },
  {
    id: 5,
    icon: 'Bell',
    title: 'User Alerts',
    description: 'Configurable spike alerts notify users via email or webhook when unusual sentiment shifts are detected for watched tickers.',
    color: 'red',
  },
];
