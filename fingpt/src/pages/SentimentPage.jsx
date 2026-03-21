import { useState, useEffect, useRef } from 'react'
import { Activity, RefreshCw, Clock, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { liveFeedItems } from '../data/featureData.js'
import { getSentiment } from '../services/api.js'

function sentimentColor(s) {
  return s === 'positive' ? 'var(--emerald)' : s === 'negative' ? 'var(--red)' : 'var(--orange)'
}
function sentimentClass(s) {
  return s === 'positive' ? 'bullish' : s === 'negative' ? 'bearish' : 'neutral'
}
function sentimentIcon(s) {
  if (s === 'positive') return <TrendingUp size={13} />
  if (s === 'negative') return <TrendingDown size={13} />
  return <Minus size={13} />
}

function MetricsPanel({ items }) {
  const avg = Math.round(items.reduce((s, i) => s + i.confidence, 0) / items.length)
  const pos = items.filter(i => i.sentiment === 'positive').length
  const neg = items.filter(i => i.sentiment === 'negative').length
  const neu = items.filter(i => i.sentiment === 'neutral').length
  const high = items.filter(i => i.confidence >= 85).length
  const med  = items.filter(i => i.confidence >= 70 && i.confidence < 85).length
  const low  = items.filter(i => i.confidence < 70).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 14 }}>Live Metrics</div>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.04em', color: avg >= 70 ? 'var(--emerald)' : avg >= 50 ? 'var(--orange)' : 'var(--red)' }}>{avg}</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>avg confidence</div>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-around', marginBottom: 16 }}>
          {[{ label: 'Bullish', val: pos, color: 'var(--emerald)' }, { label: 'Bearish', val: neg, color: 'var(--red)' }, { label: 'Neutral', val: neu, color: 'var(--orange)' }].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
            </div>
          ))}
        </div>
        {/* Sentiment mix bar */}
        <div className="dist-bar" style={{ height: 8 }}>
          <div className="dist-bar-pos" style={{ width: `${(pos / items.length) * 100}%` }} />
          <div className="dist-bar-neu" style={{ width: `${(neu / items.length) * 100}%` }} />
          <div className="dist-bar-neg" style={{ width: `${(neg / items.length) * 100}%` }} />
        </div>
      </div>

      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 12 }}>Confidence Distribution</div>
        {[{ label: 'High (≥85)', val: high, color: 'var(--emerald)' }, { label: 'Medium (70–84)', val: med, color: 'var(--orange)' }, { label: 'Low (<70)', val: low, color: 'var(--gray-300)' }].map(m => (
          <div key={m.label} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: 'var(--gray-600)' }}>{m.label}</span>
              <span style={{ fontWeight: 700, color: m.color }}>{m.val}</span>
            </div>
            <div className="sent-bar-wrap">
              <div className="sent-bar-fill" style={{ width: `${(m.val / items.length) * 100}%`, background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="app-card">
        <div className="app-card-title" style={{ marginBottom: 12 }}>Sentiment Volatility</div>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--violet)', textAlign: 'center' }}>
          {Math.round(Math.abs(pos - neg) * 4.2 / items.length * 10) / 10}
        </div>
        <div style={{ fontSize: 11, color: 'var(--gray-400)', textAlign: 'center', marginTop: 4 }}>normalized volatility index</div>
      </div>
    </div>
  )
}

