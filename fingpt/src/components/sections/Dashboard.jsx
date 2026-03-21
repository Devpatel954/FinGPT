import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { sentimentTimelineData, heatmapData, topNewsItems } from '../../data/mockData';

const TICKER_COLORS = { AAPL: '#6366f1', TSLA: '#ef4444', MSFT: '#3b82f6', NVDA: '#8b5cf6' };
const ALL_TICKERS = Object.keys(TICKER_COLORS);

function SentimentChart({ data, activeTickers }) {
  const W = 600, H = 200;
  const pad = { t: 14, r: 20, b: 32, l: 32 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const allVals = data.flatMap(d => activeTickers.map(t => d[t]));
  const min = Math.min(...allVals) - 8, max = Math.max(...allVals) + 8;
  const sx = i => (i / (data.length - 1)) * cW;
  const sy = v => cH - ((v - min) / (max - min)) * cH;
  const mkPath = t => data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${sx(i).toFixed(2)} ${sy(d[t]).toFixed(2)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200, overflow: 'visible' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        {activeTickers.map(t => (
          <linearGradient key={t} id={`grad-${t}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={TICKER_COLORS[t]} stopOpacity="0.18" />
            <stop offset="100%" stopColor={TICKER_COLORS[t]} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      <g transform={`translate(${pad.l},${pad.t})`}>
        {[0,0.25,0.5,0.75,1].map((v,i) => (
          <g key={i}>
            <line x1={0} y1={cH*v} x2={cW} y2={cH*v} stroke="#f1f5f9" strokeWidth="1" />
            <text x={-6} y={cH*v+4} textAnchor="end" fontSize="9" fill="#cbd5e1">{Math.round(max - v*(max-min))}</text>
          </g>
        ))}
        {data.map((d,i) => (
          <text key={i} x={sx(i)} y={cH+20} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.date}</text>
        ))}
        {activeTickers.map(t => {
          const p = mkPath(t);
          const fill = `${p} L ${sx(data.length-1).toFixed(2)} ${cH} L 0 ${cH} Z`;
          return (
            <g key={t}>
              <path d={fill} fill={`url(#grad-${t})`} />
              <path d={p} fill="none" stroke={TICKER_COLORS[t]} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              {data.map((d,i) => <circle key={i} cx={sx(i)} cy={sy(d[t])} r="3" fill={TICKER_COLORS[t]} stroke="#fff" strokeWidth="1.5" />)}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function HeatmapTile({ ticker, score, change }) {
  const isPos = change >= 0;
  const intensity = score >= 70 ? 0.1 + ((score-70)/30)*0.28 : score < 50 ? 0.08 + ((50-score)/50)*0.22 : 0.03;
  const bg = score >= 70 ? `rgba(99,102,241,${intensity})` : score < 50 ? `rgba(239,68,68,${intensity})` : 'rgba(0,0,0,0.02)';
  return (
    <motion.div whileHover={{ scale: 1.07, y: -2 }} transition={{ duration: 0.15 }} className="heatmap-tile" style={{ background: bg }}>
      <div className="heatmap-tile-header">
        <span className="heatmap-ticker-name">{ticker}</span>
        <span className={`heatmap-change ${isPos ? 'pos' : 'neg'}`}>
          {isPos ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
          {isPos ? '+' : ''}{change}
        </span>
      </div>
      <div className="heatmap-score">{score}</div>
      <div className="heatmap-score-label">Score</div>
    </motion.div>
  );
}

function NewsItem({ item }) {
  const isPos = item.sentiment === 'positive';
  return (
    <div className="news-item">
      <span className={`news-ticker-pill ${isPos ? 'pos' : 'neg'}`}>{item.ticker}</span>
      <div className="news-headline">
        <p className="news-headline-text">{item.headline}</p>
        <div className="news-meta">
          <span>{item.source}</span>
          <span style={{ color: '#e5e7eb' }}>·</span>
          <span>{item.time}</span>
        </div>
      </div>
      <span className={`news-score ${isPos ? 'pos' : 'neg'}`}>{isPos ? '+' : '-'}{Math.abs(item.score)}</span>
    </div>
  );
}

const kpiCards = [
  { label: 'Avg. Sentiment',  value: '71.4',  sub: 'Across portfolio', colorClass: 'emerald' },
  { label: 'Bullish Signals', value: '28',    sub: 'Last 24 hours',    colorClass: 'emerald' },
  { label: 'Bearish Signals', value: '9',     sub: 'Last 24 hours',    colorClass: 'red'     },
  { label: 'Articles Today',  value: '2,140', sub: 'Ingested so far',  colorClass: 'blue'    },
];

export default function Dashboard() {
  const [activeTickers, setActiveTickers] = useState(ALL_TICKERS);
  const toggle = t => setActiveTickers(prev =>
    prev.includes(t) ? (prev.length > 1 ? prev.filter(x => x !== t) : prev) : [...prev, t]
  );

  return (
    <section id="dashboard" className="section dashboard">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center" style={{ marginBottom: 48 }}>
          <p className="section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span className="pulse-dot" /> Live Dashboard
          </p>
          <h2 className="section-title">Sentiment Intelligence</h2>
          <p className="section-sub">Real-time NLP scores across stocks, sectors, and events.</p>
        </motion.div>

        <div className="kpi-grid">
          {kpiCards.map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }} className="kpi-card">
              <p className="kpi-label">{kpi.label}</p>
              <p className={`kpi-value ${kpi.colorClass}`}>{kpi.value}</p>
              <p className="kpi-sub">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="chart-news-grid">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="card-panel">
            <div className="panel-header">
              <div>
                <h3 className="panel-title">7-Day Sentiment Trend</h3>
                <p className="panel-sub">NLP score (0–100)</p>
              </div>
              <div className="ticker-toggles">
                {ALL_TICKERS.map(t => (
                  <button key={t} onClick={() => toggle(t)} className={`ticker-toggle${activeTickers.includes(t) ? ' active' : ''}`} style={activeTickers.includes(t) ? { background: TICKER_COLORS[t] } : {}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {activeTickers.length > 0 && <SentimentChart data={sentimentTimelineData} activeTickers={activeTickers} />}
            <div className="chart-legend">
              {activeTickers.map(t => (
                <span key={t} className="legend-item">
                  <span className="legend-dot" style={{ background: TICKER_COLORS[t] }} />{t}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }} className="card-panel">
            <div className="panel-header" style={{ marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Newspaper size={14} color="#9ca3af" />
                <h3 className="panel-title">AI News Feed</h3>
              </div>
              <span className="live-badge">Live</span>
            </div>
            <p className="panel-sub" style={{ marginBottom: 12 }}>Ranked by sentiment impact</p>
            <div>{topNewsItems.map(item => <NewsItem key={item.id} item={item} />)}</div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} className="card-panel">
          <div className="heatmap-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Activity size={14} color="#9ca3af" />
              <div>
                <h3 className="panel-title">Sentiment Heatmap</h3>
                <p className="panel-sub">Green = bullish · Red = bearish · Intensity = conviction</p>
              </div>
            </div>
            <div className="heatmap-legend">
              <div className="heatmap-legend-item"><span className="heatmap-swatch" style={{ background: '#818cf8' }} />Positive</div>
              <div className="heatmap-legend-item"><span className="heatmap-swatch" style={{ background: '#fca5a5' }} />Negative</div>
            </div>
          </div>
          <div className="heatmap-grid">
            {heatmapData.map(item => <HeatmapTile key={item.ticker} {...item} />)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
