import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, TrendingUp, TrendingDown, AlertTriangle, ChevronRight, BarChart2 } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { earningsData } from '../data/featureData.js'

const COMPANIES = Object.keys(earningsData)

function InsightBadge({ type }) {
  const map = { positive: { color: 'var(--emerald)', bg: 'rgba(99,102,241,0.08)', icon: '✅' }, negative: { color: 'var(--red)', bg: 'rgba(239,68,68,0.08)', icon: '🔴' }, warning: { color: 'var(--orange)', bg: 'rgba(249,115,22,0.08)', icon: '⚠️' } }
  return map[type] || map.warning
}

function TranscriptEntry({ entry, isActive, onClick }) {
  const scoreColor = entry.sentiment >= 70 ? 'var(--emerald)' : entry.sentiment >= 50 ? 'var(--orange)' : 'var(--red)'
  return (
    <div
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderRadius: 'var(--radius-sm)',
        background: isActive ? 'var(--gray-50)' : 'transparent',
        borderLeft: `3px solid ${isActive ? scoreColor : 'transparent'}`,
        cursor: 'pointer', transition: 'all 0.15s', marginBottom: 4
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 4 }}>{entry.speaker}</div>
          <div style={{ fontSize: 13, color: 'var(--gray-800)', lineHeight: 1.55 }}>{entry.text}</div>
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: scoreColor, flexShrink: 0, letterSpacing: '-0.02em' }}>{entry.sentiment}</div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const val = payload[0]?.value
  const color = val >= 70 ? 'var(--emerald)' : val >= 50 ? 'var(--orange)' : 'var(--red)'
  return (
    <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 10, padding: '10px 14px', boxShadow: 'var(--shadow-md)', fontSize: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      <div style={{ color, fontWeight: 800 }}>Sentiment: {val}</div>
    </div>
  )
}

