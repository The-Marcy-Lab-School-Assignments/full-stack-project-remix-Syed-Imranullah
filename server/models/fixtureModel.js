const pool = require("../db/pool");

// Get all upcoming fixtures
module.exports.getAll = async () => {
  const { rows } = await pool.query(`
    SELECT *
    FROM fixtures
    WHERE match_date >= NOW() OR status = 'live'
    ORDER BY match_date ASC
    LIMIT 50
  `);
  return rows;
};

// Create fixture (admin/seed use)
module.exports.create = async (
  api_fixture_id,
  home_team,
  away_team,
  match_date
) => {
  const { rows } = await pool.query(
    `
    INSERT INTO fixtures
      (api_fixture_id, home_team, away_team, match_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `,
    [api_fixture_id, home_team, away_team, match_date]
  );

  return rows[0];
};

// Find single fixture
module.exports.find = async (fixture_id) => {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM fixtures
    WHERE fixture_id = $1
  `,
    [fixture_id]
  );

  return rows[0] || null;
};