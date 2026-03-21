import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw, Loader2 } from 'lucide-react'
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { predictionData } from '../data/featureData.js'
import { getPrediction } from '../services/api.js'

const TICKERS = ['NVDA', 'TSLA', 'AAPL', 'MSFT', 'META', 'GOOGL', 'AMD', 'JPM']
const RANGES = ['7d', '14d', '30d']

function directionIcon(d) {
  if (d.includes('Bullish')) return <TrendingUp size={20} />
  if (d.includes('Bearish')) return <TrendingDown size={20} />
  return <Minus size={20} />
}
function directionColor(d) {
  if (d.includes('Bullish')) return 'var(--emerald)'
  if (d.includes('Bearish')) return 'var(--red)'
  return 'var(--orange)'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 10, padding: '12px 16px', boxShadow: 'var(--shadow-md)', fontSize: 12 }}>
      <div style={{ fontWeight: 700, color: 'var(--gray-900)', marginBottom: 8 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, display: 'flex', justifyContent: 'space-between', gap: 16 }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{p.name === 'Price' ? `$${p.value.toFixed(2)}` : p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function PredictionPage() {
  const [ticker, setTicker] = useState('NVDA')
  const [compareTicker, setCompareTicker] = useState(null)
  const [timeRange, setTimeRange] = useState('7d')
  const [liveData, setLiveData] = useState(null)         // backend response
  const [compareData, setCompareData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchPrediction = useCallback(async (sym, range) => {
    setLoading(true)
    setError(null)
    try {
      const d = await getPrediction(sym, range)
      setLiveData(d)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCompare = useCallback(async (sym, range) => {
    if (!sym) { setCompareData(null); return }
    try {
      const d = await getPrediction(sym, range)
      setCompareData(d)
    } catch (_) {}
  }, [])

  // Load on ticker / range change
  useEffect(() => { fetchPrediction(ticker, timeRange) }, [ticker, timeRange])
  useEffect(() => { fetchCompare(compareTicker, timeRange) }, [compareTicker, timeRange])

  // 4s auto-refresh
  useEffect(() => {
    const id = setInterval(() => fetchPrediction(ticker, timeRange), 4000)
    return () => clearInterval(id)
  }, [ticker, timeRange])

  // ── Resolve display data ───────────────────────────────
  const data = liveData ?? predictionData[ticker]
  const series = (liveData?.price_data ?? predictionData[ticker]?.series ?? []).map(p => ({
    date: p.date,
    price: p.price,
    sentiment: Math.round((p.sentiment_score + 1) * 50),   // map -1..1 → 0..100
  }))
  const color = directionColor(liveData?.direction ?? predictionData[ticker]?.direction ?? '')
  const confidence = liveData?.confidence ?? predictionData[ticker]?.confidence ?? 0
  const direction = liveData?.direction ?? predictionData[ticker]?.direction ?? '—'
  const correlation = liveData?.correlation ?? predictionData[ticker]?.correlation ?? 0
  const explanation = liveData?.explanation ?? predictionData[ticker]?.explanation ?? ''

  const compareSeries = (compareData?.price_data ?? (compareTicker ? predictionData[compareTicker]?.series ?? [] : [])).map(p => ({
    date: p.date ?? p.date,
    price: p.price,
    sentiment: Math.round(((p.sentiment_score ?? 0) + 1) * 50),
  }))

  return (
    <div className="page-fade">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Stock Trend Prediction</div>
          <div className="page-sub">Real-time sentiment-driven price forecasting via FinBERT</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {loading && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite', color: 'var(--emerald)' }} />}
          {lastUpdated && <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>{lastUpdated.toLocaleTimeString()}</span>}
          <button className="btn-sm" onClick={() => fetchPrediction(ticker, timeRange)}>
            <RefreshCw size={12} style={{ display: 'inline', marginRight: 4 }} />Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TICKERS.map(t => (
            <button key={t} className={`btn-sm${ticker === t ? ' primary' : ''}`}
              onClick={() => { setTicker(t); if (compareTicker === t) setCompareTicker(null) }}>
              {t}
            </button>
          ))}
        </div>
        <div style={{ height: 24, width: 1, background: 'var(--gray-200)' }} />
        <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Range:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {RANGES.map(r => (
            <button key={r} className={`btn-sm${timeRange === r ? ' primary' : ''}`} onClick={() => setTimeRange(r)}>{r.toUpperCase()}</button>
          ))}
        </div>
        <div style={{ height: 24, width: 1, background: 'var(--gray-200)' }} />
        <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>Compare:</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {TICKERS.filter(t => t !== ticker).map(t => (
            <button key={t} className={`btn-sm${compareTicker === t ? ' primary' : ''}`}
              onClick={() => setCompareTicker(prev => prev === t ? null : t)}
              style={{ opacity: 0.7 }}>
              vs {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-21" style={{ alignItems: 'start' }}>
        {/* Chart area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="app-card">
            <div className="app-card-header">
              <div>
                <div className="app-card-title">{ticker} — Sentiment vs Price</div>
                <div className="app-card-sub">{series.length}-day window · live FinBERT data</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {RANGES.map(r => (
                  <button key={r} className={`btn-sm${timeRange === r ? ' primary' : ''}`} onClick={() => setTimeRange(r)}>
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {error ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--red)', fontSize: 13 }}>{error}</div>
            ) : series.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24 }}>
                <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', color: 'var(--emerald)', margin: '0 auto 8px' }} />
                <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Loading prediction data…</div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={series} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} domain={['auto','auto']} tickFormatter={v => `$${Number(v).toFixed(0)}`} />
                  <YAxis yAxisId="sent" orientation="left" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--gray-400)' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line yAxisId="sent" type="monotone" dataKey="sentiment" name="Sentiment" stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color, strokeWidth: 0 }} />
                  <Line yAxisId="price" type="monotone" dataKey="price" name="Price" stroke="var(--blue)" strokeWidth={2} strokeDasharray="5 3" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {/* Correlation badge */}
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--gray-500)', marginBottom: 2 }}>Sentiment-Price Correlation</div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em', color: correlation > 0 ? 'var(--emerald)' : 'var(--red)' }}>
                  {correlation > 0 ? '+' : ''}{Number(correlation).toFixed(2)}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="sent-bar-wrap" style={{ height: 8 }}>
                  <div className="sent-bar-fill" style={{ width: `${Math.abs(correlation) * 100}%`, background: correlation > 0 ? 'var(--emerald)' : 'var(--red)' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>
                  {Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.5 ? 'Moderate' : 'Weak'} {correlation > 0 ? 'positive' : 'negative'} correlation
                </div>
              </div>
            </div>
          </div>

          {/* Compare chart */}
          {compareTicker && compareSeries.length > 0 && (
            <div className="app-card">
              <div className="app-card-header">
                <div className="app-card-title">{compareTicker} — Sentiment vs Price</div>
                <button className="btn-sm" onClick={() => setCompareTicker(null)}>Remove</button>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart data={compareSeries} margin={{ top: 4, right: 16, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--gray-400)' }} />
                  <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 10, fill: 'var(--gray-400)' }} domain={['auto','auto']} tickFormatter={v => `$${Number(v).toFixed(0)}`} />
                  <YAxis yAxisId="sent" orientation="left" domain={[0,100]} tick={{ fontSize: 10, fill: 'var(--gray-400)' }} />
                  <Tooltip />
                  <Line yAxisId="sent" type="monotone" dataKey="sentiment" stroke={directionColor(compareData?.direction ?? '')} strokeWidth={2} dot={false} name="Sentiment" />
                  <Line yAxisId="price" type="monotone" dataKey="price" stroke="var(--blue)" strokeWidth={1.5} strokeDasharray="5 3" dot={false} name="Price" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Prediction panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="app-card" style={{ borderTop: `3px solid ${color}` }}>
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <div style={{ color, marginBottom: 8 }}>{directionIcon(direction)}</div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Predicted Direction</div>
              <div style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: '-0.02em', marginBottom: 16 }}>{direction}</div>

              {/* Confidence gauge */}
              <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 16px' }}>
                <svg viewBox="0 0 100 100" width="100" height="100">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="var(--gray-100)" strokeWidth="10" />
                  <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="10"
                    strokeDasharray={`${confidence * 2.765} ${276.5}`}
                    strokeDashoffset="69.1" strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                  <text x="50" y="46" textAnchor="middle" fill="var(--gray-900)" fontSize="20" fontWeight="800">{confidence}%</text>
                  <text x="50" y="62" textAnchor="middle" fill="var(--gray-400)" fontSize="9">confidence</text>
                </svg>
              </div>
            </div>

            <div style={{ padding: '14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>
              {explanation}
            </div>
          </div>

          {/* All tickers summary */}
          <div className="app-card">
            <div className="app-card-title" style={{ marginBottom: 14 }}>All Predictions</div>
            {TICKERS.map(t => {
              const mockD = predictionData[t]
              const c = directionColor(mockD?.direction ?? '')
              return (
                <div key={t} className="ticker-row" style={{ cursor: 'pointer', background: ticker === t ? 'var(--gray-50)' : 'transparent', borderRadius: 6, padding: '8px 6px' }}
                  onClick={() => setTicker(t)}>
                  <span className="ticker-sym">{t}</span>
                  <span className="ticker-name" style={{ fontSize: 11 }}>{t === ticker ? direction : (mockD?.direction ?? '…')}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: t === ticker ? color : c }}>{t === ticker ? `${confidence}%` : `${mockD?.confidence ?? '—'}%`}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
