import { useState, useRef } from 'react'
import { FileText, Tag, AlertTriangle, Zap } from 'lucide-react'
import { sampleTranscripts, keywordCategories, keywordPatterns } from '../data/featureData.js'

function extractKeywords(text) {
  const found = []
  for (const kw of keywordPatterns) {
    const lower = text.toLowerCase()
    let idx = lower.indexOf(kw.phrase.toLowerCase())
    while (idx !== -1) {
      found.push({ phrase: kw.phrase, category: kw.category, weight: kw.weight, start: idx, end: idx + kw.phrase.length })
      idx = lower.indexOf(kw.phrase.toLowerCase(), idx + 1)
    }
  }
  // Sort by start position, remove overlaps
  found.sort((a, b) => a.start - b.start)
  const result = []
  let lastEnd = 0
  for (const f of found) {
    if (f.start >= lastEnd) { result.push(f); lastEnd = f.end }
  }
  return result
}

function HighlightedText({ text, keywords, filterCat, hovered, onHover }) {
  if (!keywords.length) return <span style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: 'var(--gray-700)' }}>{text}</span>

  const parts = []
  let last = 0
  for (const kw of keywords) {
    if (kw.start > last) parts.push({ type: 'text', content: text.slice(last, kw.start) })
    parts.push({ type: 'keyword', content: text.slice(kw.start, kw.end), kw })
    last = kw.end
  }
  if (last < text.length) parts.push({ type: 'text', content: text.slice(last) })

  return (
    <span style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: 'var(--gray-700)' }}>
      {parts.map((p, i) => {
        if (p.type === 'text') return <span key={i}>{p.content}</span>
        const cat = keywordCategories[p.kw.category]
        const isFiltered = filterCat && filterCat !== p.kw.category
        const isHovered = hovered === p.kw.category
        return (
          <mark
            key={i}
            onMouseEnter={() => onHover(p.kw.category)}
            onMouseLeave={() => onHover(null)}
            style={{
              background: isFiltered ? 'transparent' : (isHovered ? cat.color : cat.bg),
              color: isFiltered ? 'inherit' : (isHovered ? '#fff' : cat.color),
              borderRadius: 4,
              padding: '1px 4px',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'all 0.15s',
              opacity: isFiltered ? 0.4 : 1,
              textDecoration: 'none',
            }}
          >
            {p.content}
          </mark>
        )
      })}
    </span>
  )
}

