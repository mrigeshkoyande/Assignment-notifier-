import RiskGauge from './RiskGauge'
import DecisionBadge from './DecisionBadge'

const severityColor = {
  LOW:    'var(--green)',
  MEDIUM: 'var(--amber)',
  HIGH:   'var(--red)',
}

const AGENTS_LOADING = [
  { name: 'Transaction Risk Agent', icon: '📊', color: 'var(--violet-light)' },
  { name: 'Scam Intelligence Agent', icon: '🧠', color: 'var(--cyan)' },
  { name: 'Decision Agent', icon: '⚡', color: 'var(--gold)' },
  { name: 'Explanation Agent', icon: '📝', color: 'var(--green)' },
]

export default function ExplanationCard({ result, loading }) {
  if (loading) {
    return (
      <div className="card animate-in" style={{ textAlign: 'center', padding: '40px 32px' }}>
        <div style={{ marginBottom: 20 }}>
          <div className="spinner" />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          AI Agents Analyzing…
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          Multi-agent pipeline running in real-time
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 300, margin: '0 auto' }}>
          {AGENTS_LOADING.map((a, i) => (
            <div
              key={a.name}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px',
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                fontSize: 13, color: 'var(--text-muted)',
                animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
              }}
            >
              <span style={{ fontSize: 15 }}>{a.icon}</span>
              <span style={{ flex: 1, textAlign: 'left' }}>{a.name}</span>
              <span style={{ display: 'inline-block', width: 12, height: 12, border: `2px solid ${a.color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: `spin ${0.7 + i * 0.1}s linear infinite` }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!result) return null

  const isTransaction = 'transaction_id' in result
  const isMessage = 'is_scam' in result
  const score = isTransaction ? result.risk_score : result.scam_probability

  // Determine color band for header
  const headerBg = result.decision === 'BLOCK' || result.is_scam
    ? 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, transparent 100%)'
    : result.decision === 'WARN' || (result.scam_probability >= 30)
      ? 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 100%)'
      : 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, transparent 100%)'

  return (
    <div className="card animate-in" style={{ background: `var(--bg-card), ${headerBg}` }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div className="section-title">🔬 Analysis Result</div>
          {isTransaction && <DecisionBadge decision={result.decision} large />}
          {isMessage && (
            <DecisionBadge decision={result.is_scam ? 'BLOCK' : result.scam_probability >= 30 ? 'WARN' : 'ALLOW'} large />
          )}
        </div>
        {isTransaction && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginTop: 6 }}>
            ID: {result.transaction_id}
          </div>
        )}
      </div>

      {/* Gauge + Explanation */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 8 }}>
        <div style={{ flexShrink: 0 }}>
          <RiskGauge score={score} decision={result.decision} size={150} />
          {result.processing_time_ms && (
            <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>
              ⚡ {result.processing_time_ms}ms
              {result.gemini_powered && <span style={{ color: 'var(--violet-light)', marginLeft: 4 }}>· 🤖 Gemini</span>}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
            AI Explanation
          </div>
          <div style={{
            fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.75,
            background: 'var(--bg-input)',
            borderRadius: 10,
            padding: '14px 16px',
            border: '1px solid var(--border)',
          }}>
            {result.explanation}
          </div>

          {result.recommended_action && (
            <div style={{
              marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '10px 14px',
              background: 'var(--violet-dim)',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: 10,
              fontSize: 13, color: 'var(--violet-light)',
            }}>
              <span>💡</span>
              <span>{result.recommended_action}</span>
            </div>
          )}
        </div>
      </div>

      {/* Scam type badge */}
      {isMessage && result.scam_type && (
        <div style={{ marginTop: 8 }}>
          <span className="badge badge-block" style={{ fontSize: 13 }}>
            🏷️ {result.scam_type.replace(/_/g, ' ')}
          </span>
        </div>
      )}

      {/* Risk Factors */}
      {result.risk_factors && result.risk_factors.length > 0 && (
        <>
          <div className="divider" />
          <div className="section-title" style={{ marginBottom: 12 }}>⚠️ Risk Factors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.risk_factors.map((rf, i) => (
              <div key={i} className="risk-factor">
                <div className="risk-factor-dot" style={{
                  background: severityColor[rf.severity] || 'var(--amber)',
                  boxShadow: `0 0 6px ${severityColor[rf.severity] || 'var(--amber)'}`,
                }} />
                <div style={{ flex: 1 }}>
                  <div className="risk-factor-name">{rf.factor}</div>
                  <div className="risk-factor-detail">{rf.detail}</div>
                </div>
                <div>
                  <span className={`badge badge-${rf.severity?.toLowerCase()}`}>{rf.severity}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Scam Patterns */}
      {result.detected_patterns && result.detected_patterns.length > 0 && (
        <>
          <div className="divider" />
          <div className="section-title" style={{ marginBottom: 12 }}>🎭 Detected Scam Patterns</div>
          <div className="pattern-list">
            {result.detected_patterns.map((p, i) => (
              <span key={i} className="pattern-tag">{p}</span>
            ))}
          </div>
        </>
      )}

      {/* Agent Pipeline Trace */}
      {result.agent_trace && result.agent_trace.length > 0 && (
        <>
          <div className="divider" />
          <div className="section-title" style={{ marginBottom: 12 }}>🔗 Agent Pipeline Trace</div>
          <div className="agent-trace">
            {result.agent_trace.map((step, i) => (
              <div key={i} className="agent-step">
                <div className="agent-dot" style={{ background: 'var(--violet-light)', boxShadow: '0 0 6px var(--violet)' }} />
                <div className="agent-name">{step.agent}</div>
                <div className="agent-val">
                  {step.score !== undefined ? `Score: ${step.score}` : ''}
                  {step.decision ? `${step.decision} (${step.confidence})` : ''}
                  {step.status === 'completed' ? <span style={{ color: 'var(--green)' }}>✓</span> : ''}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
