const pool = require("../db/pool");

// create a league
module.exports.create = async (league_name, invite_code, user_id) => {
  const { rows } = await pool.query(
    `INSERT INTO leagues (league_name, invite_code, created_by)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [league_name, invite_code, user_id]
  );

  const league = rows[0];

  // Auto-join creator so league shows up immediately
  await pool.query(
    `INSERT INTO league_members (user_id, league_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [user_id, league.league_id]
  );

  return league;
};

// join league
module.exports.join = async (user_id, league_id) => {
  const query = `
    INSERT INTO league_members (user_id, league_id)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING
    RETURNING *
  `;
  const { rows } = await pool.query(query, [user_id, league_id]);
  return rows[0];
};

module.exports.findByInviteCode = async (invite_code) => {
  const query = `
    SELECT * FROM leagues WHERE invite_code = $1
  `;
  const { rows } = await pool.query(query, [invite_code]);
  return rows[0] || null;
};
// get user leagues
module.exports.getUserLeagues = async (user_id) => {
  const query = `
    SELECT DISTINCT leagues.*,
      (SELECT COUNT(*) FROM league_members lm WHERE lm.league_id = leagues.league_id) AS member_count
    FROM leagues
    JOIN league_members ON leagues.league_id = league_members.league_id
    WHERE league_members.user_id = $1
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};
module.exports.destroy = async (league_id, user_id) => {
  const query = `
    DELETE FROM leagues
    WHERE league_id = $1 AND created_by = $2
    RETURNING *
  `;
  const { rows } = await pool.query(query, [league_id, user_id]);
  return rows[0] || null;
};
module.exports.getLeaderboard = async (league_id) => {
  const query = `
    SELECT users.user_id, users.username, COALESCE(SUM(predictions.points), 0) AS total_points
    FROM league_members
    JOIN users ON league_members.user_id = users.user_id
    LEFT JOIN predictions ON predictions.user_id = users.user_id
      AND predictions.league_id = $1
    WHERE league_members.league_id = $1
    GROUP BY users.user_id, users.username
    ORDER BY total_points DESC
  `;
  const { rows } = await pool.query(query, [league_id]);
  return rows;
};
