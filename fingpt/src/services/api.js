/**
 * Central API service — all backend calls go through here.
 * Backend: http://localhost:8001
 */

const BASE = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
  ? 'https://fingpt-1-d9xv.onrender.com'
  : 'http://localhost:8001'

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

// ── Sentiment ─────────────────────────────────────────────
export const getSentiment = (ticker, mode = 'realtime') =>
  get(`/sentiment/?ticker=${encodeURIComponent(ticker)}&mode=${mode}`)

// ── Prediction ────────────────────────────────────────────
export const getPrediction = (ticker, range = '7d') =>
  get(`/prediction/?ticker=${encodeURIComponent(ticker)}&range=${range}`)

// ── Keywords ─────────────────────────────────────────────
export const getKeywords = (text) => post('/keywords/', { text })

// ── Earnings ─────────────────────────────────────────────
export const getEarnings = (text) => post('/earnings/', { text })

// ── Search ───────────────────────────────────────────────
export const searchArticles = (query) => post('/search/', { query })

// ── Alerts ───────────────────────────────────────────────
export const getAlerts = () => get('/alerts/')
export const createAlert = (ticker, condition, threshold) =>
  post('/alerts/', { ticker, condition, threshold })
export const deleteAlert = (id) =>
  fetch(`${BASE}/alerts/${id}`, { method: 'DELETE' })

// ── Health ────────────────────────────────────────────────
export const checkHealth = () => get('/health')
