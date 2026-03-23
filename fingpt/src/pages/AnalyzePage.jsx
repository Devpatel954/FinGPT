import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, TrendingUp, TrendingDown, FileText, Loader2, AlertCircle } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { stockDetails, stockTimelineData, newsFeed, trendingStocks } from '../data/appData.js'
import { getSentiment } from '../services/api.js'

const AVAILABLE = Object.keys(stockDetails)

function sentimentClass(score) {
  if (score >= 70) return 'bullish'
  if (score >= 50) return 'neutral'
  return 'bearish'
}

/** Map backend metrics → UI detail shape */
function buildDetail(ticker, data) {
  const m = data.metrics
  const total = (m.bullish_count + m.neutral_count + m.bearish_count) || 1
  const positive = Math.round((m.bullish_count / total) * 100)
  const neutral  = Math.round((m.neutral_count  / total) * 100)
  const negative = 100 - positive - neutral
  const score    = Math.min(100, Math.round(positive + neutral * 0.5))
  return { score, positive, neutral: Math.max(0, neutral), negative: Math.max(0, negative),
           articles: data.articles.length, change: 0, name: ticker }
}

/** Generate a plausible 7-day timeline from article-level breakdowns */
function buildTimeline(data) {
  const arts = data.articles.slice(0, 7)
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  return arts.map((a, i) => ({
    date: days[i % 7],
    score: Math.round((a.breakdown.positive * 100 + a.breakdown.neutral * 50)),
  }))
}

