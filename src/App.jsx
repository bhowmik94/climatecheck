import { useState } from "react";
import { getCoordinates } from "./api/geocoding";
import { getWeather } from "./api/weather";
import { calculateScores } from "./utils/scoring";
import SearchBar from "./components/SearchBar";
import ScoreCard from "./components/ScoreCard";
import "./App.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleSearch(cityName) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const location = await getCoordinates(cityName);
      const { current, daily } = await getWeather(
        location.latitude,
        location.longitude,
        location.timezone,
      );
      const scores = calculateScores(current, daily);
      setResult({ location, current, daily, scores });
      console.log(scores)
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Should I Move There?</h1>
        <p className="app-subtitle">
          Get a weather-based livability & visit score for any place on Earth.
        </p>
        <SearchBar onSearch={handleSearch} loading={loading} />
      </header>

      <main className="app-main">
        {error && <div className="error-box">⚠️ {error}</div>}
        {result && (
          <ScoreCard
            location={result.location}
            current={result.current}
            daily={result.daily}
            scores={result.scores}
          />
        )}
        {!result && !loading && !error && (
          <p className="placeholder">
            Try "Lisbon", "Kyoto", or "Cape Town" ✈️
          </p>
        )}
      </main>
    </div>
  );
}
