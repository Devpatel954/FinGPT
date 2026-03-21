import { useState } from 'react'
import { User, Bell, Shield, Database, Palette, ChevronRight } from 'lucide-react'

const SECTIONS = [
  { id: 'profile',        icon: User,    label: 'Profile' },
  { id: 'notifications',  icon: Bell,    label: 'Notifications' },
  { id: 'security',       icon: Shield,  label: 'Security' },
  { id: 'data',           icon: Database,label: 'Data & Sources' },
  { id: 'appearance',     icon: Palette, label: 'Appearance' },
]

function Toggle({ on, onToggle }) {
  return (
    <button className={`toggle-switch${on ? ' on' : ''}`} onClick={onToggle} />
  )
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [profile, setProfile] = useState({ name: 'Maria Chen', email: 'maria@fingpt.ai', role: 'Analyst', org: 'FinGPT Research' })
  const [notifs, setNotifs] = useState({ sentimentBreaks: true, weeklyDigest: true, alertEmails: true, productUpdates: false, marketOpen: false })
  const [security, setSecurity] = useState({ twoFactor: false, sessionAlerts: true })
  const [dataSources, setDataSources] = useState({ reuters: true, bloomberg: true, wsj: true, ft: true, techCrunch: false, seekingAlpha: false })

  function toggleNotif(key) { setNotifs(n => ({ ...n, [key]: !n[key] })) }
  function toggleSecurity(key) { setSecurity(s => ({ ...s, [key]: !s[key] })) }
  function toggleSource(key) { setDataSources(d => ({ ...d, [key]: !d[key] })) }

  return (
    <div className="page-fade">
      <div className="page-header">
        <div className="page-title">Settings</div>
        <div className="page-sub">Manage your account preferences and data settings</div>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar nav */}
        <div className="app-card" style={{ width: 200, flexShrink: 0, padding: '8px 0' }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '10px 16px',
                border: 'none', background: activeSection === s.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                color: activeSection === s.id ? 'var(--emerald)' : 'var(--gray-700)',
                fontWeight: activeSection === s.id ? 700 : 500,
                fontSize: 14, cursor: 'pointer', borderRadius: 'var(--radius-sm)',
                textAlign: 'left', transition: 'all 0.15s'
              }}
            >
              <s.icon size={16} />
              {s.label}
              {activeSection === s.id && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </div>

        {/* Content panels */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Profile */}
          {activeSection === 'profile' && (
            <div className="app-card">
              <div className="app-card-title" style={{ marginBottom: 20 }}>Profile Information</div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--emerald), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff' }}>
                  {profile.name[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--gray-900)' }}>{profile.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>{profile.email}</div>
                  <div style={{ fontSize: 12, color: 'var(--emerald)', fontWeight: 600, marginTop: 4 }}>{profile.role}</div>
                </div>
                <button className="btn-sm" style={{ marginLeft: 'auto' }}>Change Avatar</button>
              </div>

              <div className="settings-field-row">
                <div className="settings-field">
                  <label>Full Name</label>
                  <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label>Email Address</label>
                  <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
              </div>
              <div className="settings-field-row" style={{ marginTop: 14 }}>
                <div className="settings-field">
                  <label>Role / Title</label>
                  <input value={profile.role} onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label>Organization</label>
                  <input value={profile.org} onChange={e => setProfile(p => ({ ...p, org: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <button className="btn-sm primary">Save Changes</button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="app-card">
              <div className="app-card-title" style={{ marginBottom: 20 }}>Notification Preferences</div>
              {[
                { key: 'sentimentBreaks', label: 'Sentiment Threshold Alerts', sub: 'Get notified when stocks cross your alert thresholds' },
                { key: 'weeklyDigest',    label: 'Weekly AI Digest',          sub: 'Receive a summary of top market sentiment every Monday' },
                { key: 'alertEmails',     label: 'Alert Email Notifications', sub: 'Email notifications for triggered sentiment alerts' },
                { key: 'productUpdates',  label: 'Product Updates',           sub: 'News about new features and improvements' },
                { key: 'marketOpen',      label: 'Market Open Summary',       sub: 'Daily pre-market sentiment briefing at 9am ET' },
              ].map(item => (
                <div key={item.key} className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">{item.label}</div>
                    <div className="settings-toggle-sub">{item.sub}</div>
                  </div>
                  <Toggle on={notifs[item.key]} onToggle={() => toggleNotif(item.key)} />
                </div>
              ))}
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="app-card">
              <div className="app-card-title" style={{ marginBottom: 20 }}>Security Settings</div>
              {[
                { key: 'twoFactor',    label: 'Two-Factor Authentication', sub: 'Require a verification code in addition to your password' },
                { key: 'sessionAlerts',label: 'Login Alert Emails',        sub: 'Get notified of new logins to your account' },
              ].map(item => (
                <div key={item.key} className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">{item.label}</div>
                    <div className="settings-toggle-sub">{item.sub}</div>
                  </div>
                  <Toggle on={security[item.key]} onToggle={() => toggleSecurity(item.key)} />
                </div>
              ))}
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-100)' }}>
                <div className="app-card-title" style={{ marginBottom: 12 }}>Change Password</div>
                <div className="settings-field-row">
                  <div className="settings-field">
                    <label>Current Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="settings-field">
                    <label>New Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <button className="btn-sm primary">Update Password</button>
                </div>
              </div>
            </div>
          )}

          {/* Data sources */}
          {activeSection === 'data' && (
            <div className="app-card">
              <div className="app-card-title" style={{ marginBottom: 6 }}>Data Sources</div>
              <div className="app-card-sub" style={{ marginBottom: 20 }}>Choose which news sources are included in your sentiment analysis</div>
              {[
                { key: 'reuters',      label: 'Reuters',       sub: 'Global financial and market news' },
                { key: 'bloomberg',    label: 'Bloomberg',     sub: 'Business & markets intelligence' },
                { key: 'wsj',          label: 'Wall Street Journal', sub: 'Premium business reporting' },
                { key: 'ft',           label: 'Financial Times',     sub: 'Global financial coverage' },
                { key: 'techCrunch',   label: 'TechCrunch',    sub: 'Technology and startup news' },
                { key: 'seekingAlpha', label: 'Seeking Alpha', sub: 'Investor-written equity analysis' },
              ].map(item => (
                <div key={item.key} className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">{item.label}</div>
                    <div className="settings-toggle-sub">{item.sub}</div>
                  </div>
                  <Toggle on={dataSources[item.key]} onToggle={() => toggleSource(item.key)} />
                </div>
              ))}
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="app-card">
              <div className="app-card-title" style={{ marginBottom: 20 }}>Appearance</div>
              <div className="settings-group">
                <div className="settings-label">Color Theme</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['Light','Dark','System'].map(t => (
                    <button
                      key={t}
                      className="btn-sm"
                      style={{ flex: 1, padding: '12px 8px' }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="settings-group">
                <div className="settings-label">Dashboard Density</div>
                <div className="settings-field-row">
                  <div className="settings-field">
                    <label>Layout</label>
                    <select>
                      <option>Comfortable</option>
                      <option>Compact</option>
                    </select>
                  </div>
                  <div className="settings-field">
                    <label>Default Timeframe</label>
                    <select>
                      <option>7 days</option>
                      <option>30 days</option>
                      <option>90 days</option>
                    </select>
                  </div>
                </div>
              </div>
              <button className="btn-sm primary">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