export default function EarningsPage() {
  const [company, setCompany] = useState('NVDA')
  const [showCompare, setShowCompare] = useState(false)
  const [activeTranscript, setActiveTranscript] = useState(null)
  const navigate = useNavigate()

  const data = earningsData[company]
  const overallColor = data.overallSentiment >= 70 ? 'var(--emerald)' : data.overallSentiment >= 50 ? 'var(--orange)' : 'var(--red)'
  const prevColor = data.prevSentiment >= 70 ? 'var(--emerald)' : data.prevSentiment >= 50 ? 'var(--orange)' : 'var(--red)'
  const sentChanged = data.overallSentiment - data.prevSentiment

  // Build timeline from segments
  const timelineData = data.segments.map(s => ({ name: s.label, sentiment: s.sentiment, tone: s.tone }))

  function jumpToTranscript(segmentLabel) {
    const seg = data.segments.find(s => s.label === segmentLabel)
    if (!seg) return
    // Find transcript entry closest to segment start time
    const idx = Math.min(Math.floor(seg.start / 15), data.transcript.length - 1)
    setActiveTranscript(idx)
    document.getElementById(`transcript-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="page-fade">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Earnings Call Analysis</div>
          <div className="page-sub">Deep AI analysis of earnings transcripts — tone, sentiment, and key shifts</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {COMPANIES.map(c => (
            <button key={c} className={`btn-sm${company === c ? ' primary' : ''}`} onClick={() => { setCompany(c); setActiveTranscript(null) }}>{c}</button>
          ))}
          <button className={`btn-sm${showCompare ? ' primary' : ''}`} onClick={() => setShowCompare(s => !s)}>
            ⇄ {showCompare ? 'Hide' : 'Q/Q Compare'}
          </button>
        </div>
      </div>

      {/* Header stats */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="idx-card" style={{ textAlign: 'center' }}>
          <div className="idx-name">{data.quarter} Overall</div>
          <div style={{ fontSize: 42, fontWeight: 900, color: overallColor, letterSpacing: '-0.04em' }}>{data.overallSentiment}</div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>sentiment score</div>
        </div>
        {showCompare && (
          <div className="idx-card" style={{ textAlign: 'center' }}>
            <div className="idx-name">{data.prevQuarter} Score</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: prevColor, letterSpacing: '-0.04em' }}>{data.prevSentiment}</div>
            <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>previous quarter</div>
          </div>
        )}
        <div className="idx-card" style={{ textAlign: 'center' }}>
          <div className="idx-name">Quarter Change</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: sentChanged >= 0 ? 'var(--emerald)' : 'var(--red)', letterSpacing: '-0.04em' }}>
            {sentChanged >= 0 ? '+' : ''}{sentChanged}
          </div>
          <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{data.prevQuarter} → {data.quarter}</div>
        </div>
        <div className="idx-card">
          <div className="idx-name">Earnings Date</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginTop: 4 }}>{data.date}</div>
          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{data.company}</div>
        </div>
      </div>

      <div className="grid-21" style={{ gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Sentiment Timeline */}
          <div className="app-card">
            <div className="app-card-header">
              <div>
                <div className="app-card-title">Sentiment Timeline</div>
                <div className="app-card-sub">Click a segment to jump to transcript</div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={timelineData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}
                onClick={e => e?.activePayload?.[0] && jumpToTranscript(e.activePayload[0].payload.name)}
                style={{ cursor: 'pointer' }}
              >
                <defs>
                  <linearGradient id="sentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={overallColor} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={overallColor} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--gray-400)' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--gray-400)' }} />
                <ReferenceLine y={70} stroke="var(--emerald)" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine y={50} stroke="var(--orange)" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sentiment" stroke={overallColor} strokeWidth={2.5} fill="url(#sentFill)" dot={{ r: 5, fill: overallColor, strokeWidth: 0 }} activeDot={{ r: 7 }} />
              </AreaChart>
            </ResponsiveContainer>

            {/* Segment markers */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 14 }}>
              {data.segments.map(seg => {
                const sc = seg.sentiment >= 70 ? 'var(--emerald)' : seg.sentiment >= 50 ? 'var(--orange)' : 'var(--red)'
                return (
                  <button
                    key={seg.label}
                    className="btn-sm"
                    onClick={() => jumpToTranscript(seg.label)}
                    style={{ borderColor: sc, color: sc, fontSize: 11 }}
                  >
                    {seg.label} · {seg.sentiment}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Transcript viewer */}
          <div className="app-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={15} />
              <div className="app-card-title">Transcript</div>
            </div>
            <div style={{ padding: '6px 8px', maxHeight: 440, overflowY: 'auto' }}>
              {data.transcript.map((entry, i) => (
                <div key={entry.id} id={`transcript-${i}`}>
                  <TranscriptEntry
                    entry={entry}
                    isActive={activeTranscript === i}
                    onClick={() => setActiveTranscript(i === activeTranscript ? null : i)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="app-card">
            <div className="app-card-title" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              ✨ AI Insights Panel
            </div>
            {data.insights.map((ins, i) => {
              const style = InsightBadge(ins.type)
              return (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < data.insights.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                  <div style={{ fontSize: 18, flexShrink: 0 }}>{style.icon}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.55, paddingTop: 1 }}>{ins.text}</div>
                </div>
              )
            })}
          </div>

          {/* Segment detail */}
          <div className="app-card">
            <div className="app-card-title" style={{ marginBottom: 14 }}>Segment Breakdown</div>
            {data.segments.map(seg => {
              const sc = seg.sentiment >= 70 ? 'var(--emerald)' : seg.sentiment >= 50 ? 'var(--orange)' : 'var(--red)'
              return (
                <div
                  key={seg.label}
                  style={{ padding: '10px 0', borderBottom: '1px solid var(--gray-100)', cursor: 'pointer' }}
                  onClick={() => jumpToTranscript(seg.label)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-900)' }}>{seg.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--gray-100)', borderRadius: 'var(--radius-full)', color: 'var(--gray-600)' }}>{seg.tone}</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: sc }}>{seg.sentiment}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.4 }}>{seg.summary}</div>
                  <div className="sent-bar-wrap" style={{ marginTop: 6, height: 4 }}>
                    <div className="sent-bar-fill" style={{ width: `${seg.sentiment}%`, background: sc }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
