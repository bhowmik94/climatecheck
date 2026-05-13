export default function MetricRow({ icon, label, value, score }) {
  const color =
    score >= 75 ? '#22c55e'
    : score >= 50 ? '#f59e0b'
    : '#ef4444'

  return (
    <div className="metric-row">
      <span className="metric-icon">{icon}</span>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}</span>
      <div className="metric-bar-bg">
        <div className="metric-bar-fill" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="metric-score" style={{ color }}>{score}</span>
    </div>
  )
}