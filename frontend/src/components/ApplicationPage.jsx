import { useState, useEffect } from "react";
import { fetchAllPredictions } from "../adapters/prediction-adapters";
import PredictionList from "./PredictionList";

function ApplicationPage({ currentUser, activeLeague }) {
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPredictions = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllPredictions(activeLeague?.league_id);
    if (fetchError) setError(fetchError.message);
    else setPredictions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPredictions();
  }, [activeLeague]);

  if (!activeLeague) {
    return (
      <div className="info-banner" style={{ marginTop: "1rem" }}>
        ℹ️ Select a league to view your predictions.
      </div>
    );
  }

  const total = predictions.length;
  const correct = predictions.filter((p) => p.points === 3).length;
  const totalPts = predictions.reduce((sum, p) => sum + (p.points ?? 0), 0);
  const locked = predictions.filter((p) => new Date(p.match_date) < new Date()).length;

  return (
    <section>
      <h2 className="page-title">{activeLeague.league_name} — My Predictions</h2>

      {total > 0 && (
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Predictions</span>
          </div>
          <div className="stat-card">
            <span className="stat-value stat-green">{correct}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{total - locked}</span>
            <span className="stat-label">Open</span>
          </div>
          <div className="stat-card">
            <span className="stat-value stat-green">{totalPts}</span>
            <span className="stat-label">Total Points</span>
          </div>
        </div>
      )}

      {isLoading && <p style={{ color: "#64748b" }}>Loading predictions…</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      {!isLoading && !predictions.length && (
        <div className="empty-state">
          <p>No predictions yet.</p>
          <p>Head to <strong>Fixtures</strong> to make your first prediction.</p>
        </div>
      )}
      <PredictionList predictions={predictions} loadPredictions={loadPredictions} />
    </section>
  );
}

export default ApplicationPage;
