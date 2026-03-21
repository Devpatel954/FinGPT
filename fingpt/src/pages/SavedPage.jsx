import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Star, Trash2, TrendingUp, Eye } from 'lucide-react'
import { savedInsights, savedStocks } from '../data/appData.js'

export default function SavedPage() {
  const [insights, setInsights] = useState(savedInsights)
  const [stocks, setStocks] = useState(savedStocks)
  const [tab, setTab] = useState('insights')
  const navigate = useNavigate()

  function removeInsight(id) { setInsights(i => i.filter(x => x.id !== id)) }
  function removeStock(ticker) { setStocks(s => s.filter(x => x.ticker !== ticker)) }

  return (
    <div className="page-fade">
      <div className="page-header">
        <div className="page-title">Saved Insights</div>
        <div className="page-sub">Your bookmarked AI insights and watchlist stocks</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button className={`btn-sm${tab === 'insights' ? ' primary' : ''}`} onClick={() => setTab('insights')}>
          <Bookmark size={12} style={{ display: 'inline', marginRight: 4 }} />
          Insights ({insights.length})
        </button>
        <button className={`btn-sm${tab === 'watchlist' ? ' primary' : ''}`} onClick={() => setTab('watchlist')}>
          <Star size={12} style={{ display: 'inline', marginRight: 4 }} />
          Watchlist ({stocks.length})
        </button>
      </div>

      {/* Insights tab */}
      {tab === 'insights' && (
        <>
          {insights.length === 0 ? (
            <div className="empty-state">
              <Bookmark />
              <div className="empty-state-title">No saved insights</div>
              <div className="empty-state-sub">Save insights from the Dashboard to view them here.</div>
            </div>
          ) : (
            <div className="grid-2">
              {insights.map(ins => {
                const scoreColor = ins.type === 'bullish' ? 'var(--emerald)' : ins.type === 'bearish' ? 'var(--red)' : 'var(--orange)'
                return (
                  <div key={ins.id} className="insight-card">
                    <div className="insight-card-header">
                      <span className="insight-title">{ins.title}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span className={`tag ${ins.type}`}>{ins.ticker}</span>
                        <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor, letterSpacing: '-0.04em' }}>
                          {ins.score}
                        </div>
                      </div>
                    </div>
                    {ins.note && (
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', fontStyle: 'italic', padding: '8px 10px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
                        📝 {ins.note}
                      </div>
                    )}
                    <div className="insight-footer">
                      <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Saved {ins.saved}</span>
                      <span className="insight-time" style={{ marginLeft: 'auto' }}>
                        <button
                          className="btn-sm"
                          style={{ marginRight: 6 }}
                          onClick={() => navigate('/analyze', { state: { ticker: ins.ticker !== 'MACRO' && ins.ticker !== 'SECTOR' ? ins.ticker : 'NVDA' } })}
                        >
                          <Eye size={11} style={{ display: 'inline', marginRight: 3 }} /> View
                        </button>
                        <button className="btn-sm danger" onClick={() => removeInsight(ins.id)}>
                          <Trash2 size={11} />
                        </button>
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Watchlist tab */}
      {tab === 'watchlist' && (
        <div className="app-card">
          <div className="app-card-header">
            <div className="app-card-title">Watchlist</div>
            <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{stocks.length} stocks</span>
          </div>
          {stocks.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <Star />
              <div className="empty-state-title">Watchlist is empty</div>
              <div className="empty-state-sub">Add stocks from the Analyze page to track them here.</div>
            </div>
          ) : stocks.map(s => {
            const cls = s.score >= 70 ? 'bullish' : s.score >= 50 ? 'neutral' : 'bearish'
            const scoreColor = cls === 'bullish' ? 'var(--emerald)' : cls === 'bearish' ? 'var(--red)' : 'var(--orange)'
            return (
              <div key={s.ticker} className="watchlist-row">
                <span className="watchlist-ticker">{s.ticker}</span>
                <div style={{ flex: 1 }}>
                  <div className="watchlist-name">{s.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>Since {s.watchedSince}</div>
                </div>
                <span className={`change-pill ${s.change >= 0 ? 'up' : 'down'}`}>
                  {s.change >= 0 ? '+' : ''}{s.change}
                </span>
                <div style={{ fontSize: 22, fontWeight: 800, color: scoreColor, letterSpacing: '-0.04em', minWidth: 44, textAlign: 'right' }}>
                  {s.score}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    className="btn-sm"
                    onClick={() => navigate('/analyze', { state: { ticker: s.ticker } })}
                  >
                    <TrendingUp size={11} />
                  </button>
                  <button className="btn-sm danger" onClick={() => removeStock(s.ticker)}>
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
