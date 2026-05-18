import { useEffect, useState } from "react";
import { fetchFixtures } from "../adapters/fixture-adapters";

function FixturesPage({ currentUser, handleLogout }) {
  const [fixtures, setFixtures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFixtures = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error } = await fetchFixtures();

    if (error) {
      setError(error.message);
    } else {
      setFixtures(data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadFixtures();
  }, []);

  return (
    <section>
      {/* user header */}
      <div id="user-controls">
        <span>
          Welcome, <strong>{currentUser.username}</strong>
        </span>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Upcoming Fixtures</h2>

      {isLoading && <p>Loading fixtures...</p>}
      {error && <p className="error">{error}</p>}

      <ul>
        {fixtures.map((f) => (
          <li key={f.fixture_id} className="fixture-card">
            <div>
              <strong>{f.home_team}</strong> vs{" "}
              <strong>{f.away_team}</strong>
            </div>

            <div>
              📅 {new Date(f.match_date).toLocaleString()}
            </div>

            <div>Status: {f.status}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FixturesPage;