function FeedItem({ item, isNew }) {
  const [expanded, setExpanded] = useState(false)
  const cls = sentimentClass(item.sentiment)
  const color = sentimentColor(item.sentiment)

  return (
    <div
      className="app-card"
      style={{
        padding: '14px 18px',
        borderLeft: `3px solid ${color}`,
        transition: 'all 0.3s ease',
        animation: isNew ? 'feedSlideIn 0.4s ease' : 'none',
        cursor: 'pointer',
      }}
      onClick={() => setExpanded(e => !e)}
    >
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Ticker chip */}
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-sm)',
          background: 'var(--gray-900)', color: color,
          fontSize: 10, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, letterSpacing: '0.03em'
        }}>{item.ticker}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> {item.time}s ago
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gray-500)' }}>{item.source}</span>
            <span style={{ fontSize: 10, color: 'var(--gray-400)' }}>· {item.category}</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.4 }}>{item.headline}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <span className={`tag ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {sentimentIcon(item.sentiment)} {item.sentiment}
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color }}>
            {item.confidence}%
          </span>
          {expanded ? <ChevronUp size={14} color="var(--gray-400)" /> : <ChevronDown size={14} color="var(--gray-400)" />}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--gray-100)', animation: 'pageFade 0.2s ease' }}>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12 }}>
            {[
              { label: 'Bullish', val: item.detail.bullish, color: 'var(--emerald)' },
              { label: 'Neutral', val: item.detail.neutral, color: 'var(--orange)' },
              { label: 'Bearish', val: item.detail.bearish, color: 'var(--red)' },
            ].map(m => (
              <div key={m.label} style={{ flex: 1, minWidth: 100 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: 'var(--gray-500)' }}>{m.label}</span>
                  <span style={{ fontWeight: 700, color: m.color }}>{m.val}%</span>
                </div>
                <div className="sent-bar-wrap" style={{ height: 6 }}>
                  <div className="sent-bar-fill" style={{ width: `${m.val}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Phrases Detected</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {item.detail.keyPhrases.map(p => (
                <span key={p} style={{ fontSize: 11, padding: '3px 10px', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', color: 'var(--gray-700)', fontWeight: 500 }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 12, color, fontWeight: 700 }}>Tone: {item.detail.tone}</div>
        </div>
      )}
    </div>
  )
}

export default function SentimentPage() {
  const [mode, setMode] = useState('realtime')
  const [items, setItems] = useState(liveFeedItems)
  const [filter, setFilter] = useState('all')
  const [newIds, setNewIds] = useState(new Set())
  const [isPaused, setIsPaused] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const intervalRef = useRef(null)
  const tickerQueue = useRef(['NVDA','TSLA','AAPL','MSFT','META','GOOGL','AMD','JPM','AMZN','GS','NFLX','BA'])
  const queueIdx = useRef(0)
  const idCounter = useRef(1000)

  /** Convert one backend article → feed item shape */
  function artToItem(a) {
    idCounter.current++
    return {
      id: idCounter.current,
      ticker: a.ticker,
      headline: a.headline,
      source: a.source,
      sentiment: a.sentiment,
      confidence: Math.round(a.confidence * 100),
      time: String(Math.floor(Math.random() * 30) + 1),
      category: a.key_phrases?.[0] ?? 'Market',
      detail: {
        bullish:  Math.round((a.breakdown?.positive ?? 0) * 100),
        neutral:  Math.round((a.breakdown?.neutral  ?? 0) * 100),
        bearish:  Math.round((a.breakdown?.negative ?? 0) * 100),
        keyPhrases: a.key_phrases ?? [],
        tone: a.sentiment === 'positive' ? 'Bullish' : a.sentiment === 'negative' ? 'Bearish' : 'Neutral',
      },
    }
  }

  /** Fetch next ticker and prepend its articles to the feed */
  async function fetchNext() {
    const ticker = tickerQueue.current[queueIdx.current % tickerQueue.current.length]
    queueIdx.current++
    try {
      const data = await getSentiment(ticker, mode === 'realtime' ? 'realtime' : 'historical')
      const newItems = (data.articles ?? []).slice(0, 2).map(artToItem)
      if (newItems.length === 0) return
      const ids = new Set(newItems.map(i => i.id))
      setItems(prev => [...newItems, ...prev].slice(0, 30))
      setNewIds(prev => new Set([...prev, ...ids]))
      setTimeout(() => setNewIds(prev => { const n = new Set(prev); ids.forEach(id => n.delete(id)); return n }), 2500)
    } catch (_) {}
  }

  // Bootstrap: load all tickers once on mount
  useEffect(() => {
    let stopped = false
    const run = async () => {
      setItems([])
      for (const ticker of tickerQueue.current) {
        if (stopped) break
        try {
          const data = await getSentiment(ticker)
          const newItems = (data.articles ?? []).slice(0, 1).map(artToItem)
          if (!stopped) setItems(prev => [...newItems, ...prev])
        } catch (_) {}
      }
      if (!stopped) setIsBootstrapping(false)
    }
    run()
    return () => { stopped = true }
  }, [])

  // 4s live polling
  useEffect(() => {
    if (mode !== 'realtime' || isPaused || isBootstrapping) return
    intervalRef.current = setInterval(fetchNext, 4000)
    return () => clearInterval(intervalRef.current)
  }, [mode, isPaused, isBootstrapping])

  const filtered = items.filter(i => filter === 'all' || i.sentiment === filter)

  return (
    <div className="page-fade">
      <style>{`
        @keyframes feedSlideIn {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Real-Time Sentiment Scoring</div>
          <div className="page-sub">Live AI analysis of incoming financial news</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', padding: 3 }}>
            {['realtime', 'historical'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '6px 16px', borderRadius: 'var(--radius-full)', border: 'none',
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? 'var(--gray-900)' : 'var(--gray-500)',
                  fontWeight: mode === m ? 700 : 500,
                  fontSize: 13, cursor: 'pointer',
                  boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                {m === 'realtime' ? '⚡ Real-Time' : '📊 Historical'}
              </button>
            ))}
          </div>
          {mode === 'realtime' && (
            <button className="btn-sm" onClick={() => setIsPaused(p => !p)}>
              {isPaused ? <><RefreshCw size={12} style={{ display: 'inline', marginRight: 4 }} />Resume</> : '⏸ Pause'}
            </button>
          )}
        </div>
      </div>

      {mode === 'realtime' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: isPaused ? 'var(--orange)' : isBootstrapping ? 'var(--violet)' : 'var(--emerald)', display: 'inline-block', boxShadow: isPaused || isBootstrapping ? 'none' : '0 0 6px var(--emerald)', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: isPaused ? 'var(--orange)' : 'var(--emerald)', display: 'flex', alignItems: 'center', gap: 6 }}>
            {isBootstrapping
              ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Loading FinBERT results…</>
              : isPaused ? 'Feed paused' : 'Live — real FinBERT results every 4s'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>· {items.length} articles processed</span>
        </div>
      )}

      {/* Sentiment filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'positive', 'negative', 'neutral'].map(f => (
          <button
            key={f}
            className={`btn-sm${filter === f ? ' primary' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid-21">
        {/* Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Activity />
              <div className="empty-state-title">No articles match filter</div>
            </div>
          ) : filtered.map(item => (
            <FeedItem key={item.id} item={item} isNew={newIds.has(item.id)} />
          ))}
        </div>

        {/* Metrics panel */}
        <MetricsPanel items={filtered.length > 0 ? filtered : items} />
      </div>
    </div>
  )
}
