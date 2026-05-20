import { useEffect, useState } from "react";
import {
  fetchLeagues,
  createLeague,
  joinLeague,
  deleteLeague,
} from "../adapters/league-adapters";


function LeaguePage({
  currentUser,
  handleLogout,
  setActiveLeague,
  activeLeague,
  handleDeactivateLeague,
}) {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState(null);

  const loadLeagues = async () => {
    const { data, error } = await fetchLeagues();
    if (error) return setError(error.message);
    setLeagues(data);
  };

  useEffect(() => {
    loadLeagues();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const league_name = form.league_name.value;
    const invite_code = form.invite_code.value;
    const { error } = await createLeague(league_name, invite_code);
    if (error) return setError(error.message || "Invite code already taken.");
    form.reset();
    loadLeagues();
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const invite_code = form.invite_code.value;
    const { error } = await joinLeague(invite_code);
    if (error) return setError("League not found. Check the invite code.");
    form.reset();
    loadLeagues();
  };
  const handleSelectLeague = (league) => {
    setActiveLeague(league);
    localStorage.setItem("activeLeague", JSON.stringify(league));
  };
  return (
    <section>
      <p className="page-title">Your Leagues</p>

      {error && <p className="error">{error}</p>}

      {!leagues.length && (
        <p className="empty-state">No leagues yet. Create or join one below.</p>
      )}

      <ul style={{ listStyle: "none", marginBottom: "1.5rem" }}>
        {leagues.map((l) => (
          <li
            key={l.league_id}
            className={`league-card ${activeLeague?.league_id === l.league_id ? "active-league" : ""}`}
            onClick={() => handleSelectLeague(l)}
          >
            <div>
              <div className="league-name">{l.league_name}</div>
              <div className="league-code">Code: {l.invite_code}</div>
            </div>
            {l.created_by === currentUser.user_id && (
              <button
                className="delete-btn"
                onClick={async (e) => {
                  e.stopPropagation();
                  await deleteLeague(l.league_id);
                  loadLeagues();
                }}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        <div className="form-card">
          <p className="section-title">Create League</p>
          <form onSubmit={handleCreate}>
            <input name="league_name" placeholder="League name" />
            <input name="invite_code" placeholder="Invite code e.g. MATCH123" />
            <button className="create-btn" type="submit">
              Create League
            </button>
          </form>
        </div>

        <div className="form-card">
          <p className="section-title">Join League</p>
          <form onSubmit={handleJoin}>
            <input name="invite_code" placeholder="Enter invite code" />
            <button className="create-btn" type="submit">
              Join League
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LeaguePage;