function CategoryCard({ label, count, cat, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? cat.bg : '#fff',
        border: `1px solid ${isActive ? cat.color : 'var(--gray-200)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 18 }}>{cat.icon}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: cat.color, letterSpacing: '-0.03em' }}>{count}</div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? cat.color : 'var(--gray-700)', marginTop: 6 }}>{label}</div>
    </div>
  )
}

export default function KeywordsPage() {
  const [text, setText] = useState('')
  const [analyzed, setAnalyzed] = useState(false)
  const [keywords, setKeywords] = useState([])
  const [filterCat, setFilterCat] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  function loadSample(key) {
    setText(sampleTranscripts[key])
    setAnalyzed(false); setKeywords([]); setFilterCat(null)
  }

  function analyze() {
    if (!text.trim()) return
    setLoading(true)
    setTimeout(() => {
      setKeywords(extractKeywords(text))
      setAnalyzed(true)
      setLoading(false)
    }, 900)
  }

  function reset() {
    setText(''); setAnalyzed(false); setKeywords([]); setFilterCat(null)
  }

  // Category counts
  const catCounts = {}
  for (const cat of Object.keys(keywordCategories)) catCounts[cat] = 0
  for (const kw of keywords) catCounts[kw.category] = (catCounts[kw.category] || 0) + 1

  const displayedKeywords = filterCat ? keywords.filter(k => k.category === filterCat) : keywords

  return (
    <div className="page-fade">
      <div className="page-header">
        <div className="page-title">Financial Keyword Extraction</div>
        <div className="page-sub">Extract structured insights from financial text — earnings calls, reports, analyst notes</div>
      </div>

      <div className="grid-12" style={{ alignItems: 'start', gap: 24 }}>
        {/* Input / Output panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Sample buttons */}
          <div className="app-card" style={{ padding: '14px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Load Sample Text
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn-sm" onClick={() => loadSample('earnings')}>📋 Earnings Call</button>
              <button className="btn-sm" onClick={() => loadSample('riskReport')}>⚠️ Risk Report</button>
              <button className="btn-sm" onClick={() => loadSample('analystNote')}>📈 Analyst Note</button>
            </div>
          </div>

          {/* Textarea or highlighted output */}
          <div className="app-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--gray-100)' }}>
              <div className="app-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={15} /> {analyzed ? 'Analysis Output' : 'Input Text'}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {analyzed && <button className="btn-sm" onClick={reset}>Clear</button>}
                {!analyzed && text && (
                  <button className="btn-sm primary" onClick={analyze} disabled={loading}>
                    {loading ? '⏳ Analyzing…' : '✨ Extract Keywords'}
                  </button>
                )}
              </div>
            </div>

            {!analyzed ? (
              <div style={{ padding: 18 }}>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Paste an earnings transcript, analyst report, or financial news article here…"
                  style={{
                    width: '100%', minHeight: 320, padding: '12px', border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--gray-800)',
                    lineHeight: 1.7, fontFamily: 'inherit', resize: 'vertical', outline: 'none',
                    boxSizing: 'border-box', transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--emerald)'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
                />
                {!text && (
                  <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>or load a sample above</span>
                  </div>
                )}
                {text && !loading && (
                  <div style={{ marginTop: 12, textAlign: 'right' }}>
                    <button className="btn-sm primary" onClick={analyze}>✨ Extract Keywords</button>
                  </div>
                )}
                {loading && (
                  <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[100, 80, 60].map((w, i) => (
                      <div key={i} className="skeleton" style={{ height: 16, width: `${w}%`, borderRadius: 4 }} />
                    ))}
                    <div style={{ fontSize: 12, color: 'var(--emerald)', fontWeight: 600, marginTop: 8 }}>Running NLP analysis…</div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: 18, maxHeight: 480, overflowY: 'auto' }}>
                <HighlightedText
                  text={text}
                  keywords={keywords}
                  filterCat={filterCat}
                  hovered={hovered}
                  onHover={setHovered}
                />
              </div>
            )}
          </div>

          {/* Keyword list when analyzed */}
          {analyzed && filterCat && (
            <div className="app-card">
              <div className="app-card-title" style={{ marginBottom: 12 }}>
                {keywordCategories[filterCat].icon} {filterCat} — {catCounts[filterCat]} found
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {keywords.filter(k => k.category === filterCat).map((k, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--gray-800)', fontWeight: 500 }}>"{k.phrase}"</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {Array.from({ length: k.weight }).map((_, wi) => (
                        <div key={wi} style={{ width: 6, height: 6, borderRadius: '50%', background: keywordCategories[filterCat].color }} />
                      ))}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--gray-400)' }}>weight {k.weight}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel: category cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="app-card">
            <div className="app-card-title" style={{ marginBottom: 4 }}>Category Summary</div>
            <div className="app-card-sub" style={{ marginBottom: 16 }}>
              {analyzed ? `${keywords.length} keywords extracted` : 'Run extraction to see results'}
            </div>

            {!analyzed ? (
              <div className="empty-state" style={{ padding: '32px 0' }}>
                <Tag size={32} />
                <div className="empty-state-title">No analysis yet</div>
                <div className="empty-state-sub">Paste text and click "Extract Keywords"</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(keywordCategories).map(([label, cat]) => (
                  <CategoryCard
                    key={label} label={label} count={catCounts[label] || 0} cat={cat}
                    isActive={filterCat === label}
                    onClick={() => setFilterCat(f => f === label ? null : label)}
                  />
                ))}
                {filterCat && (
                  <button className="btn-sm" onClick={() => setFilterCat(null)}>Clear Filter</button>
                )}
              </div>
            )}
          </div>

          {analyzed && (
            <div className="app-card">
              <div className="app-card-title" style={{ marginBottom: 12 }}>Signal Summary</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Object.entries(catCounts).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                  const c = keywordCategories[cat]
                  return (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{c.icon}</span>
                      <span style={{ fontSize: 12, color: 'var(--gray-700)', flex: 1 }}>{cat}</span>
                      <div className="sent-bar-wrap" style={{ width: 80, height: 6 }}>
                        <div className="sent-bar-fill" style={{ width: `${Math.min(count * 25, 100)}%`, background: c.color }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: c.color, minWidth: 16 }}>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
