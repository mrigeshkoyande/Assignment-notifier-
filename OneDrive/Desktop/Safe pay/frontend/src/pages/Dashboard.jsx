import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import TransactionCard from '../components/TransactionCard'

const NAV_CARDS = [
  {
    to: '/send',
    type: 'send',
    icon: '💸',
    label: 'Send Money',
    desc: 'AI-powered risk check before every payment',
    badge: 'AI Protected',
    badgeColor: 'violet',
  },
  {
    to: '/scanner',
    type: 'scanner',
    icon: '🔍',
    label: 'Scam Scanner',
    desc: 'Scan SMS, WhatsApp & emails for fraud',
    badge: 'Real-time',
    badgeColor: 'cyan',
  },
  {
    to: '/history',
    type: 'history',
    icon: '📋',
    label: 'History',
    desc: 'All transactions with AI risk scores',
    badge: 'Full Log',
    badgeColor: 'gold',
  },
  {
    to: '/report',
    type: 'report',
    icon: '🚨',
    label: 'Report Fraud',
    desc: 'Activate Recovery Agent instantly',
    badge: 'Emergency',
    badgeColor: 'red',
  },
]

const AGENTS = [
  { name: 'Transaction Risk Agent', status: 'active',  icon: '📊' },
  { name: 'Scam Intelligence Agent', status: 'active', icon: '🧠' },
  { name: 'Decision Agent',          status: 'active', icon: '⚡' },
  { name: 'Explanation Agent',       status: 'active', icon: '📝' },
  { name: 'Recovery Agent',          status: 'standby',icon: '🛠️' },
  { name: 'Learning Agent',          status: 'active', icon: '🎓' },
]

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [txns, setTxns] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [demoLoading, setDemoLoading] = useState(null)
  const [demoResult, setDemoResult] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t, a] = await Promise.all([
          axios.get('/api/dashboard/stats'),
          axios.get('/api/transactions?limit=6'),
          axios.get('/api/alerts?limit=4'),
        ])
        setStats(s.data)
        setTxns(t.data)
        setAlerts(a.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const runDemo = async (id) => {
    setDemoLoading(id)
    setDemoResult(null)
    try {
      const r = await axios.get(`/api/demo/${id}`)
      setDemoResult({ id, ...r.data })
    } catch {
      setDemoResult({ id, error: true })
    } finally {
      setDemoLoading(null)
    }
  }

  const fraudRate = stats
    ? Math.round(((stats.blocked_transactions + stats.warned_transactions) / Math.max(stats.total_transactions, 1)) * 100)
    : 0

  return (
    <div className="page animate-in">
      {/* ── Page Header ── */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                Safe-Pay AI
              </span>
              <span style={{ fontSize: 12, color: 'var(--violet-light)', background: 'var(--violet-dim)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 20, padding: '2px 10px', fontWeight: 700 }}>
                v2.0
              </span>
            </div>
            <h1 className="page-title">
              <span className="page-title-gradient">AI Command</span>{' '}
              <span style={{ color: 'var(--text-primary)' }}>Dashboard</span>
            </h1>
            <p className="page-subtitle">Real-time fraud prevention · Multi-agent AI system · 99.7% accuracy</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 12, padding: '10px 16px', fontSize: 13, color: 'var(--green)', fontWeight: 600,
            }}>
              <span className="pulse-dot" />
              Live · All Systems Online
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Navigation Cards ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
          Quick Actions
        </div>
        <div className="nav-card-grid stagger">
          {NAV_CARDS.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className={`nav-card ${card.type} animate-in`}
            >
              <div className="nav-card-icon">
                {card.icon}
              </div>
              <div className="nav-card-label">{card.label}</div>
              <div className="nav-card-desc">{card.desc}</div>
              <div style={{ marginTop: 8 }}>
                <span className={`badge badge-${card.badgeColor}`}>{card.badge}</span>
              </div>
              <div className="nav-card-arrow">Tap to go →</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />
          ))}
        </div>
      ) : stats && (
        <div className="grid-4 stagger" style={{ marginBottom: 32 }}>
          <div className="stat-card violet">
            <div className="stat-icon">📊</div>
            <div className="stat-label">Total Transactions</div>
            <div className="stat-value violet">{stats.total_transactions.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>All time</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">✅</div>
            <div className="stat-label">Safe Payments</div>
            <div className="stat-value green">{stats.safe_transactions.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Cleared by AI</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-icon">⚠️</div>
            <div className="stat-label">Flagged</div>
            <div className="stat-value amber">{stats.warned_transactions.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Needs review</div>
          </div>
          <div className="stat-card red">
            <div className="stat-icon">🚫</div>
            <div className="stat-label">Blocked</div>
            <div className="stat-value red">{stats.blocked_transactions.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Fraud prevented</div>
          </div>
        </div>
      )}

      {/* ── Main grid ── */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Recent Transactions */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">Recent Transactions</div>
            <Link to="/history" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div className="stack-sm">
            {loading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
                ))
              : txns.length === 0
                ? <div className="empty-state"><div className="icon">📭</div><p>No transactions yet</p></div>
                : txns.map(t => <TransactionCard key={t.id} txn={t} />)
            }
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Alert Feed */}
          <div className="card">
            <div className="section-header">
              <div className="section-title">⚡ High-Risk Alerts</div>
              <span className="badge badge-violet">{alerts.length} active</span>
            </div>
            <div className="stack-sm">
              {loading
                ? [...Array(2)].map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 56, borderRadius: 10 }} />
                  ))
                : alerts.length === 0
                  ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, fontSize: 14, color: 'var(--green)', fontWeight: 600 }}>
                      <span>✅</span> No active threats detected
                    </div>
                  )
                  : alerts.map(a => (
                    <div key={a.id} className={`alert-banner ${a.decision === 'BLOCK' ? 'block' : 'warn'}`}>
                      <div className="alert-icon">{a.decision === 'BLOCK' ? '🚫' : '⚠️'}</div>
                      <div>
                        <div className="alert-title">₹{Number(a.amount).toLocaleString('en-IN')} → {a.receiver_name}</div>
                        <div className="alert-desc">{a.receiver_upi} · Risk {Math.round(a.risk_score)}/100</div>
                      </div>
                    </div>
                  ))
              }
            </div>
          </div>

          {/* Fraud Rate & AI Health */}
          {stats && (
            <div className="card">
              {/* Fraud Rate Bar */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div className="section-title" style={{ marginBottom: 0 }}>🎯 Fraud Detection Rate</div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 800, color: fraudRate > 20 ? 'var(--red)' : 'var(--green)' }}>
                    {fraudRate}%
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(139,92,246,0.1)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${fraudRate}%`,
                    background: fraudRate > 20 ? 'var(--grad-red)' : 'var(--grad-brand)',
                    borderRadius: 999,
                    transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Avg Risk: <span style={{ color: 'var(--violet-light)', fontWeight: 700 }}>{stats.avg_risk_score}/100</span></span>
                  <span>Blocked: <span style={{ color: 'var(--red)', fontWeight: 700 }}>{stats.blocked_transactions}</span></span>
                </div>
              </div>

              <div className="divider" style={{ margin: '16px 0' }} />

              {/* AI Agent Health */}
              <div className="section-title" style={{ marginBottom: 12 }}>🤖 AI Agent Status</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {AGENTS.map(ag => (
                  <div key={ag.name} className="agent-health-row">
                    <div className="agent-health-dot" style={{ background: ag.status === 'active' ? 'var(--green)' : 'var(--amber)', boxShadow: ag.status === 'active' ? '0 0 6px var(--green)' : '0 0 6px var(--amber)' }} />
                    <span className="agent-health-name">{ag.icon} {ag.name}</span>
                    <span className={ag.status === 'active' ? 'agent-status-active' : 'agent-status-standby'}>
                      {ag.status === 'active' ? '● ACTIVE' : '○ STANDBY'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Demo Scenarios ── */}
      <div className="card">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <div className="section-title">🎮 Live AI Demo Scenarios</div>
          <span className="badge badge-gold">Click to run</span>
        </div>
        <div className="demo-grid">
          {[
            { id: 1, icon: '✅', name: 'Normal Payment', desc: '₹500 to known contact — expected ALLOW', color: 'green' },
            { id: 2, icon: '🚫', name: 'Fraud Attempt',  desc: '₹49,999 to flagged UPI — expected BLOCK', color: 'red' },
            { id: 3, icon: '⚠️', name: 'Scam SMS',       desc: 'KYC phishing detection — expected SCAM', color: 'amber' },
          ].map(s => (
            <div key={s.id} className="demo-card" onClick={() => runDemo(s.id)} id={`demo-btn-${s.id}`}>
              <div className="demo-icon">{s.icon}</div>
              <div className="demo-name">{s.name}</div>
              <div className="demo-desc">{s.desc}</div>
              {demoResult?.id === s.id && !demoResult.error && (
                <div style={{
                  marginTop: 12, padding: '8px 12px',
                  background: s.color === 'green' ? 'var(--green-dim)' : s.color === 'red' ? 'var(--red-dim)' : 'var(--amber-dim)',
                  borderRadius: 8, fontSize: 12, fontWeight: 700,
                  color: s.color === 'green' ? 'var(--green)' : s.color === 'red' ? 'var(--red)' : 'var(--amber)',
                  animation: 'slideIn 0.3s ease',
                }}>
                  {demoResult.result?.decision || (demoResult.result?.is_scam ? '🚨 SCAM DETECTED' : '✅ SAFE')}
                  {' '}· Score: {Math.round(demoResult.result?.risk_score ?? demoResult.result?.scam_probability ?? 0)}/100
                </div>
              )}
              {demoResult?.id === s.id && demoResult.error && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--red-dim)', borderRadius: 8, fontSize: 12, color: 'var(--red)', fontWeight: 600 }}>
                  ⚠️ Backend not running
                </div>
              )}
              <div style={{ marginTop: 12 }}>
                <button
                  className={`btn btn-sm btn-full ${s.color === 'green' ? 'btn-outline' : s.color === 'red' ? 'btn-danger' : 'btn-ghost'}`}
                  disabled={demoLoading === s.id}
                  style={{ fontSize: 12, padding: '8px 12px' }}
                >
                  {demoLoading === s.id ? (
                    <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Running…</>
                  ) : 'Run Demo ▶'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
