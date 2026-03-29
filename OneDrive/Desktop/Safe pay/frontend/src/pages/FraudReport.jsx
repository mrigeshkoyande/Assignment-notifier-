import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const EMERGENCY = [
  { icon: '📞', label: 'Cybercrime Helpline', value: '1930', color: 'var(--violet-light)' },
  { icon: '🌐', label: 'Online Portal', value: 'cybercrime.gov.in', color: 'var(--cyan)' },
  { icon: '🏦', label: 'RBI Ombudsman', value: '14448', color: 'var(--gold)' },
]

export default function FraudReport() {
  const [form, setForm] = useState({ reported_by_upi: 'rahul@upi', transaction_id: '', description: '', amount_lost: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.description.trim()) { setError('Please describe what happened.'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const r = await axios.post('/api/report_fraud', {
        ...form,
        amount_lost: parseFloat(form.amount_lost) || 0,
      })
      setResult(r.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Backend error — is the server running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page animate-in">
      <div className="page-header">
        <div style={{ marginBottom: 6 }}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', fontSize: 12 }}>
            ← Dashboard
          </Link>
        </div>
        <h1 className="page-title">
          <span style={{ color: 'var(--red)' }}>Report</span>{' '}
          <span className="page-title-gradient">Fraud</span>
        </h1>
        <p className="page-subtitle">Our Recovery Agent activates immediately — generating reports, triggering bank action & guiding your recovery</p>
      </div>

      {/* Emergency contacts bar */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap',
      }}>
        {EMERGENCY.map(e => (
          <div key={e.label} style={{
            flex: '1 1 160px',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '12px 14px',
            transition: 'all 200ms',
            cursor: 'default',
          }}>
            <span style={{ fontSize: 22 }}>{e.icon}</span>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{e.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: e.color, fontFamily: 'JetBrains Mono' }}>{e.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Left — Form */}
        <div className="card">
          <div className="section-title" style={{ marginBottom: 4 }}>Fraud Incident Details</div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
            File a report to activate the Recovery Agent — we'll guide you through blocking, reporting, and recovery.
          </p>

          <form id="fraud-report-form" onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="grid-2" style={{ gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Your UPI ID</label>
                <input id="report-upi" className="form-input" value={form.reported_by_upi} onChange={e => set('reported_by_upi', e.target.value)} placeholder="yourname@upi" />
              </div>
              <div className="form-group">
                <label className="form-label">Transaction ID</label>
                <input id="report-txn-id" className="form-input mono" value={form.transaction_id} onChange={e => set('transaction_id', e.target.value)} placeholder="txn_xxxxxxxx" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Amount Lost (₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--red)', fontWeight: 700, fontSize: 16 }}>₹</span>
                <input
                  id="report-amount"
                  className="form-input mono"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.amount_lost}
                  onChange={e => set('amount_lost', e.target.value)}
                  placeholder="0.00"
                  style={{ paddingLeft: 32 }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Describe What Happened *</label>
              <textarea
                id="report-desc"
                className="form-textarea"
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="e.g. I received a call from someone claiming to be from SBI and they tricked me into sending ₹5000 to a UPI ID…"
                style={{ minHeight: 140 }}
                required
              />
            </div>

            {error && <div className="inline-error">❌ {error}</div>}

            <button id="submit-report-btn" type="submit" className="btn btn-danger btn-full btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Recovery Agent Activating…
                </>
              ) : '🚨 Submit Fraud Report'}
            </button>
          </form>

          {/* Warning notice */}
          <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 700, marginBottom: 4 }}>⚠️ Act Immediately</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Report fraud within <strong style={{ color: 'var(--amber)' }}>24 hours</strong> for best chance of fund recovery. Call <strong style={{ color: 'var(--gold)' }}>1930</strong> to freeze the beneficiary account.
            </div>
          </div>
        </div>

        {/* Right — Recovery panel */}
        <div>
          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 48 }}>
              <div className="spinner" />
              <div style={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 700, marginTop: 16 }}>Recovery Agent Activating…</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.7 }}>
                Filing report · Triggering bank freeze · Generating recovery plan
              </div>
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Filing cybercrime report', 'Alerting bank systems', 'Generating complaint doc', 'Drafting recovery steps'].map((s, i) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-muted)', padding: '8px 14px', background: 'var(--bg-input)', borderRadius: 8 }}>
                    <div style={{ width: 10, height: 10, border: '2px solid var(--violet)', borderTopColor: 'transparent', borderRadius: '50%', animation: `spin ${0.7 + i * 0.15}s linear infinite` }} />
                    {s}…
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="card animate-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                  📋
                </div>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>Report Filed Successfully</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', marginTop: 2 }}>ID: {result.incident_id}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span className="badge badge-amber">⏳ {result.status}</span>
                </div>
              </div>

              {/* Bank action */}
              <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700, marginBottom: 4 }}>✅ Bank Action Initiated</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{result.bank_action}</div>
              </div>

              {/* Report summary */}
              <div className="section-title" style={{ marginBottom: 10 }}>Report Summary</div>
              <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16, border: '1px solid var(--border)' }}>
                {result.report_summary}
              </div>

              {/* Recovery steps */}
              <div className="section-title" style={{ marginBottom: 12 }}>Recovery Steps</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.recovery_steps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 10, border: '1px solid var(--border)', transition: 'border-color 200ms' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--violet-dim)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--violet-light)', fontWeight: 800, flexShrink: 0, fontFamily: 'JetBrains Mono' }}>
                      {i + 1}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, textAlign: 'center', padding: '10px 14px', background: 'var(--gold-dim)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Estimated resolution:{' '}
                  <strong style={{ color: 'var(--gold)' }}>{result.estimated_resolution}</strong>
                </span>
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 460 }}>
              <div style={{ fontSize: 72, opacity: 0.1, marginBottom: 20 }}>🤖</div>
              <div style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>Recovery Agent on Standby</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 280, lineHeight: 1.6, marginBottom: 24 }}>
                Once you submit, the agent automatically takes these actions:
              </div>
              <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { step: '1', text: 'File cybercrime report', icon: '📄', color: 'var(--violet-light)' },
                  { step: '2', text: 'Trigger bank account freeze', icon: '🏦', color: 'var(--red)' },
                  { step: '3', text: 'Generate legal complaint', icon: '⚖️', color: 'var(--gold)' },
                  { step: '4', text: 'Provide recovery guidance', icon: '🗺️', color: 'var(--green)' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-input)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span>{item.text}</span>
                    <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: item.color, fontWeight: 800 }}>
                      {item.step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
