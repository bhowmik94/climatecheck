const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";

export async function getCoordinates(cityName) {
  const res = await fetch(
    `${BASE_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,
  );
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`City "${cityName}" not found.`);
  }

  const { latitude, longitude, name, country, timezone } = data.results[0];
  return { latitude, longitude, name, country, timezone };
}
