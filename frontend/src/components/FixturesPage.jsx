import { useState, useEffect } from "react";
import { fetchFixtures } from "../adapters/fixture-adapters";
import { fetchAllPredictions } from "../adapters/prediction-adapters";
import PredictionForm from "./PredictionForm";

const formatMatchDate = (dateStr) => {
  const d = new Date(dateStr);
  const date = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
};

function FixturesPage({ currentUser, activeLeague }) {
  const [fixtures, setFixtures] = useState([]);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [predictedIds, setPredictedIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFixtures = async () => {
    setIsLoading(true);
    const { data, error } = await fetchFixtures();
    if (error) setError(error.message);
    else setFixtures(data);
    setIsLoading(false);
  };

  const loadPredictedIds = async () => {
    if (!activeLeague) { setPredictedIds(new Set()); return; }
    const { data } = await fetchAllPredictions(activeLeague.league_id);
    if (data) setPredictedIds(new Set(data.map((p) => p.fixture_id)));
  };

  useEffect(() => {
    loadFixtures();
    const interval = setInterval(loadFixtures, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadPredictedIds();
  }, [activeLeague]);

  const handlePredicted = () => {
    loadPredictedIds();
    setSelectedFixture(null);
  };

  return (
    <section>
      <p className="page-title">Upcoming Fixtures</p>

      {!activeLeague && (
        <div className="info-banner">
          ℹ️ Join or create a league to start making predictions.
        </div>
      )}

      {isLoading && !fixtures.length && (
        <p style={{ color: "#64748b" }}>Loading fixtures…</p>
      )}
      {error && <p className="error">{error}</p>}

      {selectedFixture && (
        <div className="prediction-panel">
          <div className="prediction-panel-header">
            <div>
              <h3>Make Your Prediction</h3>
              <p className="prediction-panel-match">
                {selectedFixture.home_team} vs {selectedFixture.away_team}
              </p>
            </div>
            <button className="panel-close-btn" onClick={() => setSelectedFixture(null)}>✕</button>
          </div>
          <PredictionForm
            fixture={selectedFixture}
            activeLeague={activeLeague}
            onPredicted={handlePredicted}
          />
        </div>
      )}

      {!isLoading && !fixtures.length && (
        <div className="empty-state">
          <p>No upcoming fixtures right now.</p>
          <p>Fixtures sync automatically every 5 minutes.</p>
        </div>
      )}

      <ul id="fixture-list">
        {fixtures.map((fixture) => {
          const alreadyPredicted = predictedIds.has(fixture.fixture_id);
          const isLive = fixture.status === "live";

          return (
            <li
              className={`fixture-card${isLive ? " fixture-live" : ""}`}
              key={fixture.fixture_id}
            >
              <div className="fixture-body">
                <div className="fixture-matchup">
                  <span className="fixture-team fixture-team-home">{fixture.home_team}</span>
                  <span className="fixture-score-badge">
                    {fixture.status === "finished" || isLive
                      ? `${fixture.home_score ?? 0} – ${fixture.away_score ?? 0}`
                      : "VS"}
                  </span>
                  <span className="fixture-team fixture-team-away">{fixture.away_team}</span>
                </div>

                <div className="fixture-meta">
                  {fixture.status === "upcoming" && (
                    <span className="fixture-date">{formatMatchDate(fixture.match_date)}</span>
                  )}
                  {isLive && <span className="fixture-status live">🔴 Live now</span>}
                  {fixture.status === "finished" && (
                    <span className="fixture-status finished">Full Time</span>
                  )}
                </div>
              </div>

              <div className="fixture-actions">
                {alreadyPredicted && (
                  <span className="predicted-badge">✓ Predicted</span>
                )}
                {!isLive && fixture.status !== "finished" && (
                  <button
                    className="predict-btn"
                    onClick={() => {
                      setSelectedFixture(fixture);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {alreadyPredicted ? "Change" : "Predict"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default FixturesPage;
