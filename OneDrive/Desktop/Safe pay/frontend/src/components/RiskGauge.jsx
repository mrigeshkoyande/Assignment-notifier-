import { useEffect, useRef } from 'react'

const colorMap = {
  ALLOW: { stroke: '#10b981', text: '#10b981', label: 'LOW RISK' },
  WARN:  { stroke: '#f59e0b', text: '#f59e0b', label: 'MEDIUM RISK' },
  BLOCK: { stroke: '#ef4444', text: '#ef4444', label: 'HIGH RISK' },
}

function getColor(score) {
  if (score >= 70) return colorMap.BLOCK
  if (score >= 40) return colorMap.WARN
  return colorMap.ALLOW
}

export default function RiskGauge({ score = 0, decision, size = 160 }) {
  const circleRef = useRef(null)
  const r = (size / 2) - 16
  const circumference = 2 * Math.PI * r
  const pct = Math.min(score, 100) / 100
  const dashOffset = circumference * (1 - pct * 0.75) // 270° arc
  const colors = decision ? colorMap[decision] || getColor(score) : getColor(score)

  useEffect(() => {
    if (!circleRef.current) return
    circleRef.current.style.strokeDashoffset = circumference
    setTimeout(() => {
      if (circleRef.current) circleRef.current.style.strokeDashoffset = dashOffset
    }, 60)
  }, [score, dashOffset, circumference])

  return (
    <div className="risk-gauge-wrap">
      <svg
        className="risk-gauge-svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ color: colors.stroke }}
      >
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={`${circumference * 0.125}`}
          strokeLinecap="round"
          transform={`rotate(135 ${size/2} ${size/2})`}
        />
        {/* Animated fill */}
        <circle
          ref={circleRef}
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          transform={`rotate(135 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 6px ${colors.stroke})` }}
        />
        {/* Score text */}
        <text
          x="50%" y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={colors.text}
          fontSize={size * 0.2}
          fontWeight="800"
          fontFamily="JetBrains Mono, monospace"
          dy="-6"
        >
          {Math.round(score)}
        </text>
        <text
          x="50%" y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="rgba(148,163,184,0.7)"
          fontSize={size * 0.085}
          fontWeight="600"
          dy={size * 0.13}
          letterSpacing="1"
        >
          / 100
        </text>
      </svg>
      <div className="risk-gauge-label" style={{ color: colors.text }}>
        {colors.label}
      </div>
    </div>
  )
}
