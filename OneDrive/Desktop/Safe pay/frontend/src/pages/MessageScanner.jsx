import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ExplanationCard from '../components/ExplanationCard'

const SAMPLE_MESSAGES = [
  {
    label: '⚠️ KYC Phishing',
    sub: 'SBI impersonation scam',
    color: 'red',
    data: {
      message_text: 'URGENT: Your SBI account KYC is expiring today! Your account will be BLOCKED immediately. Click here to update now: http://kyc-upd8.xyz/sbi-verify Share your OTP to confirm. — SBI Customer Care',
      sender: 'SBI-BANK',
      links: ['http://kyc-upd8.xyz/sbi-verify'],
    },
  },
  {
    label: '🎰 Lottery Scam',
    sub: 'Fake Google prize',
    color: 'amber',
    data: {
      message_text: 'Congratulations! You have WON ₹25,00,000 in the Google Diwali Lucky Draw! You have been selected as a winner. Claim your prize immediately. Send ₹500 to confirm: prize@fakebank',
      sender: 'GoogleIndia',
      links: [],
    },
  },
  {
    label: '✅ Normal OTP',
    sub: 'Legit PhonePe message',
    color: 'green',
    data: {
      message_text: 'Your OTP for login to PhonePe is 847392. This OTP is valid for 10 minutes. Do not share with anyone. - PhonePe',
      sender: 'PHONEPE',
      links: [],
    },
  },
]

export default function MessageScanner() {
  const [form, setForm] = useState({ message_text: '', sender: '', links: [] })
  const [linksText, setLinksText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeSample, setActiveSample] = useState(null)

  const loadSample = (idx, s) => {
    setActiveSample(idx)
    setForm(s.data)
    setLinksText((s.data.links || []).join('\n'))
    setResult(null)
  }

  const scan = async (e) => {
    e.preventDefault()
    if (!form.message_text.trim()) { setError('Message text is required.'); return }
    setError('')
    setLoading(true)
    setResult(null)
    const links = linksText.split('\n').map(l => l.trim()).filter(Boolean)
    try {
      const r = await axios.post('/api/analyze_message', { ...form, links })
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
          <span className="page-title-gradient">Scam Message</span>{' '}
          <span>Scanner</span>
        </h1>
        <p className="page-subtitle">Paste any SMS, WhatsApp, or email — AI detects phishing, fraud & social engineering instantly</p>
      </div>

      <div className="grid-2">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Sample messages */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 14 }}>🧪 Sample Test Messages</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SAMPLE_MESSAGES.map((s, i) => (
                <button
                  key={i}
                  id={`sample-${i}`}
                  className="btn btn-ghost btn-sm"
                  style={{
                    justifyContent: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10,
                    borderColor: activeSample === i
                      ? s.color === 'green' ? 'rgba(16,185,129,0.5)' : s.color === 'red' ? 'rgba(239,68,68,0.5)' : 'rgba(245,158,11,0.5)'
                      : undefined,
                    background: activeSample === i
                      ? s.color === 'green' ? 'var(--green-dim)' : s.color === 'red' ? 'var(--red-dim)' : 'var(--amber-dim)'
                      : undefined,
                  }}
                  onClick={() => loadSample(i, s)}
                >
                  <span style={{ fontSize: 20 }}>{s.label.split(' ')[0]}</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{s.label.slice(2)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{s.sub}</div>
                  </div>
                  {activeSample === i && (
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: s.color === 'green' ? 'var(--green)' : s.color === 'red' ? 'var(--red)' : 'var(--amber)', fontWeight: 700 }}>✓ Loaded</span>
                  )}
                </button>
              ))}
            </div>

            {/* Pattern tags */}
            <div className="divider" style={{ margin: '14px 0' }} />
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Detects patterns like
            </div>
            <div className="pattern-list">
              {['Urgency Manipulation', 'Phishing Links', 'Fake Sender ID', 'OTP Request', 'Lottery Scam', 'KYC Fraud', 'Refund Scam', 'Investment Trap'].map(p => (
                <span key={p} className="pattern-tag">{p}</span>
              ))}
            </div>
          </div>

          {/* Scanner form */}
          <div className="card">
            <div className="section-title" style={{ marginBottom: 18 }}>Message Details</div>
            <form id="scanner-form" onSubmit={scan} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Message Text *</label>
                <textarea
                  id="message-text"
                  className="form-textarea"
                  value={form.message_text}
                  onChange={e => setForm(f => ({ ...f, message_text: e.target.value }))}
                  placeholder="Paste your SMS, WhatsApp message, or email here…"
                  style={{ minHeight: 140 }}
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Sender ID</label>
                  <input
                    id="sender-id"
                    className="form-input"
                    value={form.sender}
                    onChange={e => setForm(f => ({ ...f, sender: e.target.value }))}
                    placeholder="SBI-BANK, +91…"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Suspicious Links</label>
                  <textarea
                    id="links-input"
                    className="form-textarea"
                    value={linksText}
                    onChange={e => setLinksText(e.target.value)}
                    placeholder="http://suspicious.xyz"
                    style={{ minHeight: 48, resize: 'none' }}
                  />
                </div>
              </div>

              {error && <div className="inline-error">❌ {error}</div>}

              <button id="scan-btn" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: 16, height: 16, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Scanning with Scam Intelligence Agent…
                  </>
                ) : '🔍 Scan for Scams'}
              </button>
            </form>
          </div>
        </div>

        {/* Right — Result */}
        <div>
          {(loading || result) ? (
            <ExplanationCard result={result} loading={loading} />
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 460 }}>
              <div style={{ fontSize: 72, opacity: 0.12, marginBottom: 20 }}>🔍</div>
              <div style={{ fontSize: 18, color: 'var(--text-primary)', fontWeight: 700, marginBottom: 8 }}>Scam Scanner Ready</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 280, lineHeight: 1.6, marginBottom: 24 }}>
                Load a sample message or paste your own, then tap Scan. Results appear instantly.
              </div>
              {/* How it works */}
              <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { step: '1', text: 'NLP pattern matching', icon: '🧠' },
                  { step: '2', text: 'Sender verification check', icon: '🔐' },
                  { step: '3', text: 'Link & URL analysis', icon: '🔗' },
                  { step: '4', text: 'Social engineering scoring', icon: '📊' },
                ].map(item => (
                  <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <span style={{ fontSize: 15 }}>{item.icon}</span>
                    <span>{item.text}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10, background: 'var(--violet-dim)', color: 'var(--violet-light)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: '2px 8px', fontWeight: 700 }}>
                      Step {item.step}
                    </span>
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