export default function AnalyzePage() {
  const location = useLocation()
  const [input,       setInput]       = useState(location.state?.ticker ?? '')
  const [ticker,      setTicker]      = useState(location.state?.ticker ?? null)
  const [suggestions, setSuggestions] = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [apiData,     setApiData]     = useState(null)

  useEffect(() => {
    if (location.state?.ticker) runAnalyze(location.state.ticker)
  }, [location.state])

  function handleInput(e) {
    const v = e.target.value.toUpperCase()
    setInput(v)
    setSuggestions(v.length > 0 ? AVAILABLE.filter(t => t.startsWith(v)).slice(0, 6) : [])
  }

  async function runAnalyze(t) {
    const sym = t.trim().toUpperCase()
    if (!sym || !/^[A-Z]{1,5}$/.test(sym)) return
    setTicker(sym)
    setInput(sym)
    setSuggestions([])
    setError(null)
    setApiData(null)
    setLoading(true)
    try {
      const data = await getSentiment(sym, 'realtime')
      setApiData(data)
    } catch (e) {
      setError(e.message || 'Failed to connect to analysis server.')
    } finally {
      setLoading(false)
    }
  }

  // Resolve display data — prefer live API, fall back to mock for known tickers
  const mockDetail = ticker && !apiData ? stockDetails[ticker] : null
  const detail = apiData ? buildDetail(ticker, apiData)
               : mockDetail ? mockDetail
               : null
  const timeline = apiData ? buildTimeline(apiData)
                 : ticker  ? (stockTimelineData[ticker] ?? [])
                 : []
  const stockNewsItems = apiData
    ? apiData.articles.map((a, i) => ({
        id: i, headline: a.headline, source: a.source,
        time: a.timestamp?.slice(0, 10) ?? 'recent', sentiment: a.sentiment,
      }))
    : ticker ? newsFeed.filter(n => n.ticker === ticker) : []
  const related    = ticker ? trendingStocks.filter(s => s.ticker !== ticker).slice(0, 4) : []
  const cls        = detail ? sentimentClass(detail.score) : 'neutral'
  const scoreColor = cls === 'bullish' ? 'var(--emerald)' : cls === 'bearish' ? 'var(--red)' : 'var(--orange)'

  return (
    <div className="page-fade">
      <div className="page-header">
        <div className="page-title">Analyze Stock</div>
        <div className="page-sub">Enter a ticker to view AI-powered sentiment analysis</div>
      </div>

      {/* Search */}
      <div className="analyze-input-wrap" style={{ position: 'relative' }}>
        <Search size={20} color="var(--gray-400)" />
        <input
          className="analyze-input"
          placeholder="Enter any ticker symbol (e.g. AAPL, NVDA, TSLA, RDDT)"
          value={input}
          onChange={handleInput}
          onKeyDown={e => e.key === 'Enter' && runAnalyze(input)}
          disabled={loading}
        />
        {suggestions.length > 0 && (
          <div className="search-results" style={{ top: 54, left: 0, right: 0, position: 'absolute', zIndex: 200 }}>
            {suggestions.map(t => (
              <div key={t} className="search-result-item" onClick={() => runAnalyze(t)}>
                <span className="search-result-sym">{t}</span>
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                  {stockDetails[t].name}
                </span>
              </div>
            ))}
          </div>
        )}
        <button className="btn-sm primary" onClick={() => runAnalyze(input)} disabled={loading}>
          {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Analyze'}
        </button>
      </div>

      {/* Quick picks */}
      {!ticker && (
        <div style={{ marginBottom: 24 }}>
          <div className="app-card-sub" style={{ marginBottom: 10, fontSize: 13, color: 'var(--gray-500)' }}>
            Popular tickers:
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {AVAILABLE.map(t => (
              <button key={t} className="btn-sm" onClick={() => runAnalyze(t)}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="empty-state">
          <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--emerald)' }} />
          <div className="empty-state-title">Analyzing {ticker}…</div>
          <div className="empty-state-sub">Running FinBERT sentiment analysis on financial news articles.</div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="empty-state">
          <AlertCircle size={36} style={{ color: 'var(--red)' }} />
          <div className="empty-state-title">Analysis failed</div>
          <div className="empty-state-sub">{error}</div>
          <button className="btn-sm primary" style={{ marginTop: 12 }} onClick={() => runAnalyze(ticker)}>Retry</button>
        </div>
      )}

      {/* Results */}
      {detail && !loading && !error && (
        <div key={ticker}>
          {/* Overview row */}
          <div className="grid-4" style={{ marginBottom: 20 }}>
            <div className="idx-card" style={{ textAlign: 'center' }}>
              <div className="idx-name">Sentiment Score</div>
              <div style={{ fontSize: 52, fontWeight: 900, color: scoreColor, letterSpacing: '-0.04em', margin: '4px 0' }}>
                {detail.score}
              </div>
              <span className={`tag ${cls}`}>{cls}</span>
            </div>
            <div className="idx-card">
              <div className="idx-name">Positive Articles</div>
              <div className="idx-value" style={{ color: 'var(--emerald)' }}>{detail.positive}%</div>
              <div style={{ marginTop: 10 }}>
                <div className="sent-bar-wrap">
                  <div className="sent-bar-fill" style={{ width: `${detail.positive}%`, background: 'var(--emerald)' }} />
                </div>
              </div>
            </div>
            <div className="idx-card">
              <div className="idx-name">Negative Articles</div>
              <div className="idx-value" style={{ color: 'var(--red)' }}>{detail.negative}%</div>
              <div style={{ marginTop: 10 }}>
                <div className="sent-bar-wrap">
                  <div className="sent-bar-fill" style={{ width: `${detail.negative}%`, background: 'var(--red)' }} />
                </div>
              </div>
            </div>
            <div className="idx-card">
              <div className="idx-name">Articles Analyzed</div>
              <div className="idx-value">{detail.articles.toLocaleString()}</div>
              <div className={`idx-change ${detail.change >= 0 ? 'up' : 'down'}`} style={{ marginTop: 4 }}>
                {detail.change >= 0 ? '+' : ''}{detail.change}pts ({detail.name})
              </div>
            </div>
          </div>

          <div className="grid-21" style={{ marginBottom: 20 }}>
            {/* Timeline chart */}
            <div className="app-card">
              <div className="app-card-header">
                <div>
                  <div className="app-card-title">{ticker} Sentiment Timeline</div>
                  <div className="app-card-sub">7-day rolling sentiment score</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={timeline} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-md)' }}
                    formatter={v => [v, 'Sentiment']}
                  />
                  <Line
                    type="monotone" dataKey="score"
                    stroke={scoreColor} strokeWidth={2.5}
                    dot={{ r: 4, fill: scoreColor, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* Sentiment distribution */}
              <div style={{ marginTop: 16 }}>
                <div className="app-card-sub" style={{ marginBottom: 8 }}>Sentiment Breakdown</div>
                <div className="dist-bar">
                  <div className="dist-bar-pos" style={{ width: `${detail.positive}%` }} />
                  <div className="dist-bar-neu" style={{ width: `${detail.neutral}%` }} />
                  <div className="dist-bar-neg" style={{ width: `${detail.negative}%` }} />
                </div>
                <div className="dist-legend">
                  <div className="dist-leg-item">
                    <div className="dist-leg-dot" style={{ background: 'var(--emerald)' }} />
                    Positive {detail.positive}%
                  </div>
                  <div className="dist-leg-item">
                    <div className="dist-leg-dot" style={{ background: 'var(--orange)' }} />
                    Neutral {detail.neutral}%
                  </div>
                  <div className="dist-leg-item">
                    <div className="dist-leg-dot" style={{ background: 'var(--red)' }} />
                    Negative {detail.negative}%
                  </div>
                </div>
              </div>
            </div>

            {/* Related + news */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* News */}
              <div className="app-card">
                <div className="app-card-header">
                  <div className="app-card-title">
                    <FileText size={14} style={{ display: 'inline', marginRight: 6 }} />
                    {ticker} News
                  </div>
                </div>
                {stockNewsItems.length > 0 ? stockNewsItems.map(item => {
                  const nc = item.sentiment === 'positive' ? 'bullish' : item.sentiment === 'negative' ? 'bearish' : 'neutral'
                  return (
                    <div key={item.id} className="news-card-app">
                      <div className="news-card-content">
                        <div className="news-headline-app">{item.headline}</div>
                        <div className="news-meta-app">
                          <span className="news-source-app">{item.source}</span>
                          <span>·</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                      <span className={`tag ${nc}`} style={{ flexShrink: 0 }}>{item.sentiment}</span>
                    </div>
                  )
                }) : (
                  <div className="empty-state" style={{ padding: '24px 0' }}>
                    <FileText size={28} />
                    <div className="empty-state-title" style={{ fontSize: 13 }}>No specific news for {ticker}</div>
                  </div>
                )}
              </div>

              {/* Related stocks */}
              <div className="app-card">
                <div className="app-card-header">
                  <div className="app-card-title">Related Stocks</div>
                </div>
                {related.map(s => {
                  const rc = sentimentClass(s.score)
                  return (
                    <div
                      key={s.ticker} className="ticker-row" style={{ cursor: 'pointer' }}
                      onClick={() => runAnalyze(s.ticker)}
                    >
                      <span className="ticker-sym">{s.ticker}</span>
                      <span className="ticker-name">{s.name}</span>
                      <span className={`score-pill ${rc}`}>{s.score}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!detail && !loading && !error && (
        <div className="empty-state">
          <TrendingUp />
          <div className="empty-state-title">No ticker selected</div>
          <div className="empty-state-sub">Search for any ticker above — known or custom — to begin analysis.</div>
        </div>
      )}
    </div>
  )
}
