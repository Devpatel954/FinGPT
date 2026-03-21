import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, BarChart2, Newspaper, Bell,
  Bookmark, Search, TrendingUp, Menu, X, LogOut,
  Activity, Tag, FileText
} from 'lucide-react'

const navSections = [
  {
    label: 'Overview',
    links: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'AI Tools',
    links: [
      { to: '/sentiment',  icon: Activity,   label: 'Sentiment Feed' },
      { to: '/prediction', icon: TrendingUp, label: 'Predictions' },
      { to: '/keywords',   icon: Tag,        label: 'Keyword Extractor' },
      { to: '/earnings',   icon: FileText,   label: 'Earnings Analysis' },
      { to: '/search',     icon: Search,     label: 'News Search' },
    ],
  },
  {
    label: 'Portfolio',
    links: [
      { to: '/analyze', icon: BarChart2, label: 'Analyze Stock' },
      { to: '/news',    icon: Newspaper, label: 'News Feed' },
      { to: '/alerts',  icon: Bell,      label: 'Alerts' },
      { to: '/saved',   icon: Bookmark,  label: 'Saved Insights' },
    ],
  },
]

const PAGE_TITLES = {
  '/dashboard': 'Market Dashboard',
  '/analyze':   'Analyze Stock',
  '/news':      'News Feed',
  '/alerts':    'Alerts',
  '/saved':     'Saved Insights',
  '/sentiment':  'Sentiment Feed',
  '/prediction': 'Predictions',
  '/keywords':   'Keyword Extractor',
  '/earnings':   'Earnings Analysis',
  '/search':     'News Search',
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  const TICKERS = ['AAPL','TSLA','NVDA','MSFT','GOOGL','META','AMD','AMZN','NFLX','JPM','BA','GS']

  function handleSearch(e) {
    const v = e.target.value.toUpperCase()
    setSearchVal(v)
    if (v.length < 1) { setSearchResults([]); return }
    setSearchResults(TICKERS.filter(t => t.startsWith(v)).slice(0, 5))
  }

  function goAnalyze(ticker) {
    setSearchVal('')
    setSearchResults([])
    navigate('/analyze', { state: { ticker } })
  }

  const currentPath = window.location.pathname
  const pageTitle = PAGE_TITLES[currentPath] ?? 'FinGPT'

  return (
    <div className="app-shell">
      {/* ── Sidebar overlay (mobile) ── */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <a className="sidebar-logo" href="/">
          <div className="sidebar-logo-mark">F</div>
          <span className="sidebar-logo-text">Fin<span>GPT</span></span>
        </a>

        <nav className="sidebar-nav">
          {navSections.map(section => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.links.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon size={18} />
                  <span className="sidebar-link-label">{label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" className="sidebar-link">
            <LogOut size={18} />
            <span className="sidebar-link-label">Back to Site</span>
          </a>
        </div>
      </aside>

      {/* ── Top Nav ── */}
      <header className="app-topnav">
        <button
          className="topnav-icon-btn"
          style={{ display: 'none', border: 'none' }}
          aria-label="menu"
          id="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(o => !o)}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <span className="topnav-title" style={{ display: 'none' }} id="mobile-title">
          {pageTitle}
        </span>

        <div style={{ position: 'relative' }}>
          <div className="topnav-search">
            <Search size={15} />
            <input
              placeholder="Search ticker (AAPL, TSLA…)"
              value={searchVal}
              onChange={handleSearch}
              onFocus={e => e.target.select()}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(t => (
                <div key={t} className="search-result-item" onClick={() => goAnalyze(t)}>
                  <span className="search-result-sym">{t}</span>
                  <span style={{ color: 'var(--gray-400)', fontSize: 12 }}>Analyze sentiment →</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="topnav-icon-btn" aria-label="alerts" onClick={() => navigate('/alerts')}>
          <Bell size={16} />
          <span className="badge" />
        </button>


      </header>

      {/* ── Main content ── */}
      <main className="app-content">
        <Outlet />
      </main>

      {/* Mobile sidebar toggle button (CSS targets @media) */}
      <style>{`
        @media(max-width:768px){
          #sidebar-toggle-btn { display: flex !important; }
          #mobile-title { display: block !important; }
          .topnav-search { display: none; }
        }
      `}</style>
    </div>
  )
}
