import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Landing page components
import Navbar      from './components/layout/Navbar'
import Footer      from './components/layout/Footer'
import Hero        from './components/sections/Hero'
import Dashboard   from './components/sections/Dashboard'
import Features    from './components/sections/Features'
import Architecture from './components/sections/Architecture'
import CTA         from './components/sections/CTA'

// App layout & pages
import AppLayout      from './layouts/AppLayout'
import DashboardPage  from './pages/DashboardPage'
import AnalyzePage    from './pages/AnalyzePage'
import NewsPage       from './pages/NewsPage'
import AlertsPage     from './pages/AlertsPage'
import SavedPage      from './pages/SavedPage'
import SentimentPage  from './pages/SentimentPage'
import PredictionPage from './pages/PredictionPage'
import KeywordsPage   from './pages/KeywordsPage'
import EarningsPage   from './pages/EarningsPage'
import SearchPage     from './pages/SearchPage'

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar />
      <main>
        <Hero />
        <Dashboard />
        <Features />
        <Architecture />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyze"   element={<AnalyzePage />} />
          <Route path="/news"      element={<NewsPage />} />
          <Route path="/alerts"    element={<AlertsPage />} />
          <Route path="/saved"     element={<SavedPage />} />
          <Route path="/sentiment"  element={<SentimentPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/keywords"   element={<KeywordsPage />} />
          <Route path="/earnings"   element={<EarningsPage />} />
          <Route path="/search"     element={<SearchPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
