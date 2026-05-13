export default function WeatherBadge({ code, humidity, precipitation }) {
  const label =
    code === 0 ? '☀️ Clear sky'
    : code <= 3 ? '⛅ Partly cloudy'
    : code <= 48 ? '🌫️ Foggy'
    : code <= 67 ? '🌧️ Rainy'
    : code <= 77 ? '🌨️ Snowy'
    : code <= 82 ? '🌦️ Showers'
    : '⛈️ Thunderstorm'

  return (
    <div className="weather-badge">
      <span className="badge-label">{label}</span>
      <span className="badge-detail">💧 {humidity}% humidity</span>
      <span className="badge-detail">🌧 {precipitation} mm now</span>
    </div>
  )
}