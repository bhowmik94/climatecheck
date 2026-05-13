import { getVerdict } from "../utils/scoring";
import MetricRow from "./MetricRow";
import WeatherBadge from "./WeatherBadge";

export default function ScoreCard({ location, current, daily, scores }) {
  const moveVerdict = getVerdict(scores.move);
  const visitVerdict = getVerdict(scores.visit);
  const soilTemp = daily?.soil_temperature_0cm?.[0];

  return (
    <div className="score-card">
      <div className="location-header">
        <h2>{location.name}</h2>
        <p className="location-sub">
          {location.country} · {location.timezone}
        </p>
        <WeatherBadge
          code={current.weather_code}
          humidity={current.relative_humidity_2m}
          precipitation={current.precipitation}
        />
      </div>

      <div className="score-row">
        <div className="score-block">
          <p className="score-type">Move Score</p>
          <p className="score-number" style={{ color: moveVerdict.color }}>
            {scores.move}
          </p>
          <p className="score-verdict" style={{ color: moveVerdict.color }}>
            {moveVerdict.label}
          </p>
        </div>
        <div className="score-divider" />
        <div className="score-block">
          <p className="score-type">Visit Score</p>
          <p className="score-number" style={{ color: visitVerdict.color }}>
            {scores.visit}
          </p>
          <p className="score-verdict" style={{ color: visitVerdict.color }}>
            {visitVerdict.label}
          </p>
        </div>
      </div>

      <div className="metrics">
        <MetricRow
          icon="🌡️"
          label="Temperature"
          value={`${current.temperature_2m}°C (feels ${current.apparent_temperature}°C)`}
          score={scores.breakdown.temperature}
        />
        <MetricRow
          icon="☀️"
          label="UV Index"
          value={`${scores.uvUsed} (daily max)`}
          score={scores.breakdown.uv}
        />
        <MetricRow
          icon="💨"
          label="Wind Speed"
          value={`${current.wind_speed_10m} km/h`}
          score={scores.breakdown.wind}
        />
        <MetricRow
          icon="💧"
          label="Humidity"
          value={`${current.relative_humidity_2m}%`}
          score={scores.breakdown.humidity}
        />
        <MetricRow
          icon="🌧️"
          label="Precipitation"
          value={`${current.precipitation} mm`}
          score={scores.breakdown.precipitation}
        />
        <MetricRow
          icon="🌱"
          label="Soil Temp"
          value={
            soilTemp !== undefined && soilTemp !== null
              ? `${soilTemp}°C`
              : "N/A"
          }
          score={scores.breakdown.soilTemp}
        />
      </div>
    </div>
  );
}
