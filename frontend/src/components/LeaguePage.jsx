import { useEffect, useState } from "react";
import {
  fetchLeagues,
  createLeague,
  joinLeague,
  deleteLeague,
} from "../adapters/league-adapters";

function LeaguePage({ currentUser, setActiveLeague, activeLeague, handleDeactivateLeague }) {
  const [leagues, setLeagues] = useState([]);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);

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
    setError(null);
    const form = e.target;
    const league_name = form.league_name.value.trim();
    const invite_code = form.invite_code.value.trim().toUpperCase();
    if (!league_name || !invite_code) return setError("Both fields are required.");
    const { error } = await createLeague(league_name, invite_code);
    if (error) return setError(error.message || "Invite code already taken.");
    form.reset();
    loadLeagues();
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError(null);
    const form = e.target;
    const invite_code = form.invite_code.value.trim().toUpperCase();
    const { error } = await joinLeague(invite_code);
    if (error) return setError("League not found. Check the invite code.");
    form.reset();
    loadLeagues();
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section>
      <p className="page-title">Your Leagues</p>

      {error && <p className="error">{error}</p>}

      {!leagues.length && (
        <p className="empty-state">No leagues yet. Create or join one below.</p>
      )}

      <ul className="league-list">
        {leagues.map((l) => {
          const isActive = activeLeague?.league_id === l.league_id;
          const isOwner = l.created_by === currentUser.user_id;
          return (
            <li
              key={l.league_id}
              className={`league-card ${isActive ? "active-league" : ""}`}
            >
              <div className="league-card-main">
                <div>
                  <div className="league-name">
                    {l.league_name}
                    {isOwner && <span className="league-owner-badge">Owner</span>}
                    {isActive && <span className="league-active-badge">Active</span>}
                  </div>
                  <div className="league-meta">
                    <span className="league-code-text">
                      🔑 {l.invite_code}
                    </span>
                    <button
                      className="copy-btn"
                      onClick={() => copyCode(l.invite_code)}
                    >
                      {copied === l.invite_code ? "Copied!" : "Copy"}
                    </button>
                    {l.member_count && (
                      <span className="league-members">
                        👥 {l.member_count} {Number(l.member_count) === 1 ? "member" : "members"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="league-card-actions">
                  {isActive ? (
                    <button className="league-deactivate-btn" onClick={handleDeactivateLeague}>
                      Deactivate
                    </button>
                  ) : (
                    <button className="league-select-btn" onClick={() => setActiveLeague(l)}>
                      Set Active
                    </button>
                  )}
                  {isOwner && (
                    <button
                      className="delete-btn"
                      onClick={async (e) => {
                        e.stopPropagation();
                        const ok = window.confirm(`Delete league "${l.league_name}"? This cannot be undone.`);
                        if (!ok) return;
                        await deleteLeague(l.league_id);
                        if (isActive) handleDeactivateLeague();
                        loadLeagues();
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="league-forms">
        <div className="form-card">
          <p className="section-title">Create a League</p>
          <form onSubmit={handleCreate}>
            <input name="league_name" placeholder="League name" required />
            <input name="invite_code" placeholder="Invite code e.g. GOAT2025" required />
            <p className="auth-hint">Friends will use this code to join your league.</p>
            <button className="create-btn" type="submit">Create League</button>
          </form>
        </div>

        <div className="form-card">
          <p className="section-title">Join a League</p>
          <form onSubmit={handleJoin}>
            <input name="invite_code" placeholder="Enter invite code" required />
            <p className="auth-hint">Ask a friend for their league's invite code.</p>
            <button className="create-btn" type="submit">Join League</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default LeaguePage;
