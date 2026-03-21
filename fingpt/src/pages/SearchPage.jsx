import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calendar, TrendingUp, TrendingDown, Minus, X } from 'lucide-react'
import { searchSuggestions } from '../data/featureData.js'
import { searchArticles } from '../services/api.js'

const SENTIMENTS = ['All Sentiments', 'Positive', 'Negative', 'Neutral']

function highlightQuery(text, query) {
  if (!query || !text) return text
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !['find','show','about','with','from','that','this','the','and','for'].includes(w))
  let result = text
  for (const w of words) {
    result = result.replace(new RegExp(`(${w})`, 'gi'), '<mark style="background:rgba(99,102,241,0.15);border-radius:3px;padding:0 2px">$1</mark>')
  }
  return result
}

function sentimentIcon(s) {
  if (s === 'positive') return <TrendingUp size={12} />
  if (s === 'negative') return <TrendingDown size={12} />
  return <Minus size={12} />
}

export default function SearchPage() {
  const [query,    setQuery]    = useState('')
  const [committed, setCommitted] = useState('')
  const [sentiment, setSentiment] = useState('All Sentiments')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)
  const [results,  setResults]  = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const doSearch = useCallback(async (q) => {
    const trimmed = q.trim()
    if (!trimmed) return
    setCommitted(trimmed)
    setQuery(trimmed)
    setShowSuggestions(false)
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const data = await searchArticles(trimmed)
      setResults(data.results ?? [])
    } catch (e) {
      setError(e.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }, [])

  // Live-as-you-type: debounced search
  useEffect(() => {
    if (!query.trim() || query === committed) return
    const id = setTimeout(() => doSearch(query), 600)
    return () => clearTimeout(id)
  }, [query])

  function reset() {
    setQuery(''); setCommitted(''); setResults([]); setError(null)
    inputRef.current?.focus()
  }

  const filtered = results.filter(r => sentiment === 'All Sentiments' || r.sentiment === sentiment.toLowerCase())

  return (
    <div className="page-fade">
      <div className="page-header">
        <div className="page-title">Semantic News Search</div>
        <div className="page-sub">Search financial news using natural language — powered by FinBERT</div>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#fff', border: '2px solid var(--gray-200)', borderRadius: 'var(--radius-md)', padding: '14px 18px', boxShadow: 'var(--shadow-sm)' }}
          onClick={() => inputRef.current?.focus()}
        >
          <Search size={20} color="var(--gray-400)" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true) }}
            onKeyDown={e => e.key === 'Enter' && query.trim() && doSearch(query.trim())}
            onFocus={() => setShowSuggestions(!committed)}
            placeholder='Try: "Find negative news about Tesla" or any ticker'
            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, color: 'var(--gray-900)', background: 'transparent' }}
          />
          {query && <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex' }}><X size={18} /></button>}
          <button className="btn-sm primary" onClick={() => query.trim() && doSearch(query.trim())} disabled={loading}>Search</button>
        </div>

        {/* Suggestions */}
        {showSuggestions && !committed && (
          <div className="search-results" style={{ top: 64 }}>
            <div style={{ padding: '8px 16px 6px', fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Example Queries</div>
            {searchSuggestions.map(s => (
              <div key={s} className="search-result-item" onClick={() => doSearch(s)}>
                <Search size={13} color="var(--gray-300)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13 }}>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      {committed && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Sentiment:</span>
          {SENTIMENTS.map(s => (
            <button key={s} className={`btn-sm${sentiment === s ? ' primary' : ''}`} onClick={() => setSentiment(s)}>{s}</button>
          ))}
          {filtered.length > 0 && <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--gray-400)' }}>{filtered.length} results</span>}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3].map(i => (
            <div key={i} className="app-card" style={{ display: 'flex', gap: 16 }}>
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton" style={{ height: 14, width: '80%' }} />
                <div className="skeleton" style={{ height: 12, width: '60%' }} />
                <div className="skeleton" style={{ height: 12, width: '90%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="empty-state">
          <Search />
          <div className="empty-state-title">Search failed</div>
          <div className="empty-state-sub">{error}</div>
          <button className="btn-sm primary" style={{ marginTop: 12 }} onClick={() => doSearch(committed)}>Retry</button>
        </div>
      )}

      {/* Empty state */}
      {!committed && !loading && (
        <div className="empty-state" style={{ paddingTop: 60 }}>
          <Search size={48} />
          <div className="empty-state-title">Search financial news with natural language</div>
          <div className="empty-state-sub">Type any query above — results appear as you type.</div>
          <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 500 }}>
            {searchSuggestions.slice(0, 4).map(s => (
              <button key={s} className="btn-sm" style={{ fontSize: 12 }} onClick={() => doSearch(s)}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {committed && !loading && !error && filtered.length === 0 && (
        <div className="empty-state">
          <Search />
          <div className="empty-state-title">No results found</div>
          <div className="empty-state-sub">Try different keywords or adjust the sentiment filter.</div>
        </div>
      )}

      {/* Results */}
      {!loading && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(item => {
            const cls = item.sentiment === 'positive' ? 'bullish' : item.sentiment === 'negative' ? 'bearish' : 'neutral'
            const borderColor = cls === 'bullish' ? 'var(--emerald)' : cls === 'bearish' ? 'var(--red)' : 'var(--orange)'
            return (
              <div key={item.id} className="app-card" style={{ display: 'flex', gap: 14, borderLeft: `3px solid ${borderColor}`, cursor: 'pointer', alignItems: 'flex-start' }}
                onClick={() => navigate('/analyze', { state: { ticker: item.ticker } })}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--gray-900)', color: borderColor, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.ticker}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)', textAlign: 'center' }}>
                    rel.<br /><span style={{ fontWeight: 700, color: 'var(--gray-700)' }}>{Math.round(item.relevance * 100)}%</span>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--gray-500)' }}>{item.source}</span>
                    <span style={{ fontSize: 11, color: 'var(--gray-300)' }}>·</span>
                    <span style={{ fontSize: 11, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Calendar size={10} /> {item.date}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.4, marginBottom: 6 }}
                    dangerouslySetInnerHTML={{ __html: highlightQuery(item.headline, committed) }} />
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}
                    dangerouslySetInnerHTML={{ __html: '…' + highlightQuery(item.context, committed) + '…' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                  <span className={`tag ${cls}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {sentimentIcon(item.sentiment)} {item.sentiment}
                  </span>
                  <div style={{ fontSize: 22, fontWeight: 800, color: borderColor, letterSpacing: '-0.03em' }}>{item.score}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>confidence</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


