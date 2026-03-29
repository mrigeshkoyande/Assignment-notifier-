import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import TransactionCard from '../components/TransactionCard'

const FILTERS = [
  { key: 'ALL',   icon: '📊', label: 'All', color: 'var(--violet-light)' },
  { key: 'ALLOW', icon: '✅', label: 'Safe',    color: 'var(--green)' },
  { key: 'WARN',  icon: '⚠️', label: 'Flagged', color: 'var(--amber)' },
  { key: 'BLOCK', icon: '🚫', label: 'Blocked',  color: 'var(--red)' },
]

export default function TransactionHistory() {
  const [txns, setTxns] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    axios.get('/api/transactions?limit=50')
      .then(r => setTxns(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? txns : txns.filter(t => t.decision === filter)
  const count = (k) => k === 'ALL' ? txns.length : txns.filter(t => t.decision === k).length

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div style={{ marginBottom: 6 }}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', fontSize: 12 }}>
            ← Dashboard
          </Link>
        </div>
        <h1 className="page-title">
          <span className="page-title-gradient">Transaction</span>{' '}
          <span>History</span>
        </h1>
        <p className="page-subtitle">All payments analyzed by AI — with risk scores and decisions</p>
      </div>

      {/* Summary stats */}
      {!loading && txns.length > 0 && (
        <div className="grid-4 stagger" style={{ marginBottom: 24 }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              id={`filter-${f.key.toLowerCase()}`}
              onClick={() => setFilter(f.key)}
              style={{
                background: filter === f.key
                  ? f.key === 'ALL' ? 'var(--violet-dim)' : f.key === 'ALLOW' ? 'var(--green-dim)' : f.key === 'WARN' ? 'var(--amber-dim)' : 'var(--red-dim)'
                  : 'var(--bg-card)',
                border: `1.5px solid ${filter === f.key ? f.color : 'var(--border)'}`,
                borderRadius: 14,
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 250ms cubic-bezier(0.4,0,0.2,1)',
                textAlign: 'center',
                transform: filter === f.key ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: filter === f.key ? `0 8px 24px rgba(0,0,0,0.3)` : 'none',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
              <div style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: f.color, lineHeight: 1 }}>
                {count(f.key)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginTop: 4, fontWeight: 600 }}>
                {f.label}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filter pill tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`btn btn-sm ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f.key)}
            style={{ borderRadius: 999 }}
          >
            {f.icon} {f.label}
            <span className="mono" style={{ opacity: 0.7, fontSize: 11 }}>({count(f.key)})</span>
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} shown
        </div>
      </div>

      {/* Transaction list */}
      <div className="card">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 68, borderRadius: 12 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No {filter !== 'ALL' ? filter.toLowerCase() + ' ' : ''}transactions found</p>
            {filter !== 'ALL' && (
              <button className="btn btn-ghost btn-sm" onClick={() => setFilter('ALL')} style={{ marginTop: 12 }}>
                Show all transactions
              </button>
            )}
          </div>
        ) : (
          <div className="stack-sm">
            {filtered.map(t => <TransactionCard key={t.id} txn={t} />)}
          </div>
        )}
      </div>

      {/* Footer tip */}
      {!loading && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--violet-dim)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>💡</span>
          <span>Transactions with risk score <strong style={{ color: 'var(--red)' }}>≥ 75</strong> are automatically blocked. Scores between <strong style={{ color: 'var(--amber)' }}>40–74</strong> are flagged for review.</span>
        </div>
      )}
    </div>
  )
}
