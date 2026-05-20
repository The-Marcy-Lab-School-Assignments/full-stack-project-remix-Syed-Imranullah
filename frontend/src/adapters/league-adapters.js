const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// GET all user leagues
export const fetchLeagues = async () => {
  return handleFetch("/api/leagues");
};

// CREATE league
export const createLeague = async (league_name, invite_code) => {
  return handleFetch("/api/leagues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ league_name, invite_code }),
  });
};

// JOIN league
export const joinLeague = async (invite_code) => {
  return handleFetch("/api/leagues/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ invite_code }),
  });
};

export const deleteLeague = async (league_id) => {
  return handleFetch(`/api/leagues/${league_id}`, { method: "DELETE" });
};
export const fetchLeaderboard = async (league_id) => {
  return handleFetch(`/api/leaderboard/${league_id}`);
};
