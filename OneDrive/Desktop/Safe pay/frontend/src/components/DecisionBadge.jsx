const CONFIG = {
  ALLOW: { icon: '✅', label: 'ALLOWED', bg: 'rgba(16,185,129,0.12)', color: '#10b981', glow: 'rgba(16,185,129,0.3)', border: 'rgba(16,185,129,0.35)' },
  WARN:  { icon: '⚠️', label: 'WARNING', bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)', border: 'rgba(245,158,11,0.35)' },
  BLOCK: { icon: '🚫', label: 'BLOCKED', bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', glow: 'rgba(239,68,68,0.4)',  border: 'rgba(239,68,68,0.4)' },
}

export default function DecisionBadge({ decision, large = false }) {
  const c = CONFIG[decision] || CONFIG.WARN
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: large ? '12px 24px' : '5px 13px',
        borderRadius: 9999,
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 16px ${c.glow}`,
        fontWeight: 800,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontSize: large ? 15 : 11,
        animation: 'slideIn 0.3s cubic-bezier(0.4,0,0.2,1)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: large ? '1.1em' : '1em' }}>{c.icon}</span>
      <span>{c.label}</span>
    </div>
  )
}
