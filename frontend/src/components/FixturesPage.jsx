import { useState, useEffect } from "react";
import { fetchFixtures } from "../adapters/fixture-adapters";
import PredictionForm from "./PredictionForm";

function FixturesPage({ currentUser, handleLogout, activeLeague }) {
  const [fixtures, setFixtures] = useState([]);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFixtures = async () => {
      setIsLoading(true);
      const { data, error } = await fetchFixtures();

      if (error) setError(error.message);
      else setFixtures(data);

      setIsLoading(false);
    };

    loadFixtures(); // initial load

    const interval = setInterval(() => {
      loadFixtures(); // auto refresh
    }, 60000); // every 60 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <section>
      <p className="page-title">Upcoming Fixtures</p>
      {isLoading && <p>Loading fixtures...</p>}
      {error && <p className="error">{error}</p>}

      {/* PREDICTION PANEL AT TOP */}
      {selectedFixture && (
        <div className="prediction-panel">
          <h3>
            Predict: {selectedFixture.home_team}{" "}
            <span className="vs-badge">VS</span> {selectedFixture.away_team}
          </h3>
          <PredictionForm
            fixture={selectedFixture}
            activeLeague={activeLeague}
            loadPredictions={() => {}}
          />
        </div>
      )}

      {!isLoading && !fixtures.length && (
        <p className="empty-state">No upcoming fixtures.</p>
      )}

      <ul id="fixture-list">
        {fixtures.map((fixture) => (
          <li className="fixture-card" key={fixture.fixture_id}>
            <div>
              <div className="fixture-teams">
                {fixture.home_team}
                <span className="vs-badge">VS</span>
                {fixture.away_team}
              </div>
              <div className="fixture-date">
                {new Date(fixture.match_date).toLocaleString()}
              </div>
            </div>
            <button
              className="predict-btn"
              onClick={() => {
                setSelectedFixture(fixture);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Predict
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FixturesPage;
