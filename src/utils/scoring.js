// Each scorer returns 0–100
function scoreTemperature(temp) {
  // Ideal: 18–24°C
  if (temp >= 18 && temp <= 24) return 100;
  if (temp >= 10 && temp < 18) return 60 + ((temp - 10) / 8) * 40;
  if (temp > 24 && temp <= 32) return 60 + ((32 - temp) / 8) * 40;
  if (temp < 10) return Math.max(0, 40 + temp * 2);
  return Math.round(Math.max(0, 60 - (temp - 32) * 5));
}

function scoreUV(uv) {
  // 0–2 low (great), 3–5 moderate (ok), 6–7 high (caution), 8+ very high (bad)
  if (uv <= 2) return 100;
  if (uv <= 5) return 80;
  if (uv <= 7) return 55;
  if (uv <= 10) return 30;
  return 10;
}

function scoreWind(windKmh) {
  // < 15 calm, 15–30 breezy, 30–50 windy, 50+ harsh
  if (windKmh < 15) return 100;
  if (windKmh < 30) return 75;
  if (windKmh < 50) return 45;
  return 15;
}

function scoreHumidity(humidity) {
  // Ideal 40–60%
  if (humidity >= 40 && humidity <= 60) return 100;
  if (humidity > 60 && humidity <= 70) return 75;
  if (humidity > 70 && humidity <= 80) return 50; // was missing this band
  if (humidity > 80 && humidity <= 88) return 25; // tightened
  if (humidity > 88) return 10; // 91% → now scores 10, not 40
  if (humidity >= 30 && humidity < 40) return 75;
  if (humidity < 30) return 40;
}

function scorePrecipitation(mm) {
  if (mm === 0) return 100;
  if (mm < 1) return 80;
  if (mm < 5) return 50;
  return 20;
}

function scoreSoilTemp(soilTemp) {
  // Ideal for most plants: 10–25°C
  if (soilTemp === null || soilTemp === undefined) return 50; // neutral if missing
  if (soilTemp >= 10 && soilTemp <= 25) return 100;
  if (soilTemp >= 5 && soilTemp < 10) return 65;
  if (soilTemp > 25 && soilTemp <= 35) return 65;
  return 30;
}

// Weights for "Move" score (livability focused)
const MOVE_WEIGHTS = {
  temperature: 0.3,
  uv: 0.15,
  wind: 0.15,
  humidity: 0.2,
  precipitation: 0.1,
  soilTemp: 0.1,
};

// Weights for "Visit" score (comfort/activity focused)
const VISIT_WEIGHTS = {
  temperature: 0.35,
  uv: 0.2,
  wind: 0.2,
  humidity: 0.15,
  precipitation: 0.1,
  soilTemp: 0.0,
};

function weightedScore(scores, weights) {
  return Math.round(
    Object.keys(weights).reduce((total, key) => {
      return total + (scores[key] || 0) * weights[key];
    }, 0),
  );
}

// Heat Index formula (Rothfusz regression, valid when temp > 27°C and humidity > 40%)
export function calcHeatIndex(tempC, humidity) {
  const T = (tempC * 9) / 5 + 32; // convert to °F for the formula
  const R = humidity;

  if (T < 80 || R < 40) return tempC; // formula not reliable at low ranges, return raw

  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;

  return parseFloat((((HI - 32) * 5) / 9).toFixed(1)); // back to °C
}

export function calculateScores(current, daily) {
  const soilTemps = daily?.soil_temperature_0cm ?? [];
  const soilTemp = soilTemps.length > 0 ? soilTemps[0] : null;

  // Get the daily max UV index value
  const uvForScoring = daily?.uv_index_max?.[0] ?? current.uv_index;

  // Calculate heat index, instead of using raw temp
  const heatIndex = calcHeatIndex(
    current.temperature_2m,
    current.relative_humidity_2m,
  );

  const raw = {
    temperature: scoreTemperature(heatIndex),
    uv: scoreUV(uvForScoring),
    wind: scoreWind(current.wind_speed_10m),
    humidity: scoreHumidity(current.relative_humidity_2m),
    precipitation: scorePrecipitation(current.precipitation),
    soilTemp: scoreSoilTemp(soilTemp),
  };

  return {
    move: weightedScore(raw, MOVE_WEIGHTS),
    visit: weightedScore(raw, VISIT_WEIGHTS),
    breakdown: raw,
    uvUsed: uvForScoring,
  };
}

export function getVerdict(score) {
  if (score >= 80) return { label: "Excellent", color: "#22c55e" };
  if (score >= 65) return { label: "Good", color: "#84cc16" };
  if (score >= 50) return { label: "Fair", color: "#f59e0b" };
  if (score >= 35) return { label: "Poor", color: "#f97316" };
  return { label: "Avoid", color: "#ef4444" };
}

export function weatherCodeToLabel(code) {
  if (code === 0) return "☀️ Clear sky";
  if (code <= 3) return "⛅ Partly cloudy";
  if (code <= 48) return "🌫️ Foggy";
  if (code <= 67) return "🌧️ Rainy";
  if (code <= 77) return "🌨️ Snowy";
  if (code <= 82) return "🌦️ Showers";
  if (code <= 99) return "⛈️ Thunderstorm";
  return "🌡️ Unknown";
}
