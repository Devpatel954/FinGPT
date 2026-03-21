import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Plus, Trash2, CheckCircle, Mail, MessageSquare, Link2, Pencil, ToggleLeft, ToggleRight } from 'lucide-react'
import { getAlerts, createAlert as apiCreateAlert, deleteAlert as apiDeleteAlert } from '../services/api.js'
import { activeAlerts } from '../data/appData.js'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(activeAlerts)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ticker: 'AAPL', condition: 'Sentiment drops below', threshold: 50, delivery: 'email' })
  const [enabledMap, setEnabledMap] = useState(() => Object.fromEntries(activeAlerts.map(a => [a.id, true])))
  const [editingId, setEditingId] = useState(null)
  const [editThreshold, setEditThreshold] = useState(50)
  const navigate = useNavigate()

  // Load alerts from backend on mount
  useEffect(() => {
    getAlerts().then(data => {
      if (data.alerts?.length) {
        setAlerts(data.alerts)
        setEnabledMap(Object.fromEntries(data.alerts.map(a => [a.id, true])))
      }
    }).catch(() => {/* keep local mock */})
  }, [])

  async function deleteAlert(id) {
    setAlerts(a => a.filter(x => x.id !== id))
    try { await apiDeleteAlert(id) } catch (_) {}
  }

  async function addAlert() {
    const payload = { ticker: form.ticker, condition: form.condition, threshold: Number(form.threshold) }
    try {
      const data = await apiCreateAlert(payload.ticker, payload.condition, payload.threshold)
      const newAlert = data.alert ?? {
        id: Date.now(),
        ...payload,
        current: 60,
        status: 'active',
        triggered: false,
        delivery: form.delivery,
        created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }
      setEnabledMap(m => ({ ...m, [newAlert.id]: true }))
      setAlerts(a => [newAlert, ...a])
    } catch (_) {
      // fallback: add locally
      const id = Date.now()
      const newAlert = { id, ...payload, current: 60, status: 'active', triggered: false, delivery: form.delivery, created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
      setEnabledMap(m => ({ ...m, [id]: true }))
      setAlerts(a => [newAlert, ...a])
    }
    setShowForm(false)
  }

  function toggleAlert(id) {
    setEnabledMap(m => ({ ...m, [id]: !m[id] }))
  }

  function startEdit(a) {
    setEditingId(a.id)
    setEditThreshold(a.threshold)
  }

  function saveEdit(id) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, threshold: Number(editThreshold) } : a))
    setEditingId(null)
  }

  const triggered = alerts.filter(a => a.triggered)
  const active    = alerts.filter(a => !a.triggered)

  return (
    <div className="page-fade">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            Alerts
            <span className="tag bullish" style={{ fontSize: 10, fontWeight: 700 }}>⚡ &lt;5s latency</span>
          </div>
          <div className="page-sub">Get notified when sentiment crosses your thresholds</div>
        </div>
        <button className="btn-sm primary" onClick={() => setShowForm(s => !s)}>
          <Plus size={13} style={{ display: 'inline' }} /> {showForm ? 'Cancel' : 'New Alert'}
        </button>
      </div>

      {/* New Alert form */}
      {showForm && (
        <div className="app-card" style={{ marginBottom: 20, borderColor: 'var(--emerald)' }}>
          <div className="app-card-title" style={{ marginBottom: 14 }}>Create New Alert</div>
          <div className="settings-field-row">
            <div className="settings-field">
              <label>Ticker</label>
              <select value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))}>
                {Object.keys({ AAPL:1, TSLA:1, NVDA:1, MSFT:1, GOOGL:1, META:1, AMD:1, AMZN:1, NFLX:1, JPM:1, BA:1, GS:1 }).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="settings-field" style={{ flex: 2 }}>
              <label>Condition</label>
              <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}>
                <option>Sentiment drops below</option>
                <option>Sentiment rises above</option>
              </select>
            </div>
            <div className="settings-field">
              <label>Threshold (0-100)</label>
              <input
                type="number" min="0" max="100"
                value={form.threshold}
                onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))}
              />
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Delivery Method</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {[
                { key: 'email',   Icon: Mail,          label: 'Email' },
                { key: 'slack',   Icon: MessageSquare, label: 'Slack' },
                { key: 'webhook', Icon: Link2,         label: 'Webhook' },
              ].map(({ key, Icon, label }) => (
                <button
                  key={key}
                  className={`btn-sm${form.delivery === key ? ' primary' : ''}`}
                  onClick={() => setForm(f => ({ ...f, delivery: key }))}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 0, display: 'flex', gap: 10 }}>
            <button className="btn-sm primary" onClick={addAlert}>Create Alert</button>
            <button className="btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Triggered alerts */}
      {triggered.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--emerald)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CheckCircle size={13} /> Triggered
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {triggered.map(a => (
              <div key={a.id} className="alert-card triggered">
                <div className="alert-ticker-chip">{a.ticker}</div>
                <div className="alert-info">
                  <div className="alert-condition">{a.condition}</div>
                  <div className="alert-threshold">{a.threshold}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>
                    Triggered: {a.triggeredAt} — Current: {a.current}
                  </div>
                </div>
                <span className="alert-status triggered">Triggered</span>
                <button className="btn-sm danger" onClick={() => deleteAlert(a.id)}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active alerts */}
      <div style={{ marginBottom: 12, fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        <Bell size={12} style={{ display: 'inline', marginRight: 5 }} />
        Active ({active.length})
      </div>
      {active.length === 0 ? (
        <div className="empty-state">
          <Bell />
          <div className="empty-state-title">No active alerts</div>
          <div className="empty-state-sub">Create your first alert to track sentiment thresholds.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {active.map(a => (
            <div key={a.id} className="alert-card active" style={{ opacity: enabledMap[a.id] === false ? 0.5 : 1 }}>
              <div
                className="alert-ticker-chip"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/analyze', { state: { ticker: a.ticker } })}
              >
                {a.ticker}
              </div>
              <div className="alert-info">
                {editingId === a.id ? (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>{a.condition}</span>
                    <input
                      type="number" min="0" max="100"
                      value={editThreshold}
                      onChange={e => setEditThreshold(e.target.value)}
                      style={{ width: 60, fontSize: 12, border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-sm)', padding: '3px 6px' }}
                    />
                    <button className="btn-sm primary" onClick={() => saveEdit(a.id)}>Save</button>
                    <button className="btn-sm" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <div className="alert-condition">{a.condition}</div>
                    <div className="alert-threshold">{a.threshold}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2, display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span>Score: {a.current}</span>
                      <span>·</span>
                      <span>Created {a.created}</span>
                      {a.delivery && <span>· {a.delivery === 'email' ? '📧' : a.delivery === 'slack' ? '💬' : '🔗'} {a.delivery}</span>}
                    </div>
                  </>
                )}
              </div>
              {/* Progress bar toward threshold */}
              <div style={{ width: 80, flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: 'var(--gray-400)', marginBottom: 4, textAlign: 'right' }}>
                  {a.current}/100
                </div>
                <div className="sent-bar-wrap">
                  <div
                    className="sent-bar-fill"
                    style={{
                      width: `${a.current}%`,
                      background: a.current >= 70 ? 'var(--emerald)' : a.current >= 50 ? 'var(--orange)' : 'var(--red)'
                    }}
                  />
                </div>
              </div>
              <button
                className="btn-sm"
                title={enabledMap[a.id] === false ? 'Enable alert' : 'Disable alert'}
                onClick={() => toggleAlert(a.id)}
                style={{ color: enabledMap[a.id] === false ? 'var(--gray-400)' : 'var(--emerald)' }}
              >
                {enabledMap[a.id] === false ? <ToggleLeft size={16} /> : <ToggleRight size={16} />}
              </button>
              <button className="btn-sm" title="Edit threshold" onClick={() => startEdit(a)}>
                <Pencil size={12} />
              </button>
              <button className="btn-sm danger" onClick={() => deleteAlert(a.id)}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
