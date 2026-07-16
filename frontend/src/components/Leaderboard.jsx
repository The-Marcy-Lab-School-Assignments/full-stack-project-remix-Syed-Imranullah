import { useEffect, useState } from "react";
import { fetchLeaderboard } from "../adapters/leaderboard-adapters";

const rankIcon = (i) => {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return i + 1;
};

function Leaderboard({ activeLeague, currentUser }) {
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

  if (!activeLeague)
    return (
      <div className="info-banner" style={{ marginTop: "1rem" }}>
        ℹ️ Select a league to see the leaderboard.
      </div>
    );
  if (isLoading) return <p style={{ color: "#64748b" }}>Loading leaderboard…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!standings.length)
    return <p className="empty-state">No members in this league yet.</p>;

  const maxPts = Math.max(1, Number(standings[0]?.total_points));

  return (
    <section>
      <h2 className="page-title">{activeLeague.league_name} — Leaderboard</h2>

      <div className="lb-wrap">
        {standings.map((player, index) => {
          const isYou = currentUser && player.user_id === currentUser.user_id;
          const pts = Number(player.total_points);
          const pct = Math.round((pts / maxPts) * 100);

          return (
            <div
              key={player.user_id}
              className={`lb-row${isYou ? " lb-you" : ""}${index < 3 ? ` lb-top` : ""}`}
            >
              <div className="lb-rank">{rankIcon(index)}</div>

              <div className="lb-info">
                <span className="lb-name">{player.username}</span>
                {isYou && <span className="lb-you-tag">You</span>}
              </div>

              <div className="lb-bar-track">
                <div className="lb-bar-fill" style={{ width: `${pct || 2}%` }} />
              </div>

              <div className="lb-pts">{pts} <span className="lb-pts-label">pts</span></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Leaderboard;
