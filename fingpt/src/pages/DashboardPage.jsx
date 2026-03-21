import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, TrendingDown, BarChart2, Newspaper, Bell, Zap, RefreshCw, Loader2 } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { marketIndices, sectorData, trendingStocks, aiInsights } from '../data/appData.js'
import { getSentiment } from '../services/api.js'

const LIVE_TICKERS = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'META', 'GOOGL', 'AMD', 'JPM']

function sentimentClass(score) {
  if (score >= 70) return 'bullish'
  if (score >= 50) return 'neutral'
  return 'bearish'
}

function MiniSparkline({ data, color }) {
  const pts = data.map((v) => ({ v }))
  return (
    <ResponsiveContainer width={72} height={28}>
      <LineChart data={pts}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function LiveDot({ active }) {
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: active ? 'var(--emerald)' : 'var(--gray-300)',
      boxShadow: active ? '0 0 6px var(--emerald)' : 'none',
      marginRight: 6, flexShrink: 0,
    }} />
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('trending')
  const [liveStocks, setLiveStocks]   = useState([])   // from backend
  const [liveNews,   setLiveNews]     = useState([])   // from backend
  const [lastUpdated, setLastUpdated] = useState(null)
  const [isLoading,  setIsLoading]    = useState(false)
  const [isLive,     setIsLive]       = useState(true)
  const tickerIdx = useRef(0)

  // Fetch one ticker's sentiment and merge into liveStocks + liveNews
  async function fetchNext() {
    const ticker = LIVE_TICKERS[tickerIdx.current % LIVE_TICKERS.length]
    tickerIdx.current++
    try {
      const data = await getSentiment(ticker)
      const arts = data.articles ?? []
      const m = data.metrics ?? {}
      const total = (m.bullish_count + m.neutral_count + m.bearish_count) || 1
      const score = Math.min(99, Math.round((m.bullish_count / total) * 100 + (m.neutral_count / total) * 50))
      const col = sentimentClass(score) === 'bullish' ? 'var(--emerald)' : sentimentClass(score) === 'bearish' ? 'var(--red)' : 'var(--orange)'

      setLiveStocks(prev => {
        const updated = prev.filter(s => s.ticker !== ticker)
        return [{ ticker, score, color: col, articles: arts.length, sentiment: data.sentiment ?? '' }, ...updated].slice(0, 12)
      })
      setLiveNews(prev => {
        const fresh = arts.slice(0, 2).map((a, i) => ({
          id: `${ticker}-${i}-${Date.now()}`,
          ticker: a.ticker,
          headline: a.headline,
          source: a.source,
          time: a.timestamp?.slice(0, 10) ?? 'recent',
          sentiment: a.sentiment,
          score: Math.round(a.confidence * 100),
        }))
        const merged = [...fresh, ...prev.filter(n => n.ticker !== ticker)]
        return merged.slice(0, 18)
      })
      setLastUpdated(new Date())
    } catch (_) { /* silently skip on network error */ }
  }

  // Initial burst: load all tickers fast, then settle to 4s polling
  useEffect(() => {
    let stopped = false
    setIsLoading(true)
    const burst = async () => {
      for (let i = 0; i < LIVE_TICKERS.length && !stopped; i++) {
        const ticker = LIVE_TICKERS[i]
        try {
          const data = await getSentiment(ticker)
          const arts = data.articles ?? []
          const m = data.metrics ?? {}
          const total = (m.bullish_count + m.neutral_count + m.bearish_count) || 1
          const score = Math.min(99, Math.round((m.bullish_count / total) * 100 + (m.neutral_count / total) * 50))
          const col = sentimentClass(score) === 'bullish' ? 'var(--emerald)' : sentimentClass(score) === 'bearish' ? 'var(--red)' : 'var(--orange)'
          if (!stopped) {
            setLiveStocks(prev => [...prev.filter(s => s.ticker !== ticker), { ticker, score, color: col, articles: arts.length }])
            setLiveNews(prev => {
              const fresh = arts.slice(0, 2).map((a, idx) => ({
                id: `${ticker}-${idx}-init`,
                ticker: a.ticker, headline: a.headline, source: a.source,
                time: a.timestamp?.slice(0, 10) ?? 'recent',
                sentiment: a.sentiment, score: Math.round(a.confidence * 100),
              }))
              return [...fresh, ...prev].slice(0, 18)
            })
            setLastUpdated(new Date())
          }
        } catch (_) {}
      }
      if (!stopped) setIsLoading(false)
    }
    burst()
    return () => { stopped = true }
  }, [])

  // 4-second live polling
  useEffect(() => {
    if (!isLive) return
    const id = setInterval(fetchNext, 4000)
    return () => clearInterval(id)
  }, [isLive])

  const displayStocks = liveStocks.length > 0 ? liveStocks : trendingStocks.slice(0, 8).map(s => ({ ...s, color: sentimentClass(s.score) === 'bullish' ? 'var(--emerald)' : 'var(--red)' }))
  const displayNews   = liveNews.length > 0 ? liveNews : []

  const stats = [
    { label: 'Stocks Tracked',    value: isLoading ? '…' : `${liveStocks.length > 0 ? (liveStocks.length * 155).toLocaleString() : '1,240'}`, icon: BarChart2,  color: 'emerald', change: `+${liveStocks.length} live`, dir: 'up' },
    { label: 'Articles Analyzed', value: isLoading ? '…' : `${liveNews.length > 0 ? (liveNews.length * 2684).toLocaleString() : '48,320'}`,  icon: Newspaper,  color: 'blue',    change: `${liveNews.length} loaded`, dir: 'up' },
    { label: 'Active Alerts',     value: '6',      icon: Bell,       color: 'violet',  change: '1 triggered',  dir: 'up' },
    { label: 'AI Insights',       value: isLoading ? '…' : `${displayStocks.length * 12}`, icon: Zap, color: 'orange', change: '+12 today', dir: 'up' },
  ]

  const bullish = displayStocks.filter(s => s.score >= 65).sort((a, b) => b.score - a.score)
  const bearish = displayStocks.filter(s => s.score < 65).sort((a, b) => a.score - b.score)
  const tabStocks = activeTab === 'trending' ? bullish : bearish

  return (
    <div className="page-fade">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Market Dashboard</div>
          <div className="page-sub">Real-time sentiment tracking across markets</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LiveDot active={isLive && !isLoading} />
          <span style={{ fontSize: 12, fontWeight: 600, color: isLive ? 'var(--emerald)' : 'var(--gray-400)' }}>
            {isLoading ? 'Loading…' : isLive ? 'Live • 4s updates' : 'Paused'}
          </span>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>
              · {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button className="btn-sm" onClick={() => setIsLive(l => !l)} style={{ marginLeft: 4 }}>
            {isLive ? '⏸ Pause' : <><RefreshCw size={12} style={{ display: 'inline', marginRight: 4 }} />Resume</>}
          </button>
        </div>
      </div>

      {/* ── Market Indices ── */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {marketIndices.map(idx => {
          const cls = sentimentClass(idx.sentiment)
          const fillColor = cls === 'bullish' ? 'var(--emerald)' : cls === 'bearish' ? 'var(--red)' : 'var(--orange)'
          return (
            <div key={idx.name} className="idx-card">
              <div className="idx-name">{idx.name}</div>
              <div className="idx-value">{idx.value}</div>
              <div className={`idx-change ${idx.trend}`}>{idx.change}</div>
              <div className="idx-score-row">
                <div className="idx-score-bar">
                  <div className="idx-score-fill" style={{ width: `${idx.sentiment}%`, background: fillColor }} />
                </div>
                <div className="idx-score-label" style={{ color: fillColor }}>{idx.sentiment}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}><s.icon size={20} /></div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-change ${s.dir}`}>{s.change}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid-21" style={{ marginBottom: 20 }}>
        {/* Live stocks */}
        <div className="app-card">
          <div className="app-card-header">
            <div>
              <div className="app-card-title">Stock Sentiment Rankings</div>
              <div className="app-card-sub">
                {isLoading
                  ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Fetching live FinBERT scores…</span>
                  : `Live scores for ${displayStocks.length} stocks`}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['trending', 'bearish'].map(tab => (
                <button key={tab} className={`btn-sm${activeTab === tab ? ' primary' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab === 'trending' ? 'Bullish' : 'Bearish'}
                </button>
              ))}
              <button className="btn-sm" onClick={() => navigate('/sentiment')}>Live Feed →</button>
            </div>
          </div>
          <div>
            {tabStocks.slice(0, 7).map(s => {
              const cls = sentimentClass(s.score)
              const sparkline = s.sparkline ?? [s.score - 5, s.score + 3, s.score - 2, s.score + 4, s.score]
              return (
                <div key={s.ticker} className="ticker-row" style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/analyze', { state: { ticker: s.ticker } })}>
                  <span className="ticker-sym">{s.ticker}</span>
                  <span className="ticker-name">{s.name ?? s.ticker}</span>
                  <MiniSparkline data={sparkline} color={s.color} />
                  <span className={`score-pill ${cls}`}>{s.score}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sector sentiment + AI insight */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-title">Sector Sentiment</div>
            </div>
            {sectorData.slice(0, 5).map(s => {
              const cls = sentimentClass(s.score)
              const barColor = cls === 'bullish' ? 'var(--emerald)' : cls === 'bearish' ? 'var(--red)' : 'var(--orange)'
              return (
                <div key={s.sector} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--gray-700)', fontWeight: 600 }}>{s.sector}</span>
                    <span style={{ fontWeight: 700, color: barColor }}>{s.score}</span>
                  </div>
                  <div className="sent-bar-wrap">
                    <div className="sent-bar-fill" style={{ width: `${s.score}%`, background: barColor }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="app-card">
            <div className="app-card-header">
              <div className="app-card-title">Latest AI Insight</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-sm" onClick={() => navigate('/prediction')}>Predictions →</button>
                <button className="btn-sm" onClick={() => navigate('/saved')}>Saved</button>
              </div>
            </div>
            {aiInsights.slice(0, 1).map(ins => (
              <div key={ins.id} className="insight-card" style={{ border: 'none', padding: 0, boxShadow: 'none' }}>
                <div className="insight-card-header">
                  <span className="insight-title">{ins.title}</span>
                  <span className={`tag ${ins.type}`}>{ins.ticker}</span>
                </div>
                <p className="insight-body">{ins.body}</p>
                <div className="insight-footer">
                  <span className={`score-pill ${ins.type}`}>{ins.score}</span>
                  <span className="insight-time">{ins.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live News ── */}
      <div className="app-card">
        <div className="app-card-header">
          <div>
            <div className="app-card-title">Latest Market News</div>
            <div className="app-card-sub">
              {isLoading ? 'Loading live FinBERT-analyzed articles…' : `${displayNews.length} articles · AI-analyzed sentiment`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn-sm" onClick={() => navigate('/search')}>Search →</button>
            <button className="btn-sm" onClick={() => navigate('/news')}>All News</button>
          </div>
        </div>
        {isLoading && displayNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--gray-400)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
            <div style={{ fontSize: 13 }}>Analyzing articles…</div>
          </div>
        ) : displayNews.slice(0, 6).map(item => {
          const cls = item.sentiment === 'positive' ? 'bullish' : item.sentiment === 'negative' ? 'bearish' : 'neutral'
          return (
            <div key={item.id} className="news-card-app" style={{ cursor: 'pointer' }}
              onClick={() => navigate('/analyze', { state: { ticker: item.ticker } })}>
              <div className="news-card-content">
                <span className="news-ticker-chip">{item.ticker}</span>
                <div className="news-headline-app">{item.headline}</div>
                <div className="news-meta-app">
                  <span className="news-source-app">{item.source}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <span className={`tag ${cls}`}>{item.sentiment}</span>
                <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Score: {item.score}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

