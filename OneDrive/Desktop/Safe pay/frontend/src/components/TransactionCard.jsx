import DecisionBadge from './DecisionBadge'

function riskBarColor(score) {
  if (score >= 70) return 'linear-gradient(90deg, #ef4444, #dc2626)'
  if (score >= 40) return 'linear-gradient(90deg, #f59e0b, #d97706)'
  return 'linear-gradient(90deg, #10b981, #059669)'
}

function formatTime(ts) {
  if (!ts) return ''
  try {
    return new Date(ts).toLocaleString('en-IN', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  } catch { return ts }
}

function avatarEmoji(name = '') {
  const h = name.charCodeAt(0) % 8
  return ['👤','🧑‍💼','👩‍💼','🧑','👨‍🦱','👩','🧔','👱'][h]
}

export default function TransactionCard({ txn }) {
  return (
    <div className="txn-row">
      <div className="txn-avatar" style={{ background: 'var(--bg-card)' }}>
        {avatarEmoji(txn.receiver_name)}
      </div>
      <div className="txn-info">
        <div className="txn-name">{txn.receiver_name || 'Unknown'}</div>
        <div className="txn-upi">{txn.receiver_upi}</div>
        <div className="risk-bar-wrap" style={{ marginTop: 6, maxWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Risk</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
              {Math.round(txn.risk_score ?? 0)}/100
            </span>
          </div>
          <div className="risk-bar-track">
            <div
              className="risk-bar-fill"
              style={{
                width: `${Math.min(txn.risk_score ?? 0, 100)}%`,
                background: riskBarColor(txn.risk_score ?? 0),
              }}
            />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="txn-amount">₹{Number(txn.amount).toLocaleString('en-IN')}</div>
        <div style={{ marginTop: 4 }}>
          <DecisionBadge decision={txn.decision} />
        </div>
        <div className="txn-time">{formatTime(txn.timestamp)}</div>
      </div>
    </div>
  )
}
