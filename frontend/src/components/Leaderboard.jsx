import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../adapters/leaderboard-adapters";

function Leaderboard({ activeLeague }) {
  const [standings, setStandings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeLeague) return;
    const load = async () => {
      setIsLoading(true);
      const { data, error } = await fetchLeaderboard(activeLeague.league_id);
      if (error) setError(error.message);
      else setStandings(data);
      setIsLoading(false);
    };
    load();
  }, [activeLeague]);

  if (!activeLeague) return <p>Select a league to see the leaderboard.</p>;
  if (isLoading) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!standings.length) return <p>No members in this league yet.</p>;

  return (
  <section>
      <h2 className="page-title"> {activeLeague.league_name}</h2>

    <div className="leaderboard-wrap">

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Points</th>
          </tr>
        </thead>

        <tbody>
          {standings.map((player, index) => (
            <tr key={player.user_id}>
              <td>{index + 1}</td>
              <td>{player.username}</td>
              <td>{player.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
}

export default Leaderboard;
