import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, Loader2, RefreshCw } from 'lucide-react'
import { getSentiment } from '../services/api.js'

const TICKERS = ['NVDA','TSLA','AAPL','MSFT','META','GOOGL','AMD','JPM','AMZN','GS','NFLX','BA']
const FILTERS = ['All', 'Positive', 'Neutral', 'Negative']

let _uid = 0

export default function NewsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [articles, setArticles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const tickerIdx = useRef(0)
  const navigate = useNavigate()

  async function fetchTicker(ticker) {
    try {
      const data = await getSentiment(ticker)
      const arts = (data.articles ?? []).map(a => ({
        id: `${ticker}-${++_uid}`,
        ticker: a.ticker ?? ticker,
        headline: a.headline,
        source: a.source,
        time: a.timestamp?.slice(0, 10) ?? 'recent',
        sentiment: a.sentiment,
        score: Math.round(a.confidence * 100),
        summary: a.key_phrases?.join(' · ') ?? '',
      }))
      if (arts.length > 0) {
        setArticles(prev => {
          const ids = new Set(prev.map(p => p.headline))
          const fresh = arts.filter(a => !ids.has(a.headline))
          return [...fresh, ...prev].slice(0, 60)
        })
        setLastUpdated(new Date())
      }
    } catch (_) {}
  }

  // Bootstrap all tickers on mount
  useEffect(() => {
    let stopped = false
    const run = async () => {
      for (const t of TICKERS) {
        if (stopped) break
        await fetchTicker(t)
      }
      setLoading(false)
    }
    run()
    return () => { stopped = true }
  }, [])

  // 4s rolling refresh — one ticker at a time
  useEffect(() => {
    const id = setInterval(() => {
      const t = TICKERS[tickerIdx.current % TICKERS.length]
      tickerIdx.current++
      fetchTicker(t)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const filtered = articles.filter(n => {
    const matchSent = filter === 'All' || n.sentiment === filter.toLowerCase()
    const q = search.toLowerCase()
    const matchSearch = !q || n.headline.toLowerCase().includes(q) || n.ticker.toLowerCase().includes(q) || n.source.toLowerCase().includes(q)
    return matchSent && matchSearch
  })

  return (
    <div className="page-fade">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">News Feed</div>
          <div className="page-sub">Live FinBERT-analyzed articles · 4s refresh</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: loading ? 'var(--orange)' : 'var(--emerald)', display: 'inline-block', boxShadow: loading ? 'none' : '0 0 6px var(--emerald)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: loading ? 'var(--orange)' : 'var(--emerald)' }}>
            {loading ? 'Loading…' : `Live · ${articles.length} articles`}
          </span>
          {lastUpdated && <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{lastUpdated.toLocaleTimeString()}</span>}
        </div>
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="topnav-search" style={{ width: 260, borderRadius: 'var(--radius-sm)' }}>
          <Newspaper size={15} />
          <input placeholder="Search headlines, tickers…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {FILTERS.map(f => (
          <button key={f} className={`btn-sm${filter === f ? ' primary' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray-400)' }}>{filtered.length} articles</span>
      </div>

      {/* News cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && articles.length === 0 ? (
          <div className="empty-state">
            <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--emerald)' }} />
            <div className="empty-state-title">Fetching live articles…</div>
            <div className="empty-state-sub">Running FinBERT on all tickers</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Newspaper />
            <div className="empty-state-title">No articles match your filter</div>
            <div className="empty-state-sub">Try adjusting the sentiment filter or search term.</div>
          </div>
        ) : filtered.map(item => {
          const cls = item.sentiment === 'positive' ? 'bullish' : item.sentiment === 'negative' ? 'bearish' : 'neutral'
          const borderColor = cls === 'bullish' ? 'var(--emerald)' : cls === 'bearish' ? 'var(--red)' : 'var(--orange)'
          return (
            <div key={item.id} className="app-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', borderLeft: `3px solid ${borderColor}`, cursor: 'pointer' }}
              onClick={() => navigate('/analyze', { state: { ticker: item.ticker } })}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className="news-ticker-chip">{item.ticker}</span>
                  <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{item.source} · {item.time}</span>
                </div>
                <div className="news-headline-app" style={{ fontSize: 15, marginBottom: 8 }}>{item.headline}</div>
                {item.summary && <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.55, margin: 0 }}>{item.summary}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                <span className={`tag ${cls}`}>{item.sentiment}</span>
                <div style={{ fontSize: 22, fontWeight: 800, color: borderColor, letterSpacing: '-0.03em' }}>{item.score}</div>
                <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>confidence</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

