import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ExplanationCard from '../components/ExplanationCard'

const PRESETS = [
  {
    label: '✅ Normal Payment',
    sub: '₹500 to known contact',
    color: 'green',
    data: { sender_upi: 'rahul@upi', receiver_upi: 'priya@upi', receiver_name: 'Priya Patel', amount: 500, location: 'Mumbai, MH', note: 'Coffee' },
  },
  {
    label: '🚫 High Risk',
    sub: '₹49,999 flagged UPI',
    color: 'red',
    data: { sender_upi: 'rahul@upi', receiver_upi: '9999999999@paytm', receiver_name: 'Raj Kumar', amount: 49999, location: 'Delhi, DL', note: 'Investment' },
  },
  {
    label: '⚠️ Medium Risk',
    sub: '₹8,000 new merchant',
    color: 'amber',
    data: { sender_upi: 'rahul@upi', receiver_upi: 'newshop@upi', receiver_name: 'New Shop', amount: 8000, location: 'Pune, MH', note: 'Purchase' },
  },
]

export default function SendMoney() {
  const [form, setForm] = useState({
    sender_upi: 'rahul@upi',
    receiver_upi: '',
    receiver_name: '',
    amount: '',
    location: 'Mumbai, MH',
    note: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activePreset, setActivePreset] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const analyze = async (e) => {
    e.preventDefault()
    if (!form.receiver_upi || !form.amount) { setError('Receiver UPI and amount are required.'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const r = await axios.post('/api/analyze_transaction', { ...form, amount: parseFloat(form.amount) })
      setResult(r.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Backend error — is the server running?')
    } finally {
      setLoading(false)
    }
  }

  const loadPreset = (idx, p) => {
    setActivePreset(idx)
    setForm(f => ({ ...f, ...p.data, amount: String(p.data.amount) }))
    setResult(null)
  }

  return (
    <div className="page animate-in">
      {/* Page Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', fontSize: 12 }}>
            ← Dashboard
          </Link>
        </div>
        <h1 className="page-title">
          <span className="page-title-gradient">Send Money</span>
        </h1>
        <p className="page-subtitle">AI-powered risk analysis before every payment — powered by 4 specialized agents</p>
      </div>

      <div className="grid-2">
        {/* Left — Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Preset cards */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 14 }}>⚡ Quick Test Scenarios</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  id={`preset-${i}`}
                  className="btn btn-ghost btn-sm"
                  style={{
                    justifyContent: 'flex-start',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 10,
                    borderColor: activePreset === i
                      ? p.color === 'green' ? 'rgba(16,185,129,0.5)' : p.color === 'red' ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'
                      : undefined,
                    background: activePreset === i
                      ? p.color === 'green' ? 'var(--green-dim)' : p.color === 'red' ? 'var(--red-dim)' : 'var(--amber-dim)'
                      : undefined,
                  }}
                  onClick={() => loadPreset(i, p)}
                >
                  <span style={{ fontSize: 18 }}>{p.label.split(' ')[0]}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{p.label.slice(2)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{p.sub}</div>
                  </div>
                  {activePreset === i && (
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: p.color === 'green' ? 'var(--green)' : p.color === 'red' ? 'var(--red)' : 'var(--amber)', fontWeight: 700 }}>
                      ✓ Active
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Payment form */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 20 }}>Payment Details</div>
            <form id="send-money-form" onSubmit={analyze} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* UPI fields side by side */}
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Your UPI ID</label>
                  <input id="sender-upi" className="form-input" value={form.sender_upi} onChange={e => set('sender_upi', e.target.value)} placeholder="yourname@upi" />
                </div>
                <div className="form-group">
                  <label className="form-label">Receiver UPI ID *</label>
                  <input id="receiver-upi" className="form-input" value={form.receiver_upi} onChange={e => set('receiver_upi', e.target.value)} placeholder="merchant@paytm" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Receiver Name</label>
                <input id="receiver-name" className="form-input" value={form.receiver_name} onChange={e => set('receiver_name', e.target.value)} placeholder="Raj Stores" />
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--violet-light)', fontWeight: 700, fontSize: 16 }}>₹</span>
                  <input
                    id="amount"
                    className="form-input mono"
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.amount}
                    onChange={e => set('amount', e.target.value)}
                    placeholder="0.00"
                    required
                    style={{ paddingLeft: 32 }}
                  />
                </div>
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input id="location" className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="City, State" />
                </div>
                <div className="form-group">
                  <label className="form-label">Note / Purpose</label>
                  <input id="note" className="form-input" value={form.note} onChange={e => set('note', e.target.value)} placeholder="e.g. Coffee" />
                </div>
              </div>

              {error && <div className="inline-error">❌ {error}</div>}

              <button id="analyze-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Analyzing with 4 AI Agents…
                  </>
                ) : '🔍 Analyze Transaction'}
              </button>
            </form>
          </div>
        </div>

        {/* Right — Analysis result */}
        <div>
          {(loading || result) ? (
            <ExplanationCard result={result} loading={loading} />
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 460 }}>
              <div style={{ fontSize: 72, opacity: 0.12, marginBottom: 20, filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.3))' }}>🛡️</div>
              <div style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>AI Analysis Ready</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
                Fill in the payment details or pick a quick scenario, then click Analyze.
              </div>
              <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
                {[
                  { name: 'Transaction Risk Agent', color: 'var(--violet-light)' },
                  { name: 'Scam Intelligence Agent', color: 'var(--cyan)' },
                  { name: 'Decision Agent', color: 'var(--gold)' },
                  { name: 'Explanation Agent', color: 'var(--green)' },
                ].map((a, i) => (
                  <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, opacity: 0.5, boxShadow: `0 0 6px ${a.color}` }} />
                    {a.name}
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: a.color, fontWeight: 700, opacity: 0.6 }}>READY</span>
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
