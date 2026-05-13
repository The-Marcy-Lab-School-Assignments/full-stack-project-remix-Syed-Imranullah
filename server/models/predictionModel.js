const pool = require('../db/pool');

// Returns all todos for a specific user, ordered by creation time
// in MatchDay this would return all predictions for a user inside a league
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM todos WHERE user_id = $1 ORDER BY todo_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single todo row (used for ownership checks before update/delete)
// used to make sure a user only edits their own prediction

module.exports.find = async (todo_id) => {
  const query = 'SELECT * FROM todos WHERE todo_id = $1';
  const { rows } = await pool.query(query, [todo_id]);
  return rows[0] || null;
};

// Creates a new todo. Returns the full todo row.
// in MatchDay this creates a new match prediction for a fixture

module.exports.create = async (title, user_id) => {
  const query = 'INSERT INTO todos (title, user_id) VALUES ($1, $2) RETURNING *';
  const { rows } = await pool.query(query, [title, user_id]);
  return rows[0];
};

// Updates is_complete for a todo. Returns the updated row.
// in MatchDay this would update a prediction or its status/points after match result

module.exports.update = async (todo_id, { is_complete }) => {
  const query = 'UPDATE todos SET is_complete = $1 WHERE todo_id = $2 RETURNING *';
  const { rows } = await pool.query(query, [is_complete, todo_id]);
  return rows[0];
};

// Deletes a todo by id
// in MatchDay this deletes a prediction entry

module.exports.destroy = async (todo_id) => {
  const query = 'DELETE FROM todos WHERE todo_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [todo_id]);
  return rows[0] || null;
};
