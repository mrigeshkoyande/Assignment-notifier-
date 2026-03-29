import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: '⬡',  emoji: '🛡️', label: 'Dashboard',    desc: 'Overview' },
  { to: '/send',      icon: '↗',  emoji: '💸', label: 'Send Money',   desc: 'Pay & Analyze' },
  { to: '/scanner',   icon: '◎',  emoji: '🔍', label: 'Scam Scanner', desc: 'Detect Threats' },
  { to: '/history',   icon: '≡',  emoji: '📋', label: 'History',      desc: 'All Transactions' },
  { to: '/report',    icon: '⚑',  emoji: '🚨', label: 'Report Fraud', desc: 'Get Help' },
]

export default function Navbar() {
  const [hoveredItem, setHoveredItem] = useState(null)

  return (
    <>
      {/* Sidebar nav — desktop */}
      <nav className="navbar-sidebar">
        {/* Brand */}
        <div className="nav-brand">
          <div className="nav-logo">
            <span className="nav-logo-emoji">🛡️</span>
            <div className="nav-logo-ring" />
          </div>
          <div>
            <div className="nav-brand-title">Safe‑Pay AI</div>
            <div className="nav-brand-sub">Fraud Protection</div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="nav-status">
          <span className="pulse-dot" />
          AI Agents Active
          <span className="nav-status-badge">6</span>
        </div>

        {/* Nav links */}
        <ul className="nav-list">
          {navItems.map(({ to, emoji, label, desc }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
                onMouseEnter={() => setHoveredItem(to)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <span className="nav-icon-wrap">
                  <span className="nav-icon-emoji">{emoji}</span>
                </span>
                <span className="nav-link-text">
                  <span className="nav-link-label">{label}</span>
                  <span className="nav-link-desc">{desc}</span>
                </span>
                <span className="nav-link-arrow">›</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="nav-footer">
          <div className="nav-footer-card">
            <div className="nav-footer-icon">✨</div>
            <div>
              <div className="nav-footer-title">Powered by Gemini AI</div>
              <div className="nav-footer-sub">Google ADK · Multi-Agent</div>
            </div>
          </div>
          <div className="nav-version">v2.0 · Safe-Pay AI</div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="navbar-bottom">
        {navItems.map(({ to, emoji, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `bottom-tab ${isActive ? 'bottom-tab-active' : ''}`}
          >
            <span className="bottom-tab-icon">{emoji}</span>
            <span className="bottom-tab-label">{label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>

      <style>{`
        /* ── Sidebar ── */
        .navbar-sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0; left: 0;
          background: linear-gradient(180deg, #0e0b1a 0%, #07050f 100%);
          border-right: 1px solid rgba(139, 92, 246, 0.12);
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          gap: 20px;
          z-index: 100;
          overflow: hidden;
        }
        .navbar-sidebar::before {
          content: '';
          position: absolute;
          top: -80px; left: -80px;
          width: 260px; height: 260px;
          background: radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .navbar-sidebar::after {
          content: '';
          position: absolute;
          bottom: -60px; right: -60px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Brand */
        .nav-brand {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 10px;
        }
        .nav-logo {
          width: 46px; height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15));
          border: 1.5px solid rgba(139,92,246,0.35);
          display: flex; align-items: center; justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        .nav-logo-emoji {
          font-size: 22px;
          z-index: 1;
          position: relative;
          filter: drop-shadow(0 0 8px rgba(139,92,246,0.6));
        }
        .nav-logo-ring {
          position: absolute;
          inset: -1px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(139,92,246,0.5), rgba(99,102,241,0.3), transparent);
          opacity: 0.5;
        }
        .nav-brand-title {
          font-family: 'Outfit', 'Inter', sans-serif;
          font-size: 17px; font-weight: 800;
          color: #f5f0ff;
          letter-spacing: -0.3px;
        }
        .nav-brand-sub { font-size: 11px; color: rgba(168,156,200,0.7); margin-top: 1px; }

        /* Live status */
        .nav-status {
          display: flex; align-items: center; gap: 8px;
          font-size: 12px; color: #10b981;
          background: rgba(16,185,129,0.08);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 10px;
          padding: 9px 13px;
          font-weight: 600;
          letter-spacing: 0.2px;
        }
        .nav-status-badge {
          margin-left: auto;
          background: rgba(16,185,129,0.15);
          border: 1px solid rgba(16,185,129,0.3);
          border-radius: 20px;
          font-size: 10px;
          padding: 1px 7px;
          font-weight: 800;
        }

        /* Nav list */
        .nav-list { list-style: none; display: flex; flex-direction: column; gap: 3px; flex: 1; }
        .nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 12px;
          border-radius: 12px;
          font-size: 14px; font-weight: 500;
          color: rgba(168,156,200,0.85);
          transition: all 250ms cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
          text-decoration: none;
        }
        .nav-link::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%) scaleY(0);
          width: 3px; height: 60%;
          background: linear-gradient(180deg, #8b5cf6, #6366f1);
          border-radius: 0 3px 3px 0;
          transition: transform 250ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 50%, rgba(139,92,246,0.08) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 200ms;
        }
        .nav-link:hover {
          color: #f5f0ff;
          background: rgba(139,92,246,0.08);
        }
        .nav-link:hover::after { opacity: 1; }
        .nav-link-active {
          color: #a78bfa !important;
          background: rgba(139,92,246,0.12) !important;
          border: 1px solid rgba(139,92,246,0.2);
          font-weight: 600;
        }
        .nav-link-active::before { transform: translateY(-50%) scaleY(1) !important; }
        .nav-link-active::after { opacity: 1 !important; }

        /* Icon */
        .nav-icon-wrap {
          width: 34px; height: 34px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px;
          background: rgba(139,92,246,0.06);
          border: 1px solid rgba(139,92,246,0.1);
          transition: all 250ms cubic-bezier(0.34,1.56,0.64,1);
          flex-shrink: 0;
          position: relative; z-index: 1;
        }
        .nav-link:hover .nav-icon-wrap {
          background: rgba(139,92,246,0.15);
          border-color: rgba(139,92,246,0.3);
          transform: scale(1.08);
        }
        .nav-link-active .nav-icon-wrap {
          background: rgba(139,92,246,0.18) !important;
          border-color: rgba(139,92,246,0.35) !important;
          box-shadow: 0 0 14px rgba(139,92,246,0.25);
        }
        .nav-icon-emoji { font-size: 16px; line-height: 1; }

        /* Labels */
        .nav-link-text { display: flex; flex-direction: column; gap: 1px; flex: 1; position: relative; z-index: 1; }
        .nav-link-label { font-size: 13.5px; font-weight: 600; line-height: 1.2; }
        .nav-link-desc { font-size: 10px; color: rgba(90,79,114,0.9); font-weight: 400; line-height: 1; }
        .nav-link:hover .nav-link-desc { color: rgba(168,156,200,0.6); }
        .nav-link-active .nav-link-desc { color: rgba(167,139,250,0.6) !important; }

        /* Arrow */
        .nav-link-arrow {
          font-size: 16px; color: rgba(90,79,114,0.5);
          transition: transform 200ms, color 200ms;
          position: relative; z-index: 1;
        }
        .nav-link:hover .nav-link-arrow { transform: translateX(3px); color: rgba(139,92,246,0.7); }
        .nav-link-active .nav-link-arrow { color: rgba(139,92,246,0.5) !important; }

        /* Footer */
        .nav-footer { padding-top: 14px; border-top: 1px solid rgba(139,92,246,0.1); }
        .nav-footer-card {
          display: flex; align-items: center; gap: 10px;
          background: rgba(139,92,246,0.06);
          border: 1px solid rgba(139,92,246,0.12);
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 8px;
        }
        .nav-footer-icon { font-size: 18px; flex-shrink: 0; }
        .nav-footer-title { font-size: 12px; color: rgba(245,240,255,0.8); font-weight: 600; }
        .nav-footer-sub   { font-size: 10px; color: rgba(90,79,114,0.8); margin-top: 1px; }
        .nav-version { font-size: 10px; color: rgba(90,79,114,0.6); text-align: center; letter-spacing: 0.5px; }

        /* ── Mobile Bottom Nav ── */
        .navbar-bottom {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0;
          background: rgba(13, 9, 24, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(139,92,246,0.15);
          z-index: 100;
        }
        .bottom-tab {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; gap: 4px;
          padding: 10px 4px 12px;
          color: rgba(90,79,114,0.9);
          transition: all 200ms;
          text-decoration: none;
          position: relative;
        }
        .bottom-tab::before {
          content: '';
          position: absolute;
          top: 0; left: 20%; right: 20%;
          height: 2px;
          background: linear-gradient(90deg, #8b5cf6, #6366f1);
          border-radius: 0 0 4px 4px;
          transform: scaleX(0);
          transition: transform 250ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .bottom-tab-active::before { transform: scaleX(1); }
        .bottom-tab:active { transform: scale(0.95); }
        .bottom-tab-icon { font-size: 22px; line-height: 1; transition: transform 200ms cubic-bezier(0.34,1.56,0.64,1); }
        .bottom-tab-active { color: #a78bfa; }
        .bottom-tab-active .bottom-tab-icon { transform: scale(1.15); }
        .bottom-tab-label { font-size: 10px; font-weight: 600; letter-spacing: 0.2px; }

        @media (max-width: 900px) {
          .navbar-sidebar { display: none; }
          .navbar-bottom  { display: flex; }
        }
      `}</style>
    </>
  )
}
