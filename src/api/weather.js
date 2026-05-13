const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export async function getWeather(latitude, longitude, timezone) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone: timezone || 'auto',
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'uv_index',
      'wind_speed_10m',
      'weather_code',
    ].join(','),
    daily: [
      'temperature_2m_max',
      'temperature_2m_min',
      'uv_index_max',
    ].join(','),
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  const data = await res.json()

  return {
    current: data.current,
    daily: data.daily,
  }
}