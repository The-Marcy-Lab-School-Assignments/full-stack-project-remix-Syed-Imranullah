const pool = require("../db/pool");

// Returns all todos for a specific user, ordered by creation time
// in MatchDay this would return all predictions for a user inside a league
module.exports.listByUser = async (user_id, league_id) => {
  const query = `
    SELECT 
      predictions.*,
      fixtures.home_team,
      fixtures.away_team,
      fixtures.match_date,
      fixtures.status
    FROM predictions
    JOIN fixtures ON predictions.fixture_id = fixtures.fixture_id
    WHERE predictions.user_id = $1
    AND predictions.league_id = $2
    ORDER BY predictions.prediction_id ASC
  `;
  const { rows } = await pool.query(query, [user_id, league_id]);
  return rows;
};

// Returns a single todo row (used for ownership checks before update/delete)
// used to make sure a user only edits their own prediction

module.exports.find = async (prediction_id) => {
  const query = `
    SELECT 
      predictions.*,
      fixtures.home_team,
      fixtures.away_team
    FROM predictions
    JOIN fixtures
      ON predictions.fixture_id = fixtures.fixture_id
    WHERE predictions.prediction_id = $1
  `;
  const { rows } = await pool.query(query, [prediction_id]);
  return rows[0] || null;
};

// Creates a new todo. Returns the full todo row.
// in MatchDay this creates a new match prediction for a fixture

module.exports.create = async (prediction, user_id, fixture_id, league_id) => {
  const query = `
    INSERT INTO predictions
    (prediction, user_id, fixture_id, league_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await pool.query(query, [
    prediction,
    user_id,
    fixture_id,
    league_id,
  ]);
  return rows[0];
};

// Updates is_complete for a todo. Returns the updated row.
// in MatchDay this would update a prediction or its status/points after match result

module.exports.update = async (prediction_id, prediction) => {
  const query = `
    UPDATE predictions
    SET prediction = $1
    WHERE prediction_id = $2
    RETURNING *
  `;
  const { rows } = await pool.query(query, [prediction, prediction_id]);
  return rows[0];
};

// Deletes a todo by id
// in MatchDay this deletes a prediction entry

module.exports.destroy = async (prediction_id) => {
  const query = `
    DELETE FROM predictions
    WHERE prediction_id = $1
    RETURNING *
  `;
  const { rows } = await pool.query(query, [prediction_id]);
  return rows[0] || null;
};
